import "./pendingapplication.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const PendingApplication = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    var config = {
      method: "get",
      url: "/application/pending",
    };

    axios(config)
      .then(function (response) {
        setData(response.data.applications);
      })
      .catch(function (error) {
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  }, []);

  const handleApplicationAction = (id, action) => {
    var config = {
      method: "patch",
      url: `/application/${id}/action?action=${action}`,
    };

    setLoading(true);
    axios(config)
      .then(function (response) {
        setLoading(false);
        toast.success(`Application ${action}!`, {
          position: toast.POSITION.TOP_CENTER,
        });
      })
      .catch(function (error) {
        setLoading(false);
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };

  const handleFile = (fileLink) => {
    window.open(fileLink);
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
          <Link
            onClick={() => {
              handleFile(params.row.applicationFile);
            }}
          >
            {params.row.applicationFile}
          </Link>
        );
      },

      width: 300,
    },
    {
      field: "submittedBy",
      headerName: "Submitted By",
      valueGetter: (params) => `${params.row.submittedBy.name}`,
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
            <Link
              state={{ course_id: params.id }}
              style={{ textDecoration: "none" }}
              onClick={() => {
                handleApplicationAction(params.row._id, "accepted");
              }}
            >
              <div className="viewButton">Approve</div>
            </Link>
            <Link
              state={{ course_id: params.id }}
              style={{ textDecoration: "none" }}
              onClick={() => {
                handleApplicationAction(params.row._id, "rejected");
              }}
            >
              <div className="viewButton">Reject</div>
            </Link>
            {user.role === "admin" ? (
              ""
            ) : (
              <Link
                state={{ course_id: params.id }}
                style={{ textDecoration: "none" }}
                onClick={() => {
                  handleApplicationAction(params.row._id, "forwarded");
                }}
              >
                <div className="viewButton">Forward</div>
              </Link>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="pendingApplication">
      <Sidebar />
      <div className="courseContainer">
        <Navbar />
        <div id="result">
          <ToastContainer />
        </div>
        <div className="courseTitle">
          Pending Applications
          {/* <Link to="/application/create-application" className="courseLink">
                Create Application
                </Link> */}
        </div>
        <DataGrid
          className="datagrid"
          rows={data}
          getRowId={(row) => row._id}
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

export default PendingApplication;
