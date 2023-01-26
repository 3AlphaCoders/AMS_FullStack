import './changepass.scss'
import axios from 'axios';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import FormControl from '@mui/material/FormControl';
import { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ChangePass = ({title}) => {

  
  const oldpass = useRef();
  const newpass = useRef();
  const confirmpass = useRef();


  const handleAddCourse = (e)=>{
    e.preventDefault();
    if(newpass.current.value === confirmpass.current.value){
        var data = JSON.stringify({
            "oldPassword": oldpass.current.value,
            "newPassword": newpass.current.value,
            "confirmPassword": confirmpass.current.value,
          });
          
          var config = {
            method: 'patch',
            url: '/user/changePassword',
            headers: { 
              'Content-Type': 'application/json', 
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            document.getElementById('changePassForm').reset();
            toast.success("Password Changed Successfully!!", {
                position: toast.POSITION.TOP_CENTER
              });
          })
          .catch(function (error) {
            toast.error(error.response.data.message, {
                position: toast.POSITION.TOP_CENTER
              });
          });
          
    }else{
        toast.error("New and confirm password not matched", {
            position: toast.POSITION.TOP_CENTER
          });
    }
  }
  
  
  return (
    <div className='addNew'>
        <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div id='result'>
              <ToastContainer />
        </div>
        <div className="bottom">
          <form className="left" id="changePassForm" onSubmit={handleAddCourse}>
              <div className='inputContainer'>

                    <FormControl >
                      <label>Old Password<span>*</span></label>
                      <input 
                        className='inputBox'
                        required
                        label="Course Name"
                        placeholder='Please Enter your course name'
                        ref={oldpass}
                      />
                    </FormControl>
                    <FormControl >
                      <label>New Password <span>*</span></label>
                      <input 
                        className='inputBox'
                        required
                        label="Course Name"
                        placeholder='Please Enter your course name'
                        ref={newpass}
                      />
                    </FormControl>
                    <FormControl >
                      <label>Confirm New Password <span>*</span></label>
                      <input 
                        className='inputBox'
                        required
                        label="Course Name"
                        placeholder='Please Enter your course name'
                        ref={confirmpass}
                      />
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

export default ChangePass