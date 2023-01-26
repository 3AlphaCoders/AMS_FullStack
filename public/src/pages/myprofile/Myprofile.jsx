import "./myprofile.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import Widget from "../../components/widget/Widget";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const Myprofile = (info) => {
  const [data, setData] = useState([]);
  const [myapplication, setMyApplication] = useState([]);

  //fetching my applications
  useEffect(() => {
    var configApp = {
      method: "get",
      url: "/application/",
    };

    axios(configApp)
      .then(function (response) {
        setMyApplication(response.data.applications);
      })
      .catch(function (error) {
      });
  }, []);

  //fetching users information
  useEffect(()=>{
    var config = {
        method: 'get',
        url: '/user/showMe',
      };

      axios(config)
      .then(function (response) {
        setData(response.data.user)
      })
      .catch(function (error) {
      });
    },[])

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <h1 className="title">Information</h1>
            <div className="item">
              {/* <img
                src="https://pixabay.com/get/g00290d29754ea45ef5cc836fdb340bf6b0846e339c226423b2ab648c4aa886872e46b1af0da7c60076ee17ad928a52477e053958e7786c4a6c1d9944cf6c6d7a2e6a828292df772cf75eb977927fd4c2_1920.jpg"
                alt=""
                className="itemImg"
              /> */}
              <div className="details">
              <h1 className="itemTitle">{info?.props?.name || data?.name}</h1>
                <div className="profileItems">
                 
                  <div className="detailItem">
                    <span className="itemKey">Email:</span>
                    <span className="itemValue">{info?.props?.email || data?.email}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Role:</span>
                    <span className="itemValue">{info?.props?.role || data?.role}</span>
                  </div>
                </div>
                {(info?.props?.role === 'admin' || data?.role === 'admin' || info?.props.role==='principal' || data?.role === 'principal')?'':
                <div className="profileItems">
                  <div className="detailItem">
                    <span className="itemKey">Course Name:</span>
                    <span className="itemValue">{info?.props?.courseId?.courseName || data?.courseId?.courseName}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Department:</span>
                    <span className="itemValue">{info?.props?.deptId?.deptName || data?.deptId?.deptName}</span>
                  </div>
                </div>} 

                {/* <div className="detailItem">
                  <span className="itemKey">Application Filled:</span>
                  <span className="itemValue">
                    {data.applicationsFiled}
                  </span>
                </div> */}
              </div>
            </div>
          </div>
          <div className="right">
          {(info?.props?.role === 'admin' || data?.role === 'admin' || info?.props.role==='principal' || data?.role === 'principal')?'':
            <Widget type={"Application Filed"} data={data?.applicationsFiled} />}
            
            <Widget
              type={"Application Received"}
              data={info?.props?.applicationsReceived || data?.applicationsReceived}
            />
            <Widget
              type={"Application Approved"}
              data={info?.props?.applicationsApproved || data?.applicationsApproved}
            />
            <Widget
              type={"Application Rejected"}
              data={info?.props?.applicationsRejected || data?.applicationsRejected}
            />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">My Applications</h1>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Application Title</TableCell>
                  <TableCell align="left">Application File</TableCell>
                  <TableCell align="left">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myapplication?.map((row) => (
                  <TableRow
                    key={row._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{row.applicationTitle}</TableCell>
                    <TableCell>
                      <a href={row.applicationFile}>{row.applicationFile}</a>
                    </TableCell>
                    <TableCell>
                      <span className={row.status}>{row.status}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
