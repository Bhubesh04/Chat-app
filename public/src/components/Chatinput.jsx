import React, { useState } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

export default function ChatInput({handleSendMsg}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // ✅ Updated for new emoji-picker-react API
  const handleEmojiClick = (emojiData) => {
    setMsg((prev) => prev + emojiData.emoji);
  };

  const handleSend = (e) => {
    e.preventDefault();
    console.log("Sent:", msg);
    setMsg("");
  };
  const sendChat=(event)=>{
    event.preventDefault();
    if(msg.length>0){
      handleSendMsg(msg);
      setMsg('')
    }
  }

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && (
            <div className="emoji-picker-wrapper">
              <Picker
                onEmojiClick={handleEmojiClick}
                theme="dark"
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}
        </div>
      </div>

      <form className="input-container" onSubmit={(e)=>sendChat(e)}>
        <input
          type="text"
          placeholder="Type your message here..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button type="submit" className="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  gap: 1rem;
  overflow: visible;
  position: relative;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    position: relative;

    .emoji {
      position: relative;

      svg {
        font-size: 1.8rem;
        color: #ffff00c8;
        cursor: pointer;
        transition: transform 0.2s ease, color 0.2s ease;

        &:hover {
          transform: scale(1.2);
          color: #ffcc00;
        }
      }

      /* ✅ Custom wrapper around Picker */
      .emoji-picker-wrapper {
        position: absolute;
        bottom: 60px; /* 👈 appears above icon */
        left: 0;
        z-index: 1000;
        background-color: #080420;
        border-radius: 0.5rem;
        box-shadow: 0 5px 15px #9a86f3;
        overflow: hidden;
      }
    }
  }

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    padding: 0.5rem 1rem;

    input {
      width: 90%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
      &::placeholder {
        color: #ccc;
      }
    }

    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;

      &:hover {
        background-color: #7a67d3;
        transform: scale(1.05);
      }

      svg {
        font-size: 2rem;
        color: white;

        @media screen and (min-width: 720px) and (max-width: 1080px) {
          font-size: 1rem;
        }
      }
    }
  }
`;
