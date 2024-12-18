import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import Picker from "emoji-picker-react";

function ChatInput({ handleSendMsg }) {
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");
  const emojiPickerRef = useRef(null);

  const handleEmojiClick = (emojiData, event) => {
    setMsg((prevMsg) => prevMsg + emojiData.emoji);
  };
  const handleSendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };
  const handleEmojiToggle = () => {
    setEmojiPicker(!emojiPicker);
  };

  const handleClickOutside = (event) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target)
    ) {
      setEmojiPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiToggle} />
          {emojiPicker && (
            <div className="emoji-picker" ref={emojiPickerRef}>
              <Picker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
        <form className="input-container" onSubmit={handleSendChat}>
          <input
            type="text"
            placeholder="Type your message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button className="submit" type="submit">
            <IoMdSend />
          </button>
        </form>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #080420;
  padding: 1rem 2rem;

  .button-container {
    display: flex;
    align-items: center;
    width: 100%;
    color: white;
    gap: 1rem;
    position: relative;

    .emoji {
      position: relative;
      svg {
        font-size: 1.8rem;
        color: #ffff00c8;
        cursor: pointer;
        transition: transform 0.2s;
        &:hover {
          transform: scale(1.2);
        }
      }

      .emoji-picker {
        position: absolute;
        top: -350px;
        right: 0;
        background-color: #fff;
        box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        z-index: 1000;

        .emoji-picker-react {
          .emoji-group {
            padding: 0.5rem;
          }

          .emoji-group::before {
            background: none;
          }

          .emoji-categories {
            button {
              filter: grayscale(100%);
            }
          }

          .emoji-search {
            background-color: #f1f1f1;
            border: none;
            border-radius: 5px;
            margin-bottom: 0.5rem;
          }

          .emoji-category-label {
            background-color: #fff;
            color: #000;
            font-weight: bold;
          }
        }
      }
    }

    .input-container {
      display: flex;
      align-items: center;
      width: 100%;
      background-color: #ffffff34;
      border-radius: 2rem;
      padding: 0.5rem 1rem;

      input {
        flex: 1;
        background-color: transparent;
        border: none;
        font-size: 1.2rem;
        color: white;
        outline: none;
        border-radius: 2rem;
        padding: 0 1rem;

        &::placeholder {
          color: #d1d1d1;
        }

        &::selection {
          background-color: #9a86f3;
        }
      }

      .submit {
        background-color: #9a86f3;
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
          background-color: #7b69c7;
        }
      }
    }
  }
`;

export default ChatInput;
