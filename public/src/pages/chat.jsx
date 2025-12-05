import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute } from "../utils/APIRoutes";
import ChatContainer from "../components/chatContainer";
import Contacts from "../components/contacts";
import Welcome from "../components/welcome";

export default function Chat() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  console.log("✅ Component rendered");

  // ---------- 1️⃣ Load current user from localStorage ----------
  useEffect(() => {
    console.log("🌀 First useEffect triggered");

    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("chat-app-user");
        console.log("Stored user:", storedUser);

        if (!storedUser) {
          console.warn("No user found → redirecting to /login");
          navigate("/login");
        } else {
          const user = JSON.parse(storedUser);
          console.log("Parsed user:", user);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  // ---------- 2️⃣ Fetch contacts after currentUser loads ----------
  useEffect(() => {
    console.log("⚙️ Second useEffect triggered | currentUser:", currentUser);

    const fetchContacts = async () => {
      if (!currentUser) {
        console.log("⏳ currentUser not yet set, skipping fetchContacts");
        return;
      }

      console.log("User found:", currentUser);

      if (currentUser.isAvatarImage) {
        try {
          console.log("Fetching contacts for user:", currentUser._id);
          const response = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          console.log("✅ Contacts fetched:", response.data);
          setContacts(response.data);
        } catch (error) {
          console.error("❌ Error fetching contacts:", error);
        }
      } else {
        console.warn("⚠️ Avatar not set → redirecting to /setAvatar");
        navigate("/setAvatar");
      }
    };

    fetchContacts();
  }, [currentUser, navigate]);

  // ---------- 3️⃣ Handle chat change ----------
  const handleChatChange = (chat) => {
    console.log("💬 Changing chat to:", chat);
    setCurrentChat(chat);
  };

  // ---------- 4️⃣ Render ----------
  if (isLoading) {
    return (
      <Container>
        <h1 style={{ color: "white" }}>Loading...</h1>
      </Container>
    );
  }

  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentChat={currentChat}
          changeChat={handleChatChange}
        />
        {currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer currentChat={currentChat} currentUser={currentUser}  />
        )}
      </div>
    </Container>
  );
}

// ---------- 5️⃣ Styled Component ----------
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
