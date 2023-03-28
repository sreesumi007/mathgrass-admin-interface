import { Fragment, useEffect, useState } from "react";
import GraphEditor from "./Components/GraphEditor/GraphEditor";
import "./App.css";
import UserLogin from "./Components/UserLogin/LoginForm/UserLogin";
import { Route, Routes, useNavigate } from "react-router-dom";
function App() {
  const navigate = useNavigate();
  useEffect(() => {
    // const isLoggedIn = JSON.stringify(localStorage.getItem('UserLogin'));
    // if (isLoggedIn==="") {
    //   navigate("/");
    // }
    navigate("/");
  }, []);
  return (
    <Fragment>
      <Routes>
        <Route path="/user" element={<GraphEditor />} />
        <Route path="/" element={<UserLogin />} />
      </Routes>
    </Fragment>
  );
}

export default App;
