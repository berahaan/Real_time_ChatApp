import React from "react";
import styled from "styled-components";
import { BiPowerOff } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}
const Button = styled.div`
  display: flex;
  align-items: center;
  justify-center: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a8;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    background-color: #ebe7ff;
  }
`;
export default Logout;
