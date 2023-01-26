import './application.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import { DataGrid } from '@mui/x-data-grid'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Application = () => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    useEffect(()=>{
        var config = {
        method: 'get',
        url: '/application/',
      };

      setLoading(true)
      axios(config)
      .then(function (response) {
        setLoading(false)
        setData(response.data.applications);
      })
      .catch(function (error) {
        setLoading(false)
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_CENTER
        });
      });

    },[])

    
    const handleFile = (fileLink) => {
      window.open(fileLink)
    };
      
    const userColumns = [
        {
          field: "applicationTitle",
          headerName: "Application Title",
          width: 250,
        },
      
        {
          field: "applicationFile",
          headerName: "Application File",
          renderCell: (params) => {
            return (
              <Link onClick={()=>{handleFile(params.row.applicationFile)}}>{params.row.applicationFile}</Link>
            );
          },
          
          width: 300,
        },
        {
          field: "currentHolder",
          headerName: "Current Holder",
          valueGetter: (params) =>
          `${params.row?.currentHolder?.name || "-"}`,
          width: 200,
        },
        {
          field: "status",
          headerName: "Status",
          width: 150,
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
                <Link to={`/application/application-detail/${params.id}`} state={{course_id:params.id}} style={{ textDecoration: "none" }}>
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
            <div id='result'>
                <ToastContainer />
            </div>
            <div className="courseTitle">
                My Applications
                <Link to="/application/create-application" className="courseLink">
                Create Application
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
        {loading ? (
        <div className="loading-ring">
          Loading
          <span></span>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default Application
