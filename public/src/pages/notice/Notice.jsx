import "./notice.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notice = () => {
  const [loading ,setLoading] = useState(false)
  const [data, setData] = useState([]);
  useEffect(() => {
    var config = {
      method: "get",
      url: "/notice/",
    };
    setLoading(true)
    axios(config)
      .then(function (response) {
        setLoading(false)
        setData(response.data.notices);
      })
      .catch(function (error) {
        setLoading(false)
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  }, []);

  const handleFile = (fileLink) => {
    window.open(fileLink);
  };

  const userColumns = [
    {
      field: "noticeTitle",
      headerName: "Notice Title",
      width: 300,
    },

    {
      field: "noticeFile",
      headerName: "Notice File",
      renderCell: (params) => {
        return (
          <Link
            onClick={() => {
              handleFile(params.row.noticeFile);
            }}
          >
            {params.row.noticeFile}
          </Link>
        );
      },

      width: 350,
    },
    {
      field: "postedBy",
      headerName: "Posted By",
      valueGetter: (params) => `${params.row.postedBy.role}`,
      width: 250,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
    },
  ];

  return (
    <div className="courses">
      <Sidebar />
      <div className="courseContainer">
        <Navbar />
        <div id="result">
          <ToastContainer />
        </div>
        <div className="courseTitle">
          My Notices
          <Link to="/notice/create-notice" className="courseLink">
            Create Notices
          </Link>
        </div>
        <DataGrid
          className="datagrid"
          rows={data}
          getRowId={(row) => row._id}
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

export default Notice;
