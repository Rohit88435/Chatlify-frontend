import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import getCurrentUser from "./CustomHooks/getCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import getOtherUser from "./CustomHooks/getOtherUsers";
import getMessage from "./CustomHooks/getMessage";
import { io } from "socket.io-client";
import { serverUrl } from "./main";
import { setOnlineUsers, setSocket } from "./Redux/userSlice";
function App() {
  getCurrentUser();
  getMessage();
  getOtherUser();

  let { userData, socket, onlineUsers } = useSelector((state) => state.user);
  let dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      const socketio = io(`${serverUrl}`, {
        query: {
          userId: userData?._id,
        },
      });

      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => socketio.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData]);
  return (
    <Routes>
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!userData ? <Signup /> : <Navigate to="/profile" />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to="/signup" />}
      />
    </Routes>
  );
}

export default App;
