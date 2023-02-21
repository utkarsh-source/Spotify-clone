import React, { useEffect } from "react";
import { useContext } from "react";
import styled from "styled-components";
import { getCurrentTrack, getInitialPlaylist, getPlaylistData } from "../utils/action";
import { SET_PLAYLIST_ID } from "../utils/actionType";
import Context from "../utils/Context";

export default function Playlists() {
  const { token, playlists, userInfo, dispatch } = useContext(Context);

  const changeCurrentPlaylist = (selectedPlaylistId) => {
    dispatch({ type: SET_PLAYLIST_ID, payload: selectedPlaylistId });
    getInitialPlaylist(dispatch, token, selectedPlaylistId)
  };

  return (
    <Container>
      <hr />
      <ul>
        {playlists?.map(({ name, id }) => {
          return (
            <li key={id} onClick={() => {
              changeCurrentPlaylist(id)
              getCurrentTrack(dispatch, token);
            }
            }>
              {name}
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  color: #b3b3b3;
  height: 100%;
  overflow: hidden;
  hr{
    width: 90%;
    height: 0.3px;
    background-color: #5f5f5f;
    border: none;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  ul {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    height: 55vh;
    max-height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.7rem;
      &-thumb {
        background-color: rgba(255, 255, 255, 0.6);
      }
    }
    li {
      transition: 0.3s ease-in-out;
      cursor: pointer;
      &:hover {
        color: white;
      }
    }
  }
`;
