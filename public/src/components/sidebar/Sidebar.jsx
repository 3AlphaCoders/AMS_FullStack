import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js";


const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">Dashboard</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li>
            <DashboardIcon className="icon" />
            <Link to="/">
              <span>Dashboard</span>
            </Link>
          </li>
          <p className="title">ADD SERVICES</p>
          {user?.role === "student" ? (
            ""
          ) : (
            <li>
              <GroupIcon className="icon" />
              <Link to="/users">
                <span>User</span>
              </Link>
            </li>
          )}

          {user?.role === "admin" || user?.role === "principal" ? (
            <>
              <li>
                <MenuBookIcon className="icon" />
                <Link to="/courses">
                  <span>Courses</span>
                </Link>
              </li>
              <li>
                <MenuBookIcon className="icon" />
                <Link to="/departments">
                  <span>Department</span>
                </Link>
              </li>
            </>
          ) : (
            ""
          )}
          {user?.role === "admin" ||
          user?.role === "principal" ||
          user?.role === "HOD" ? (
            <li>
              <MenuBookIcon className="icon" />
              <Link to="/classes">
                <span>Classes</span>
              </Link>
            </li>
          ) : (
            ""
          )}
          <li>
            <MenuBookIcon className="icon" />
            <Link to="/application">
              <span>My Applications</span>
            </Link>
          </li>
          {user?.role === "principal" ||
          user?.role === "HOD" ||
          user?.role === "mentor" ||
          user?.role === "admin" ? (
            <li>
              <MenuBookIcon className="icon" />
              <Link to="/pending-application">
                <span>Pending Application</span>
              </Link>
            </li>
          ) : (
            ""
          )}
          {user?.role === "admin" ? (
            ""
          ) : (
            <li>
              <MenuBookIcon className="icon" />
              <Link to="/notice">
                <span>Notice</span>
              </Link>
            </li>
          )}
          <p className="title">USER INFO</p>
          <li>
            <MenuBookIcon className="icon" />
            <Link to="/myprofile">
              <span>My Profile</span>
            </Link>
          </li>
          <li>
            <MenuBookIcon className="icon" />
            <Link to="/user/change-password">
              <span>Change Password</span>
            </Link>
          </li>
          <li>
            <SettingsIcon className="icon" />
            <Link to="/logout">
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div className="colorOptions"></div>
        <div className="colorOptions"></div>
      </div>
    </div>
  );
};

export default Sidebar;
