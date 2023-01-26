import './verifyemail.scss'
import {
    useSearchParams,
  } from "react-router-dom"
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';


const VerifyEmail = () => {

    const [queryParameters] = useSearchParams()

    useEffect(()=>{
        if(queryParameters.get("verificationToken") && queryParameters.get("email")){
            var config = {
                method: 'get',
                url: `/auth/verifyEmail?verificationToken=${queryParameters.get("verificationToken")}&email=${queryParameters.get("email")}`,
              };
              
              axios(config)
              .then(function (response) {
                document.getElementById('nfContainer').style.display = 'block';
                console.log(JSON.stringify(response.data));
                // toast.success('User Verified Successfully', {
                //     position: toast.POSITION.TOP_CENTER
                //   });
              })
              .catch(function (error) {
                console.log(error);
                toast.error(error.response.data.message, {
                    position: toast.POSITION.TOP_CENTER
                  });
              });
          
        }
    },[])
    
    
  return (
    <div className='verifyEmail'>
            <div id='result'>
                <ToastContainer />
            </div>

            <div id='nfContainer'>
            {/* <ContentCutIcon sx={{ fontSize: 50 }} /> */}

            <h3>Email Verified Successfully</h3>
            <p>Please Return To Login Page</p>
            <Link to='/'>Return to Login</Link>
        </div>
    </div>
  )
}

export default VerifyEmail