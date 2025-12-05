import React from 'react'
import styled from 'styled-components'
import Robot from '../assets/robot.gif'

export default function welcome({ currentUser }) {
    console.log("current user: "+currentUser);
  return (
    <Container>
      <img src={Robot} alt="robot" />
      <h1>
        Welcome, <span>{"bhubesh"}!</span>
      </h1>
      <h3>Please select a chat to start messaging</h3>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; 
  color: white;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;    
  }
`;
