import "./departments.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FormControl } from "@mui/material";

const Departments = (props) => {
  const location = useLocation();

  const [data, setData] = useState([]);
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);

  const selCourse = useRef();

  useEffect(() => {
    if (location?.state?.course_id) {
      handleDept();
    } else {
      setData([]);

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
    }
  }, [location.state]);

  const handleDept = () => {
    if (selCourse.current.value !== "Select") {
      var config = {
        method: "get",
        url: `course/${selCourse.current.value}/`,
      };

      setLoading(true);
      axios(config)
        .then(function (response) {
          setLoading(false);
          setData(response.data.course.departments);
        })
        .catch(function (error) {
          // console.log(error);
          setLoading(false);
        });
    } else {
      setData([]);
    }
  };

  const userColumns = [
    {
      field: "deptName",
      headerName: "Department Name",
      width: 350,
    },

    {
      field: "HOD",
      headerName: "Department HOD",
      width: 350,
      valueGetter: (params) => `${params.row.HOD ? "HOD PRESENT" : "NO HOD"}`,
    },

    {
      field: "classes",
      headerName: "Total Classes",
      valueGetter: (params) =>
        `${params.row.classes ? params.row.classes.length : "No Classes"}`,
      width: 350,
    },
  ];
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to="/classes"
              style={{ textDecoration: "none" }}
              
            >
            {/* state={{
                course_id:
                  location?.state?.course_id || selCourse.current.value,
                course_name: location?.state?.course_name,
                dept_id: params.id,
                dept_name: params.row.deptName,
              }} */}
              <div className="viewButton">View Classes</div>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="courses">
      <Sidebar />
      <div className="courseContainer">
        <Navbar />

        <div className="courseTitle">
          Departments
          <Link to="/departments/adddepartment" className="courseLink">
            Add New Department
          </Link>
        </div>
        <form>
          <FormControl fullWidth>
            <label>
              Course <span>*</span>
            </label>
            <select
              className="inputBox"
              placeholder="Select option"
              name={"course"}
              label="Course"
              ref={selCourse}
              required
              id="courseMenu"
              onChange={handleDept}
            >
              {location?.state?.course_id ? (
                <option value={location.state.course_id}>
                  {location.state.course_name}
                </option>
              ) : (
                <>
                  <option>Select</option>
                  {course.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.courseName}
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
          columns={userColumns.concat(actionColumn)}
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

export default Departments;
