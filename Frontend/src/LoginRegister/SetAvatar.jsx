import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { Buffer } from "buffer";
import { ToastContainer, toast } from "react-toastify";

function SetAvatar() {
  const api = "https://api.multiavatar.com/45678945";
  const navigate = useNavigate();
  const [avatars, setAvatar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const URL = "http://localhost:5000";
  const toastStyle = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, [navigate]);

  const selectProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastStyle);
    } else {
      try {
        const user = JSON.parse(localStorage.getItem("chat-app-user"));
        const { data } = await axios.post(`${URL}/setAvatar/${user._id}`, {
          image: avatars[selectedAvatar],
        });
        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem("chat-app-user", JSON.stringify(user));
          navigate("/");
        } else {
          toast.error("Error setting avatar. Please try again.", toastStyle);
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.", toastStyle);
      }
    }
  };
  const handleSkip = () => {
    navigate("/");
  };
  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let x = 0; x < 4; x++) {
        const response = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = Buffer.from(response.data);
        data.push(buffer.toString("base64"));
      }
      setAvatar(data);
      setIsLoading(false);
    };

    fetchAvatars();
  }, [api]);

  return (
    <>
      <Container>
        <div className="title-avatar">
          <h1 className="text-black text-xl">Pick an avatar below</h1>
          <div className="avatars">
            {isLoading ? (
              <p>Loading avatars...</p>
            ) : (
              avatars.map((avatar, index) => (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => setSelectedAvatar(index)}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                  />
                </div>
              ))
            )}
          </div>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 mx-20 rounded focus:outline-none focus:shadow-outline"
          onClick={selectProfilePicture}
        >
          Select Avatar
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 mx-20 rounded focus:outline-none focus:shadow-outline"
          onClick={handleSkip}
        >
          SKIP
        </button>
      </Container>
      <ToastContainer {...toastStyle} />
    </>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .title-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;

    .avatars {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    }

    .avatar {
      border: 2px solid transparent;
      padding: 0.5rem;
      border-radius: 50%;
      transition: border 0.3s;

      img {
        height: 4rem;
        width: 4rem;
      }
    }

    .selected {
      border: 2px solid #4e0eff;
    }
    
  
`;

export default SetAvatar;
