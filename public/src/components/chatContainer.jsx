import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Logout from './Logout';  
import Chatinput from './Chatinput';
import axios from 'axios';
import { getAllMessageRoutes, sendMessagesRoutes } from '../utils/APIRoutes';

export default function ChatContainer({ currentChat, currentUser }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  // Fetch messages when chat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat) {
        try {
          const response = await axios.post(getAllMessageRoutes, {
            from: currentUser._id,
            to: currentChat._id,
          });

          // Map messages and add `fromSelf` if backend doesn't provide it
          const msgs = response.data.map(msg => ({
            ...msg,
            fromSelf: msg.from === currentUser._id
          }));

          setMessages(msgs);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [currentChat, currentUser]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send a new message
  const handleSendMsg = async (msg) => {
    try {
      await axios.post(sendMessagesRoutes, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg
      });

      // Update state immediately
      setMessages(prev => [...prev, { fromSelf: true, message: msg }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Container>
      {/* Chat Header */}
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>

      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            ref={scrollRef}
            className={`message ${message.fromSelf ? "sended" : "recieved"}`}
          >
            <div className="content">{message.message}</div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <Chatinput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
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
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
