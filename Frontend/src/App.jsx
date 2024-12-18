import React, { useState } from "react";
import Register from "./LoginRegister/Register";
import Login from "./LoginRegister/Login";
import Chat from "./LoginRegister/Chat";
import SetAvatar from "./LoginRegister/SetAvatar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chat />}></Route>
        <Route path="/setAvatar" element={<SetAvatar />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </Router>
  );
}

export default App;

{
  /* {!isLoggedIn ? (
  <Routes>
    
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login onLogin={handleLogin} />} />
    <Route path="/" element={<Navigate to="/login" />} />
  </Routes>
) : (
  <Userlist username={username} />
)} */
}
