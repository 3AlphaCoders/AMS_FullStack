import "./adduser.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import FormControl from "@mui/material/FormControl";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AddUser = (props) => {
  const { user } = useContext(AuthContext);

  const [role, setRole] = useState("select");
  const [course, setCourse] = useState([]);
  const [dept, setDept] = useState([]);
  const [classdet, setClassdet] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [currentuser, setCurrentUser] = useState();
  // const [dept, setDept] = useState([]);

  const selRole = useRef();
  const name = useRef();
  const pass = useRef();
  const cpass = useRef();
  const id = useRef();
  const email = useRef();
  const selCourse = useRef();
  const selDept = useRef();
  const selClass = useRef();

  useEffect(() => {
    
    if(props?.props?.role === "HOD"){
      var config = {
        method: 'get',
        url: `/course/${props.props?.courseId?._id}/${props.props?.deptId?._id}`,
      };
      
      axios(config)
      .then(function (response) {
        setClassdet(response.data.department.classes)
        // console.log(response.data);
      })
      .catch(function (error) {
        // console.log(error);
      });
      
      
    }
  }, [props.props.role]);

  const handleCourse = () => {
    // if (user.role === "admin" || user.role === "principal") {
    //       axios.get(/course/).then((response) => {
    //         setCourse(response.data.courses);
    //       });
    // if(user?.role === 'admin' || user?.role === 'principal'){
    //   setCourse(props.props)
    // }else{
    //   console.log(props)
    // }
    // if(props?.props?.role === "HOD" || props?.props?.role === 'mentor'){
    //   handleClassFunc()
    // }
  };
  const handleDeptFunc = (e) => {
    if (user.role === "admin" || user.role === "principal") {
      var config = {
        method: "get",
        url: `/course/${selCourse.current.value}/`,
      };

      axios(config)
        .then(function (response) {
          setDept(response.data.course.departments);
        })
        .catch(function (error) {
          // setError(error.response.data.message)
          toast.error(error.response.data.message, {
            position: toast.POSITION.TOP_CENTER,
          });
        });
    }
  };

  const handleClassFunc = (e) => {
    // if (user?.role === "admin" || user?.role === "principal") {
    //   var config = {
    //     method: "get",
    //     url: `/course/${selCourse.current.value}/${selDept.current.value}`,
    //   };
    // } else {
    //   config = {
    //     method: "get",
    //     url: `/course/${selCourse.courseId._id}/${selCourse.deptId._id}`,
    //   };
    // }

    var config = {
      method: "get",
      url: `/course/${selCourse?.current?.value}/${selDept?.current?.value}`,
    };
    axios(config)
      .then(function (response) {
        setClassdet(response.data.department.classes);
        // console.log(response.data.department.classes)
      })
      .catch(function (error) {
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        // setError(error.response.data.message)
      });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (pass.current.value === cpass.current.value) {
      var data = {
        name: name.current.value,
        email: email.current.value,
        password: pass.current.value,
        confirmPassword: cpass.current.value,
        role: selRole.current.value,
      };
      if (selRole.current.value === "HOD") {
        data.courseId = selCourse.current.value;
      } else if (
        selRole.current.value === "mentor" ||
        selRole.current.value === "teacher"
      ) {
        data.courseId = selCourse.current.value;
        data.deptId = selDept.current.value;
      } else if (selRole.current.value === "student") {
        data.courseId = selCourse.current.value;
        data.deptId = selDept.current.value;
        data.classId = selClass.current.value;
      }

      var config = {
        method: "post",
        url: "/auth/createUser",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      };

      setLoading(true);
      axios(config)
        .then(function (response) {
          document.getElementById("addUserForm").reset();
          toast.success("User Added Successfully!", {
            position: toast.POSITION.TOP_CENTER,
          });
          setLoading(false);
        })
        .catch(function (error) {
          toast.error(error.response.data.message, {
            position: toast.POSITION.TOP_CENTER,
          });
          setLoading(false);
          // setError(error.response.data.message)
        });
    } else {
      toast.error("Password and confirm password not matched", {
        position: toast.POSITION.TOP_CENTER,
      });
      // setError("Password and confirm password not matched");
    }
  };

  return (
    <div className="addNew">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>ADD NEW USER</h1>
        </div>
        <div className="bottom">
          <form className="left" id="addUserForm" onSubmit={handleAddUser}>
            <div id="result">
              <ToastContainer />
            </div>
            <div className="inputContainer">
              <FormControl>
                <label>
                  Role <span>*</span>
                </label>
                <select
                  className="inputBox"
                  label="Role"
                  required
                  ref={selRole}
                  onChange={(e) => {
                    setRole(e.target.value);
                    handleCourse();
                  }}
                >
                  <option>select</option>
                  {user.permissions.user.map((user, index) => (
                    <option key={index} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </FormControl>

              <FormControl>
                <label>
                  Name <span>*</span>
                </label>
                <input
                  className="inputBox"
                  required
                  type="text"
                  label="Name"
                  placeholder="Please Enter your name"
                  ref={name}
                />
              </FormControl>
              <FormControl>
                <label>
                  Password <span>*</span>
                </label>
                <input
                  required
                  type="password"
                  className="inputBox"
                  label="Password"
                  placeholder="Please Enter Password"
                  ref={pass}
                />
              </FormControl>
              <FormControl>
                <label>
                  Confirm Password <span>*</span>
                </label>
                <input
                  required
                  type="password"
                  className="inputBox"
                  label="Confirm Password"
                  placeholder="Please Confirm Password"
                  ref={cpass}
                />
              </FormControl>
              <FormControl>
                <label>Id</label>
                <input
                  label="Id"
                  className="inputBox"
                  placeholder="Please Enter Id"
                  ref={id}
                />
              </FormControl>
              <FormControl>
                <label>
                  Email <span>*</span>
                </label>
                <input
                  required
                  className="inputBox"
                  type="email"
                  label="Email"
                  placeholder="Please Enter Email Id"
                  ref={email}
                />
              </FormControl>

              {role === "select" || role === "principal" ? (
                " "
              ) : (
                <FormControl fullWidth>
                  <label>
                    Course <span>*</span>
                  </label>
                  {/* <InputLabel id="demo-simple-select-label">Course</InputLabel> */}
                  <select
                    className="inputBox"
                    name={"course"}
                    label="Course"
                    ref={selCourse}
                    required
                    onChange={handleDeptFunc}
                    defaultValue={"select"}
                  >
                    {user.role === "mentor" || user.role === "HOD" ? (
                      <option value={props?.props?.courseId?._id}>
                        {props?.props?.courseId?.courseName}
                      </option>
                    ) : (
                      <>
                        <option>select</option>
                        {props?.props?.map((courseDetail) => (
                          <option
                            key={courseDetail._id}
                            value={courseDetail._id}
                          >
                            {courseDetail.courseName}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </FormControl>
              )}
              {role === "principal" || role === "HOD" || role === "select" ? (
                " "
              ) : (
                <FormControl fullWidth>
                  <label>
                    Department <span>*</span>
                  </label>
                  {/* <InputLabel id="demo-simple-select-label">Course</InputLabel> */}
                  <select
                    className="inputBox"
                    label="Department"
                    ref={selDept}
                    required
                    onChange={handleClassFunc}
                  >
                    {user.role === "mentor" || user.role === "HOD" ? (
                      <option value={props?.props?.deptId?._id}>
                        {props?.props?.deptId?.deptName}
                      </option>
                    ) : (
                      <>
                        <option>select</option>
                        {dept.map((deptDetail) => (
                          <option key={deptDetail._id} value={deptDetail._id}>
                            {deptDetail.deptName}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </FormControl>
              )}

              {role === "student" ? (
                <FormControl fullWidth>
                  <label>
                    Class <span>*</span>
                  </label>
                  <select
                    className="inputBox"
                    label="Class"
                    ref={selClass}
                    required
                  >
                    {user.role === "mentor" ? (
                      <option value={props?.props?.classId}>
                        Auto Selected
                      </option>
                    ) : (
                      <>
                        <option>select</option>
                        {classdet.map((classDetail) => (
                          <option key={classDetail?._id} value={classDetail?._id}>
                        {classDetail?.year} {classDetail?.section}
                      </option>
                        ))}
                      </>
                    )}
                  </select>
                </FormControl>
              ) : (
                ""
              )}
            </div>
            <div id="userBtn">
              <button>
                {loading ? (
                  <div className="loading-ring">
                    Loading
                    <span></span>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
