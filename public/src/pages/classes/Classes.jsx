import "./classes.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FormControl } from "@mui/material";

const Classes = () => {
  const { user } = useContext(AuthContext);
  // const location = useLocation();
  // console.log(location);
  const [data, setData] = useState([]);
  const [course, setCourse] = useState([]);
  const [dept, setDept] = useState([]);
  const [currentuser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(false);

  const selCourse = useRef();
  const selDept = useRef();

  useEffect(() => {
    if (user?.role === "HOD") {
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
        });
        if(currentuser?.role === "HOD"){
          showClasses();
        }
     
    } else {
      setData([]);
    }
  }, [currentuser?.role]);

  const checkYear = (checkYear) => {
    if (checkYear === 1) {
      return "st";
    } else if (checkYear === 2) {
      return "nd";
    } else if (checkYear === 3) {
      return "rd";
    } else {
      return "th";
    }
  };
  const handleCourse = () => {
    setData([]);
    setDept([]);
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

  const handleDept = () => {
    if (selCourse.current.value !== "select") {
      var config = {
        method: "get",
        url: `course/${selCourse.current.value}/`,
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

  const showClasses = () => {
    if (
      selCourse.current.value !== "select" &&
      selDept.current.value !== "select"
    ) {
      var config = {
        method: "get",
        url: `/course/${selCourse.current.value}/${selDept.current.value}`,
      };

      setLoading(true);
      axios(config)
        .then(function (response) {
          setLoading(false);
          setData(response.data.department.classes);
        })
        .catch(function (error) {
          setLoading(false);
          // console.log(error);
        });
    }
  };

  const userColumns = [
    {
      field: "year",
      headerName: "Course Year",
      width: 220,
      valueGetter: (params) =>
        `${
          params.row.year
            ? `${params.row.year + checkYear(params.row.year) + " year"}`
            : "Not Assigned"
        }`,
    },
    {
      field: "section",
      headerName: "Section",
      width: 200,
    },
    {
      field: "seats",
      headerName: "Total Seats in Section",
      width: 300,
    },
    {
      field: "mentor",
      headerName: "Mentor",
      width: 300,
      valueGetter: (params) =>
        `${params.row.mentor ? "Mentor Present" : "No Mentor"}`,
    },
  ];
  // const actionColumn = [
  //   {
  //     field: "action",
  //     headerName: "Action",
  //     width: 200,
  //     renderCell: (params) => {
  //       return (
  //         <div className="cellAction">
  //           <Link to='/departments/adddepartment' style={{ textDecoration: "none" }}>
  //             <div className="viewButton">Add New Classes</div>
  //           </Link>

  //         </div>
  //       );
  //     },
  //   },
  // ];

  return (
    <div className="courses">
      <Sidebar />
      <div className="courseContainer">
        <Navbar />

        <div className="courseTitle">
          All Classes
          <Link to="/classes/addclass" className="courseLink">
            Add New Classes
          </Link>
        </div>
        <form>
          <FormControl fullWidth>
            <label>
              Course <span>*</span>
            </label>
            <select
              className="inputBox"
              name={"course"}
              label="Course"
              ref={selCourse}
              required
              onClick={handleCourse}
              onChange={handleDept}
            >
              {user?.role === "HOD" ? (
                <option value={currentuser?.courseId?._id}>
                  {currentuser?.courseId?.courseName}
                </option>
              ) : (
                <>
                  <option>select</option>
                  {course.map((courseEle) => (
                    <option key={courseEle._id} value={courseEle._id}>
                      {courseEle.courseName}
                    </option>
                  ))}
                </>
              )}
            </select>
          </FormControl>
          <FormControl fullWidth>
            <label>
              Departments <span>*</span>
            </label>
            <select
              className="inputBox"
              name="department"
              label="Department"
              ref={selDept}
              required
              onClick={handleDept}
              onChange={showClasses}
            >
              {user.role === "HOD" ? (
                <option value={currentuser?.deptId?._id}>
                  {currentuser?.deptId?.deptName}
                </option>
              ) : (
                <>
                  <option>select</option>
                  {dept.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.deptName}
                    </option>
                  ))}
                </>
              )}
            </select>
          </FormControl>
        </form>
        <DataGrid
          className="datagrid"
          getRowId={(row) => row._id}
          rows={data}
          columns={userColumns}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
        {loading ? (
          <div className="loading-ring">
            Loading
            <span></span>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Classes;
