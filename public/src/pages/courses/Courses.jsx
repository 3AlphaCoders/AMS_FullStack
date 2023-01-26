import './courses.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import { DataGrid } from '@mui/x-data-grid'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useEffect, useState } from 'react'


const Courses = (props) => {

    
    const [data, setData] = useState([]);
    useEffect(()=>{
        var config = {
            method: 'get',
            url: 'course/',
          };
          
          axios(config)
          .then(function (response) {
            setData(response.data.courses)
          })
          .catch(function (error) {
            console.log(error);
          });
    },[])

    useEffect(()=>{
      setData(props?.allCourses)
    },[props?.allCourses])
      
    const userColumns = [
        {
          field: "courseName",
          headerName: "Course Name",
          width: 300,
        },
      
        {
          field: "yearsCount",
          headerName: "Course Duration",
          width: 300,
        },
        {
          field: "departments",
          headerName: "Total Department",
          valueGetter: (params) =>
          `${params.row.departments?params.row.departments.length:'No Department'}`,
          width: 300,
        },
      ];
      const actionColumn = [
        {
          field: "action",
          headerName: "Action",
          width: 300,
          renderCell: (params) => {
            return (
              <div className="cellAction">
             
                <Link to='/departments' state={{course_id:params.id, course_name:params.row.courseName}} style={{ textDecoration: "none" }}>
                  <div className="viewButton">View Detail</div>
                </Link>
                
              </div>
            );
          },
        },
      ];

  return (
    <div className='courses'>
        <Sidebar />
        <div className='courseContainer'>
            <Navbar />
            
            <div className="courseTitle">
                Add New Course
                <Link to="/courses/addcourse" className="courseLink">
                Add New Course
                </Link>
            </div>
            <DataGrid
                className="datagrid"
                rows={data}
                getRowId={row => row._id}

                columns={userColumns.concat(actionColumn)}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
            />
        </div>
    </div>
  )
}

export default Courses
