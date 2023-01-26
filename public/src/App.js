import './app.scss'
import Home from "./pages/home/Home";

import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Myprofile from "./pages/myprofile/Myprofile";
import AddUser from "./pages/adduser/AddUser";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import Courses from "./pages/courses/Courses";
import Departments from "./pages/departments/Departments";
import Classes from "./pages/classes/Classes";
import Application from "./pages/application/Application";
import AddCourse from "./pages/courses/addcourse/AddCourse";
import AddDepartment from "./pages/departments/adddepartment/AddDepartment";
import AddClasses from "./pages/classes/addclass/AddClass";
import CreateApplication from "./pages/application/createapplication/CreateApplication";
import NotFound from "./pages/notfound/NotFound";
import ChangePass from "./pages/changepass/ChangePass";
import Logout from "./components/logout/Logout";
import axios from "axios";
import PendingApplication from "./pages/pendingapplication/PendingApplication";
import Notice from "./pages/notice/Notice";
import CreateNotice from "./pages/notice/createnotice/CreateNotice";
import VerifyEmail from "./pages/verifyemail/VerifyEmail";
import ApplicationDetail from './pages/application/applicationdetail/ApplicationDetail';

function App() {
  const [data, setData] = useState([]);
  const [course, setCourse] = useState([]);

  const { user } = useContext(AuthContext);
  
  useEffect(()=>{
    if(user !== null){
      const showMeQuery = {
        method: 'get',
        url: `/user/showMe`,
      };
      
      axios(showMeQuery)
      .then(function (response) {
        setData(response.data.user)
        if(user?.role === 'HOD' || user?.role === 'mentor'){
          setCourse(response.data.user)
        }
      })
      .catch(function (error) {
        // console.log(error);
      });
  

    if(user?.role === 'admin' || user?.role === 'principal'){
      var courseQuery = {
        method: "get",
        url: "/course/",
      };
      
      axios(courseQuery)
        .then(function (response) {
          setCourse(response.data.courses);
        })
        .catch(function (error) {
          // console.log(error);
        });
    }

    }
    
  },[user])


  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/">
            <Route
              path="login"
              element={user?.role ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route index element={user ? <Home /> : <Login />} />
            {user ? (
              <>
                <Route
                  path="/dashboard"
                  element={user ? <Home /> : <Login />}
                ></Route>
                {user?.role === "student" ? (
                  ""
                ) : (
                  <Route path="users">
                    <Route index element={<List />} />
                    <Route
                      path="adduser"
                      element={<AddUser props={course || data} />}
                    />
                  </Route>
                )}
                {user?.role === "admin" || user?.role === "principal" ? (
                  <>
                    <Route path="courses">
                      <Route index element={<Courses  allCourses={course}  />} />
                      <Route
                        path="addcourse"
                        element={<AddCourse />}
                      />
                    </Route>
                    <Route path="departments">
                      <Route index element={<Departments allCourses={course} />} />
                      <Route
                        path="adddepartment"
                        element={<AddDepartment title="Add new Department" />}
                      />
                    </Route>
                  </>
                ) : (
                  ""
                )}

                {user?.role === "admin" ||
                user?.role === "principal" ||
                user?.role === "HOD" ? (
                  <Route path="classes">
                    <Route index element={<Classes />} />
                    <Route
                      path="addclass"
                      element={<AddClasses title="Add new Class" />}
                    />
                  </Route>
                ) : (
                  ""
                )}
               

                <Route path="myprofile" element={<Myprofile props={data} />}></Route>
                <Route
                  path="user/change-password"
                  element={<ChangePass />}
                ></Route>
                <Route path="logout" element={<Logout />}></Route>

                {user?.role === "principal" ||
                user?.role === "HOD" ||
                user?.role === "mentor" ||
                user.role === "admin" ? (
                  <Route
                    path="pending-application"
                    element={<PendingApplication />}
                  ></Route>
                ) : (
                  ""
                )}
                {user?.role === "admin" ? (
                  ""
                ) : (
                  <>
                    <Route path="application">
                      <Route index element={<Application />} />
                      <Route
                        path="create-application"
                        element={
                          <CreateApplication title="Create New Application" />
                        }
                      />
                      <Route
                        path="application-detail/:id"
                        element={
                          <ApplicationDetail />
                        }
                      />
                    </Route>
                    <Route path="notice">
                      <Route index element={<Notice />} />
                      <Route
                        path="create-notice"
                        element={<CreateNotice title="Create New Notice" />}
                      />
                    </Route>
                  </>
                )}
              </>
            ) : (
              <Route path="*" element={<NotFound />} />
            )}
            <Route path="/verifyEmail" element={<VerifyEmail />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
