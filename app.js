require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

// file upload and cloudinary
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// database
const connectDB = require("./db/connect");

// middlewares
const { authenticateUser } = require("./middleware/authentication-middleware");
const notFoundHandler = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// routes
const authRouter = require("./routes/authRoutes");
const courseRouter = require("./routes/courseRoutes");
const applicationRouter = require("./routes/applicationRoutes");
const userRouter = require("./routes/userRoutes");
const noticeRouter = require("./routes/noticeRoutes");

app.set('trust proxy', 1);

app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan("tiny"));
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(fileUpload());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/course", [authenticateUser, courseRouter]);
app.use("/api/v1/application", [authenticateUser, applicationRouter]);
app.use("/api/v1/user", [authenticateUser, userRouter]);
app.use("/api/v1/notice", [authenticateUser, noticeRouter]);

app.use(notFoundHandler);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Server is listening on PORT ${PORT} 🚀`)
    );
  } catch (error) {
    console.log("Connection Failed!", error);
  }
};

start();
