import { React, useState, useEffect } from "react";
import "./App.css";
import Register from "./components/Auth/register";
import Login from "./components/Auth/login";
import Todo from "./components/todo";
import Navbar from "./components/navbar";
import Greetings from "./components/greetings";
import { Route, Routes } from "react-router-dom";
import ForgotPassword from "./components/Auth/forgotpassword";
import ResetPassword from "./components/Auth/resetpassword";
import Error404 from "./components/Errors/404";
import ProtectedRoute from "./utils/ProtectedRoutes";
import LoginProtected from "./utils/LoginProtected";


function App() {

  const [isScheduleChanged, setisScheduleChanged] = useState(false)
  const [isInCompleted, setIsInCompleted] = useState(false)
  return (
    <div>
    <Routes>

      <Route path="notfound" element={<Error404 />}/>

        <Route path="/register" element={<Register />} />
        <Route path="users/reset-password/:id/:token" element={<ResetPassword/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/login" element={<Login/>}/>
      
      <Route element={<ProtectedRoute />}>
      <Route path="/" element={
        [<Navbar />, <Greetings isScheduleChanged={isScheduleChanged} isInCompleted={isInCompleted} />,<Todo isScheduleChanged={isScheduleChanged} setIsScheduleChanged={setisScheduleChanged} setIsInCompleted={setIsInCompleted} isInCompleted={setIsInCompleted} />]}/>
      </Route>
      
      

      <Route path="*" element={<Error404 />}/>
    </Routes>
      
    </div>
  );
}

export default App;
