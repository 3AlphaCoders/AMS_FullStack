import './createnotice.scss'
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import FormControl from '@mui/material/FormControl';
import { useContext, useRef, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../../context/AuthContext';


const CreateNotice = ({title}) => {

    const {user} = useContext(AuthContext);

    const checkValue = useRef();

    const [userinfo, setUserInfo] = useState({
      checkedUser: [],
      response: [],
    });
    const handleChange = (e) => {
      // Destructuring
      const { value, checked } = e.target;
      const { checkedUser } = userinfo;
        
      if (checked) {
        setUserInfo({
          checkedUser: [...checkedUser, value],
          response: [...checkedUser, value],
        });
      } else {
        setUserInfo({
          checkedUser: checkedUser.filter((e) => e !== value),
          response: checkedUser.filter((e) => e !== value),
        });
      }
    };
    const createNoticeFunction = (e)=>{
        e.preventDefault();
        const fileInput = document.getElementById("noticeFile");

        var data = new FormData();
        data.append('noticeTitle', 'Submit Documents');
        data.append('noticeFile', fileInput.files[0]);
        data.append('visibility', JSON.stringify(userinfo.checkedUser));
        
        var config = {
          method: 'post',
          url: '/notice/',
          headers: { 
            'Content-Type' : 'multipart/form-data'
          },
          data : data
        };
        axios(config)
        .then(function (response) {
          toast.success('Application Sent Successfully!', {
            position: toast.POSITION.TOP_CENTER
          });
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
          toast.error(error.response.data.message, {
            position: toast.POSITION.TOP_CENTER
          });
        });

    }


  return (
    <div className='createNotice'>
        <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
            <div id='result'>
                <ToastContainer />
            </div>
          <form className="left" onSubmit={createNoticeFunction}>
              <div className='inputContainer'>
            

                    <FormControl >
                      <label className='nform-head'>Select Notice Recievers <span>*</span></label>
                      {/* <input 
                        type="checkbox"
                        className='inputBox'
                        required
                        label="Name"
                        name="applicationTitle"
                        placeholder='Please Enter your name'
                        ref={appTitle}
                      /> */}
                      {user.permissions.user.map((user) => (
                          <div className='noticeCheckbox'>
                            
                            <input type="checkbox" name="checkedUser" id={user} ref={checkValue} onChange={handleChange} value={user} />
                            <label for={user}>{user}</label>
                          </div>
                          
                      ))}
                      
                    </FormControl>
                    <FormControl >
                      <label className='nform-head'>Application File <span>*</span></label>
                      <input 
                        type="file"
                        className='inputBox'
                        required
                        label="file"
                        id="noticeFile"
                      />
                    </FormControl>

                </div>
                <div className='userBtn'>
                  <button>Submit</button>
                </div>
              
                
          </form>
          
        </div>
      </div>
    </div>
  )
}

export default CreateNotice