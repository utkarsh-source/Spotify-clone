import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import styled from "styled-components";
import ReactLoading from 'react-loading';
import Context from "../utils/Context";


export default function Login() {

  const { token, dispatch } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    sessionStorage.setItem("clicked", true);
    setIsLoading(true);
    const href = window.location.href
    console.log(href)
    window.location.href = href + "/login";
  };


  useEffect(() => {
    // const isClicked = sessionStorage.getItem("clicked");
    // setIsLoading(isClicked);
    // const sessionState = sessionStorage.getItem("state");
    // if (isClicked) {
    //   const href = window.location.href;
    //   if(!href.includes("code")) return
    //   const [codeString, stateString] = href.split("?")[1].split("&")
    //   const [code, codeValue] = codeString.split("=");
    //   const [state, stateValue] = stateString.split("=");
    //   if (codeValue !== "access_denied" && sessionState == stateValue) {
    //     login(code, setIsLoading);
    //   } else {
    //     console.log("User denied access")
    //     setIsLoading(false);
    //   }
    //   sessionStorage.clear();
    // }
  }, []);

  return (
    <Container>
      <img
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Black.png"
        alt="spotify"
      />
      <button onClick={handleClick}>{isLoading ? <ReactLoading type={"spin"} color={"#1db954"} height={25} width={25} /> : "Connect Spotify"}</button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #1db954;
  gap: 5rem;
  img {
    height: 20vh;
  }
  button {
    padding: 1rem 5rem;
    border-radius: 5rem;
    background-color: black;
    color: #49f585;
    border: none;
    font-size: 1.4rem;
    cursor: pointer;
  }
`;
