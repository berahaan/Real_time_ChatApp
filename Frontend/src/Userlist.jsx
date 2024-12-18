import React, { useState, useEffect } from "react";
import socket from "./Socket";
import axios from "axios";
const UserList = ({ username }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };
  useEffect(() => {
    const loadUsers = async () => {
      const users = await fetchUsers();
      setUsers(users);
    };
    loadUsers();
  }, []);

  useEffect(() => {
    socket.emit("register", { username });

    socket.on("message", (msg) => {
      setChat([...chat, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, [chat, username]);

  const sendMessage = () => {
    socket.emit("message", {
      from: username,
      to: recipient,
      content: message,
    });
    setMessage("");
  };

  const filteredUsers = users.filter((user) => user.username.includes(search));

  return (
    <div>
      <input
        type="text"
        placeholder="Search users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {filteredUsers.map((user) => (
          <li key={user._id} onClick={() => setRecipient(user.username)}>
            {user.username}
          </li>
        ))}
      </ul>
      {recipient && (
        <div>
          <h3>Chat with {recipient}</h3>
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
          <div>
            {chat.map((msg, idx) => (
              <div key={idx}>
                <strong>{msg.from}</strong>: {msg.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
