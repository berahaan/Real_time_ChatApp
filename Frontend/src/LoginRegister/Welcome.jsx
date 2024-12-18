import React from "react";
import styled from "styled-components";
function Welcome({ currentUser }) {
  return (
    <Container>
      <h1>
        Hello <span>{currentUser.username}</span>to chat message !!
      </h1>
      <h3>Please select a chat and start to message </h3>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;
  img {
    height: 20rem;
  }
  span {
    color: #4e00ff;
  }
`;
export default Welcome;
