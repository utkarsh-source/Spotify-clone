import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import styled from "styled-components";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Body from "./Body";
import { useContext } from "react";
import Context from "../utils/Context";
import { getActiveDevices,  getCurrentTrack, getPlaybackState, getPlaylistData, getRecentTracks, getRecommendations } from "../utils/action";
import SearchPlaylist from "./SearchPlaylist";

export default function Spotify() {
  const { token, userInfo, dispatch, currentPlaying} = useContext(Context);
  const [navBackground, setNavBackground] = useState(false);
  const [headerBackground, setHeaderBackground] = useState(false);
    const [toggleTop, setToggleTop] = useState(false);

  const bodyRef = useRef();

  const bodyScrolled = () => {
    if (bodyRef.current.scrollTop >= 30) {
      setNavBackground(true)
      setToggleTop(true)
    } else {
      setNavBackground(false)
      setToggleTop(false)
    }
    if ( bodyRef.current.scrollTop >= 268) {
      setHeaderBackground(true)
    } else {
      setHeaderBackground(false)
    }
  };

  useEffect(() => {
    getPlaylistData(dispatch, token, userInfo);
    getActiveDevices(dispatch, token);
    getCurrentTrack(dispatch, token);
  }, []);

  return (
    currentPlaying && 
    <Container>
      <div className="spotify__body">
        <Sidebar />
        <div className="body" ref={bodyRef} onScroll={bodyScrolled}>
          <Navbar navBackground={navBackground} />
          <div className="body__contents">
            <Body headerBackground={headerBackground} />
            </div>
            <SearchPlaylist toggleTop={toggleTop} />
        </div>
      </div>
      <div className="spotify__footer">
        <Footer />
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: grid;
  max-height: 100vh;
  width: 100vw;
  grid-template-rows: 1fr 0.15fr;
  overflow: hidden;
  .spotify__body {
    position: relative;
    display: grid;
    grid-template-columns: 15vw 85vw;
    width: 100%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 1));
    background-color: rgb(32, 87, 100);
    overflow: hidden;
    .body {
      position: relative;
      height: 100%;
      width: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0.7rem;
        max-height: 2rem;
        &-thumb {
          background-color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
  .spotify__footer{
    position: relative;
  }
`;
