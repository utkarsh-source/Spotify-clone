import React, { useContext } from "react";
import styled from "styled-components";
import { MdHomeFilled, MdSearch } from "react-icons/md";
import { IoLibrary } from "react-icons/io5";
import Playlists from "./Playlists";
import Context from "../utils/Context";
export default function Sidebar() {


   const { toggleSearch, setToggleSearch } = useContext(Context);

  return (
    <Container>
      <div className="top__links">
        <div className="logo">
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
            alt="spotify"
          />
        </div>
        <ul>
          <li >
            <MdHomeFilled />
            <span>Home</span>
          </li>
          <li onClick={()=>setToggleSearch(true)}>
            <MdSearch />
            <span>Search</span>
          </li>
          <li>
            <IoLibrary />
            <span>Your Library</span>
          </li>
        </ul>
      </div>
      <Playlists />
    </Container>
  );
}

const Container = styled.div`
  background-color: black;
  color: #b3b3b3;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .top__links {
    display: flex;
    flex-direction: column;
    .logo {
      padding: 1.2rem 0.8rem 1rem;
      img {
        width: 160px;
      }
    }
    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      li {
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        font-size: 0.9rem;
        transition: 0.2s ease-in-out;
        &:hover {
          color: white;
        }
        &>svg{
          font-size: 25px;
        }
      }
    }
  }
`;
