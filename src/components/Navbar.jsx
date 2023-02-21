import React from "react";
import styled from "styled-components";
import { useContext } from "react";
import Context from "../utils/Context";
import { VscTriangleDown } from 'react-icons/vsc';
import Tooltip from "./Tooltip";
import { logout } from "../utils/action";
import CurrentDevice from "./CurrentDevice";


const Menu = () => {

  const { dispatch, token } = useContext(Context);

  return <MenuBox>
    <ul>
        <li>Account</li>
        <li>Profile</li>
        <li>Support</li>
        <li>Download</li>
        <li>Settings</li>
        <li onClick={()=> logout(dispatch, token)}>Logout</li>
    </ul>
  </MenuBox>
}



const MenuBox = styled.div`
  width: 100%;
  height: 100%;
  ul{
    display: flex;
    flex-direction: column;
    li{
      position: relative;
      color: whitesmoke;
      list-style: none;
      padding: 0.8rem 0.8rem;
      width: 11rem;
      font-size: 0.8rem;
      letter-spacing: 0.5px;
      border-radius: 3px;
      cursor: pointer;
      &:hover{
        background-color: ${props => props.theme.hover};
      }
      &:last-child::before{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        content: "";
        width: 100%;
        height: 0.1px;
        background-color: #ffffff18;
      }
    }
  }
  `

const StyledTooltip = styled(Tooltip)`
  background-color: #292929;
  border-radius: 3px;
  opacity: 1;
  height: max-content;
  padding: 0.2rem ;
` 

export default function Navbar({ navBackground }) {
  const { userInfo} = useContext(Context);

  return (
    <Container navBackground={navBackground}>
      <div>
        <CurrentDevice/>
      </div>
      <div  className="avatar" data-tooltip-id="my-profile">
        <img alt="User Profile" src={userInfo?.image} />
        <span>{userInfo?.name}</span>
        <VscTriangleDown />
      </div>
      <StyledTooltip clickable id="my-profile"><Menu/></StyledTooltip>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  height: 15vh;
  position: sticky;
  top: 0;
  transition: 0.3s ease-in-out;
  background-color: ${({ navBackground }) =>
    navBackground ? "rgba(0,0,0,0.7)" : "none"};
  .search__bar {
    background-color: white;
    width: 30%;
    padding: 0.4rem 1rem;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    input {
      border: none;
      height: 2rem;
      width: 100%;
      &:focus {
        outline: none;
      }
    }
  }
  .avatar {
    background-color: black;
    padding: 0.2rem 0.2rem;
    padding-right: 1rem;
    border-radius: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    span{
      color: white;
      font-size: 0.9rem;
    }
    img{
        width: 1.8rem;
        height: 1.8rem;
        border-radius: 100%;
      }
      svg {
        font-size: 1rem;
        color: white;
      }
    }
`;
