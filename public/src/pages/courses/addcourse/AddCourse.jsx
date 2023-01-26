import './addcourse.scss'
import axios from 'axios';
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import FormControl from '@mui/material/FormControl';
import { useRef, useState} from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCourse = ({title}) => {

  const [loading, setLoading] = useState(false);
  const courseName = useRef();
  const courseDuration = useRef();


  const handleAddCourse = (e)=>{
    e.preventDefault();
    var data = JSON.stringify({
      courseName: courseName.current.value,
      yearsCount: courseDuration.current.value
    });
    
    var config = {
      method: 'post',
      url: '/course/',
      headers: { 
        'Content-Type': 'application/json', 
     },
      data : data
    };
    setLoading(true);
    axios(config)
    .then(function (response) {
      setLoading(false);
      // console.log(JSON.stringify(response.data));
      toast.success("Course Added Successfully", {
        position: toast.POSITION.TOP_CENTER,
      });

    })
    .catch(function (error) {
      setLoading(false);
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_CENTER,
      });
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
        <div id="result">
              <ToastContainer />
            </div>  
        <div className="bottom">
          <form className="left" onSubmit={handleAddCourse}>
              <div className='inputContainer'>

                    <FormControl >
                      <label>Course Name <span>*</span></label>
                      <input 
                        className='inputBox'
                        required
                        label="Course Name"
                        placeholder='Please Enter your course name'
                        ref={courseName}
                      />
                    </FormControl>
                    <FormControl>
                      <label>Course Duration <span>*</span></label>
                      <select
                        className='inputBox'
                        label="Course Duration"
                        required
                        ref={courseDuration}
                      >
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                        <option value='6'>6</option>
                      </select>
                    </FormControl>
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
                  
                </div>
          </form>
          
        </div>
      </div>
    </div>
  )
}

export default AddCourse