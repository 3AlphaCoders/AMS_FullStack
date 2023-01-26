import "./addclass.scss";
import axios from "axios";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import FormControl from "@mui/material/FormControl";
import { useRef, useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddDepartment = ({ title }) => {
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState([]);
  const [dept, setDept] = useState([]);
  const [deptmentor, setDeptMentor] = useState([]);
  // const [year, setYear] = useState();

  const selCourse = useRef();
  const selDept = useRef();
  const selDeptMentor = useRef();
  const section = useRef();
  const seats = useRef();
  const selYear = useRef();
  const [currentuser, setCurrentUser] = useState();

  useEffect(() => {
    var config = {
      method: "get",
      url: "/user/showMe",
    };

    axios(config)
      .then(function (response) {
        setCurrentUser(response.data.user);
      })
      .catch(function (error) {
        // console.log(error);
        // toast.error(error.response.data.message, {
        //   position: toast.POSITION.TOP_CENTER
        // });
        // setError(error.response.data.message)
      });
  }, []);

  const handleCourseFunc = () => {
    var config = {
      method: "get",
      url: "/course/",
    };

    axios(config)
      .then(function (response) {
        setCourse(response.data.courses);
      })
      .catch(function (error) {
        // console.log(error);
      });
  };

  const handleDept = (e) => {
    if (selCourse.current.value !== "select") {
      // const courseSelEle = document.getElementById("courseSel");
      // const selectedCourse = courseSelEle.value;
      // const options = courseSelEle.childNodes;
      // for (let option of options) {
      //   if (option.value === selectedCourse) {
      //     setYear(Number(option.getAttribute("data-duration")));
      //   }
      // }
      // console.log(year);
      var config = {
        method: "get",
        url: `/course/${selCourse.current.value}/`,
      };

      axios(config)
        .then(function (response) {
          setDept(response.data.course.departments);
        })
        .catch(function (error) {
          // console.log(error);
        });
    }
  };
  const handleDeptMentor = (e) => {
    if (
      selCourse.current.value !== "select" &&
      selDept.current.value !== "select"
    ) {
      var config = {
        method: "get",
        url: `/course/${selCourse.current.value}/${selDept.current.value}/mentors`,
      };

      axios(config)
        .then(function (response) {
          setDeptMentor(response.data.mentors);
        })
        .catch(function (error) {
          // console.log(error);
        });
    }
  };

  const handleAddDepartment = (e) => {
    e.preventDefault();
    var data = JSON.stringify({
      mentor: selDeptMentor.current.value,
      year: selYear.current.value,
      section: section.current.value,
      seats: seats.current.value,
    });

    var config = {
      method: "post",
      url: `/course/${selCourse.current.value}/${selDept.current.value}/addClass`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        toast.success("Class Added Successfully!", {
          position: toast.POSITION.TOP_CENTER,
        });
      })
      .catch(function (error) {
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };

  return (
    <div className="addNew">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div id="result">
          <ToastContainer />
        </div>
        <div className="bottom">
          <form className="left" onSubmit={handleAddDepartment}>
            <div className="inputContainer">
              <FormControl fullWidth>
                <label>
                  Course <span>*</span>
                </label>
                {/* <InputLabel id="demo-simple-select-label">Course</InputLabel> */}
                <select
                  className="inputBox"
                  name={"course"}
                  id="courseSel"
                  label="Course"
                  ref={selCourse}
                  required
                  onClick={handleCourseFunc}
                  onChange={handleDept}
                >
                  {user.role === "HOD" ? (
                    <option value={currentuser?.courseId._id} disabled>
                      {currentuser?.courseId.courseName}
                    </option>
                  ) : (
                    <>
                      <option>
                        select
                      </option>
                      {course.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.courseName}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </FormControl>
              <FormControl fullWidth>
                <label>
                  Department <span>*</span>
                </label>
                <select
                  className="inputBox"
                  name={"course"}
                  label="Course"
                  ref={selDept}
                  required
                  onChange={handleDeptMentor}
                >
                  {user.role === "HOD" ? (
                    <option value={currentuser?.deptId?._id} disabled>
                      {currentuser?.deptId?.deptName}
                    </option>
                  ) : (
                    <>
                      <option>
                        select
                      </option>
                      {dept.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.deptName}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </FormControl>

              <FormControl fullWidth>
                <label>
                  Department Mentor<span>*</span>
                </label>
                {/* <InputLabel id="demo-simple-select-label">Course</InputLabel> */}
                <select
                  className="inputBox"
                  name={"course"}
                  label="Course"
                  ref={selDeptMentor}
                  required
                  onClick={handleDeptMentor}
                >
                  <option>
                    select98
                  </option>
                  {deptmentor.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormControl>
                <label>
                  Year <span>*</span>
                </label>
                <input
                  type="number"
                  id="yearInput"
                  label="year"
                  className="inputBox"
                  placeholder="Please Enter Year Of the Class"
                  required
                  min="1"
                  ref={selYear}
                />
              </FormControl>
              <FormControl>
                <label>
                  Section <span>*</span>
                </label>
                <input
                  label="Section"
                  className="inputBox"
                  placeholder="Please Enter Section"
                  ref={section}
                  required
                />
              </FormControl>
              <FormControl>
                <label>
                  Seat <span>*</span>
                </label>
                <input
                  label="seats"
                  className="inputBox"
                  placeholder="Please Enter seats"
                  ref={seats}
                  required
                />
              </FormControl>
              <div className="userBtn">
                <button>Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
