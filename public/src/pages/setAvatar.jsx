import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
import multiavatar from "@multiavatar/multiavatar/esm";

export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // Redirect logic: if no user -> /login, if user already has avatar -> /
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("chat-app-user");
      if (!userStr) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error reading user from localStorage:", err);
      navigate("/login");
    }
  }, []);

  // Generate avatars locally using multiavatar
  useEffect(() => {
    const generateAvatars = () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const randomName = Math.random().toString(36).substring(2, 10);
        const svgCode = multiavatar(randomName); // generate avatar locally
        const encoded = btoa(unescape(encodeURIComponent(svgCode))); // convert to base64
        data.push(encoded);
      }

      // small artificial delay so loader shows briefly
      setTimeout(() => {
        setAvatars(data);
        setIsLoading(false);
      }, 1000);
    };

    generateAvatars();
  }, []);

  // Set profile picture
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      return toast.error("Please select an avatar", toastOptions);
    }

    const userStr = localStorage.getItem("chat-app-user");
    if (!userStr) {
      toast.error("User not found. Please login again.", toastOptions);
      navigate("/login");
      return;
    }

    const user = JSON.parse(userStr);

    try {
      toast.info("Saving avatar...", { ...toastOptions, autoClose: 2000 });
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data && data.isSet) {
        user.isAvatarImage = true;
        // prefer using returned image if backend provides it
        if (data.image) user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        toast.success("Avatar set! Redirecting...", toastOptions);
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    } catch (err) {
      console.error("Error setting avatar:", err);
      toast.error("Network or server error. Please try again.", toastOptions);
    }
  };

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img src={`data:image/svg+xml;base64,${avatar}`} alt={`avatar-${index}`} />
              </div>
            ))}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;

      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }

      &:hover {
        cursor: pointer;
        transform: scale(1.1);
      }
    }

    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }

  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #3c0edc;
    }
  }
`;
