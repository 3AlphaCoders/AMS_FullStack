const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    applicationTitle: {
      type: String,
      required: [true, "Application Title is required"],
      maxlength: [150, "Please limit the title to 150 characters"],
      trim: true,
    },

    applicationFile: {
      type: String,
      required: [true, "Please provide the application document"],
    },

    submittedBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    acceptedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    rejectedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    currentHolder: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    applicationLife: {
      type: [
        {
          user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
          },
          status: {
            type: String,
          },
        },
      ],
      required: true,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

const ApplicationModel = mongoose.model("Application", ApplicationSchema);

module.exports = ApplicationModel;
