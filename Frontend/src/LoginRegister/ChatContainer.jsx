import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import Chatinput from "./Chatinput";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  useEffect(() => {
    const handleChat = async () => {
      if (currentUser && currentChat) {
        const response = await axios.post("http://localhost:5000/getMessage", {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      }
    };
    handleChat();
  }, [currentChat, currentUser]);

  const handleSendMsg = async (msg) => {
    await axios.post("http://localhost:5000/addmessage", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });
    const msgs = [...messages];
    msgs.push({ fromself: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        setArrivalMessage({ fromself: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt="avatarImages"
                />
              </div>
              <div className="username">
                <h1>{currentChat.username}</h1>
              </div>
            </div>
            <Logout className="logout-button" />
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div ref={scrollRef} key={uuidv4()}>
                <div
                  className={`message ${
                    message.fromself ? "sended" : "received"
                  }`}
                >
                  <div className="content">
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Chatinput handleSendMsg={handleSendMsg} />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 70% 12%;
  gap: 0.1rem;
  overflow: hidden;

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    position: relative;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h1 {
          color: white;
          margin: 0;
        }
      }
    }

    .logout-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: #ff4d4d;
      border: none;
      border-radius: 50%;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s;

      svg {
        font-size: 1.5rem;
        color: white;
      }

      &:hover {
        background-color: #e03e3e;
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    .message {
      display: flex;
      align-items: center;

      &.sended {
        justify-content: flex-end;

        .content {
          background-color: #4f04ff21;
        }
      }

      &.received {
        justify-content: flex-start;

        .content {
          background-color: #9900ff20;
        }
      }

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }
  }
`;

export default ChatContainer;
