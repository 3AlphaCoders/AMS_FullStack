import './logout.scss'
import axios from 'axios';
import { useEffect } from 'react';
// import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Logout = () => {

    // const navigate = useNavigate();
  
    useEffect(()=>{
        var data = '';

        var config = {
            method: 'post',
            url: '/auth/logout',
            headers: { },
            data : data
            };

            axios(config)
            .then(function (response) {
                localStorage.clear();
                toast.success("Logout Successful", {
                    position: toast.POSITION.TOP_CENTER
                  });
                 
                  window.location.assign('/login')

            })
            .catch(function (error) {
                toast.error(error.response.data.message, {
                    position: toast.POSITION.TOP_CENTER
                  });
        });

    },[])


  return (
    <div>
        <div id='result'>
            <ToastContainer />
        </div>
    
    </div>
  )
}

export default Logout