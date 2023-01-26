import './adddepartment.scss'
import axios from 'axios';
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import FormControl from '@mui/material/FormControl';
import { useRef, useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
const AddDepartment = ({title}) => {

  const [course, setCourse] = useState([]);
  const [hods, setHods] = useState([]);
  // console.log(course_id)
  
  const deptName = useRef();
  const selHOD = useRef();
  const selCourse = useRef();

  const handleCourseFunc = ()=>{
    axios
    .get(/course/)
    .then((response) => {
      setCourse(response.data.courses)
    });
    if(selCourse.current.value !== 'select'){
      var config = {
        method: 'get',
        url: `/course/${selCourse.current.value}/HODs`,
      };
      
      axios(config)
      .then(function (response) {
        setHods(response.data.HODs)
      })
      .catch(function (error) {
        console.log(error);
      });
    }
      
  }

  const handleAddDepartment = (e)=>{
    e.preventDefault();
    var data = JSON.stringify({
      deptName: deptName.current.value,
      HOD: selHOD.current.value
    });
    
    var config = {
      method: 'post',
      url: `/course/${selCourse.current.value}/addDept`,
      headers: { 
        'Content-Type': 'application/json', },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
    
  }
  
  
  return (
    <div className='addNew'>
        <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <form className="left" onSubmit={handleAddDepartment}>
              <div className='inputContainer'>

                        <FormControl fullWidth>
                        <label>Course <span>*</span></label>
                          {/* <InputLabel id="demo-simple-select-label">Course</InputLabel> */}
                          <select
                            className='inputBox'
                            name={'course'}
                            label="Course"
                            ref={selCourse}
                            required
                            onClick={handleCourseFunc}
                          >
                            <option disabled selected>select</option>
                            {course.map((user) => (
                                    
                                    <option key={user._id} value={user._id}>{user.courseName}</option>
                                  ))}

                                  
                          </select>
                        </FormControl>
                    <FormControl >
                      <label>Department Name <span>*</span></label>
                      <input 
                        className='inputBox'
                        required
                        label="Course Name"
                        placeholder='Please Enter your course name'
                        ref={deptName}
                      />
                    </FormControl>
                    <FormControl>
                      <label>Course HODs<span>*</span></label>
                      <select
                        className='inputBox'
                        label="Course Duration"
                        required
                        ref={selHOD}
                      >
                      <option disabled selected>select</option>
                            {hods.map((user) => (
                                    
                                    <option key={user._id} value={user._id}>{user.name}</option>
                                  ))}
                        
                      </select>
                    </FormControl>
                    <div className='userBtn'>
                      <button>Submit</button>
                    </div>
                  
                </div>
          </form>
          
        </div>
      </div>
    </div>
  )
}

export default AddDepartment