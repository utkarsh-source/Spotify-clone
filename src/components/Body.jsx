import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import { AiFillClockCircle } from "react-icons/ai";
import { reducerCases } from "../utils/Constants";
import { useContext } from "react";
import Context from "../utils/Context";
import { playTrack } from "../utils/action";
import { FiMusic } from "react-icons/fi";
import { BiPlay, BiSearch } from "react-icons/bi";
import { IoCloseSharp } from "react-icons/io5";
import { BsDot, BsFillPlayFill } from "react-icons/bs";
import { TbPlayerPause } from "react-icons/tb";
import { CgPlayPause } from "react-icons/cg";
import SearchPlaylist from "./SearchPlaylist";

const msToMinutesAndSeconds = (ms, seperate) => {
  var minutes = Math.floor(ms / 60000);
  var seconds = ((ms % 60000) / 1000).toFixed(0);

  return seperate ? minutes + " min " + (seconds < 10 ? "0" : "") + seconds + " sec" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

export default function Body({ headerBackground }) {
  const { token, selectedPlaylist, dispatch, userInfo, playerState, isPlaying, setIsPlaying, currentPlaying} =
    useContext(Context);
  


  return (
    <Container headerBackground={headerBackground}>
      {selectedPlaylist && (
        <>
          <div className="playlist">
            <div className="image">
              {selectedPlaylist.image ? <img src={selectedPlaylist.image} alt="selected playlist" /> : <span><FiMusic /></span>}
            </div>
            <div className="details">
              <span className="type">PLAYLIST</span>
              <h1 className="title">{selectedPlaylist.name}</h1>
              <p className="description">{selectedPlaylist.description}</p>
              <div className="owner_details">
                <p className="owner_desc">
                  <img alt="Owner Profile" src={userInfo.image} />
                  <span>{selectedPlaylist.displayName}</span>
                </p>
                {selectedPlaylist.totalSong > 0 && <><BsDot />
                  <span className="total_songs">{selectedPlaylist.totalSong + " songs ,"}</span>
                  <span className="total_duration">{msToMinutesAndSeconds(selectedPlaylist.totalDuration, true)}</span>
                </>}

              </div>
            </div>

          </div>
          {selectedPlaylist.totalSong > 0 && <div onClick={() =>
                        playTrack(
                          dispatch,
                          token,
                          selectedPlaylist.tracks[0].id,
                           selectedPlaylist.tracks[0].name,
                           selectedPlaylist.tracks[0].artists,
                           selectedPlaylist.tracks[0].image,
                           selectedPlaylist.tracks[0].context_uri,
                          selectedPlaylist.tracks[0].track_number,
                          setIsPlaying,
                          playerState.isPlaying,
                          currentPlaying.id
                        )
                      } className="playbox_wrapper">
            <div className="play_box">
              {isPlaying ? <CgPlayPause/> : <BiPlay />}
            </div>
          </div>}

          <div className="list">
            {selectedPlaylist.tracks.length > 0 &&
              <>

                <div className="header-row">
                  <div className="col">
                    <span>#</span>
                  </div>
                  <div className="col">
                    <span>TITLE</span>
                  </div>
                  <div className="col">
                    <span>ALBUM</span>
                  </div>
                  <div className="col">
                    <span>Date added</span>
                  </div>
                  <div className="col">
                    <span>
                      <AiFillClockCircle />
                    </span>
                  </div>
                </div>
                <hr className="header_row_ruler" />
              </>
            }
            <div className="tracks">
              {selectedPlaylist.tracks.length ? selectedPlaylist.tracks.map(
                (
                  {
                    id,
                    name,
                    artists,
                    image,
                    duration,
                    album,
                    context_uri,
                    track_number,
                    dateAdded,
                  },
                  index
                ) => {
                  return (
                    <div
                      className="row"
                      key={id}
                      onClick={() =>
                        playTrack(
                          dispatch,
                          token,
                          id,
                          name,
                          artists,
                          image,
                          context_uri,
                          track_number,
                          setIsPlaying
                        )
                      }
                    >
                      <div className="col">
                        <span>{index + 1}</span>
                      </div>
                      <div className="col detail">
                        <div className="image">
                          <img src={image} alt="track" />
                        </div>
                        <div className="info">
                          <span className="name">{name}</span>
                          <span>{artists}</span>
                        </div>
                      </div>
                      <div className="col">
                        <span>{album}</span>
                      </div>
                      <div className="col">
                        <span>{new Intl.DateTimeFormat('en-GB', { dateStyle: "medium" }).format(new Date(dateAdded))}</span>
                      </div>
                      <div className="col">
                        <span>{msToMinutesAndSeconds(duration)}</span>
                      </div>
                    </div>
                  );
                }
              ) : <>
                <hr className="ruler" />
                <div className="search_box">
                  <div>
                    <p>Let's find something for your playlist</p>
                    <div className="input_box">
                      <BiSearch />
                      <input type="text" placeholder="Search for songs or episodes" />
                    </div>
                  </div>
                  <IoCloseSharp className="toggle_search_box" />
                </div>
              </>}
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
.playbox_wrapper{
  backdrop-filter: blur(2px);
  background: linear-gradient(to bottom, #00000031, transparent);
  display: flex;
  align-items: center;
  padding: 1.5rem;
  margin-top: 20px;
  .play_box{
    background-color: ${props=> props.theme.main_green};
    width: 3.8rem;
    height: 3.8rem;
    border-radius: 100% ;
    display: grid;
    place-items: center;
    cursor: pointer;
    border: 1px solid black;
    transition: transform 0.07s linear;
    &:active{
      transform: scale(0.90);
    }
    svg{
      color: #141414;
      font-size: 2.5rem;
      margin-left: 3px;
    }
  }
}
  .playlist {
    margin: 0 2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    .image {
      span{
        display: grid;
        place-items: center;
        background-color: #292929;
        width: 14rem;
        height: 14rem;
        border-radius: 3px;
        svg{
          font-size: 70px;
          color: whitesmoke;
        }
      }
      img {
        height: 14rem;
        box-shadow: 0 0 60px #292929bd;
      }
    }
    .details {
      display: flex;
      flex-direction: column;
      color: white;
      .type{
        font-size: 0.9rem;
        letter-spacing: 0.5px;
      }
      .title {
        font-size: 5rem;
        font-weight: 900;
        padding: 0;
      }

      .owner_details{
        margin-top: 35px;
        display: flex;
        align-items: center;
        gap: 0.1rem;
        .total_songs{
          font-size: 0.8rem;
          color: ${props => props.theme.dirtyWhite};
        }
        .total_duration{
          color: ${props=> props.theme.dirtyWhite};
          padding-left: 10px;
          font-size: 0.9rem;
        }
        .owner_desc{
          display: flex;
          align-items: center;
          gap: 0.5rem;
          img{
            width: 2rem;
            height: 2rem;
            border-radius: 100%;
          }
          span{
            font-size: 0.8rem;
            letter-spacing: 0.5px;
          }
        }
      }

    }
  }
  .list {
    .header-row {
      display: grid;
      grid-template-columns: 0.1fr 1.2fr 1fr 0.5fr 0.1fr;
      margin: 1rem 0 0 0;
      color: #dddcdc;
      position: sticky;
      top: 15vh;
      padding: 1rem 3rem;
      transition: 0.3s ease-in-out;
      background-color: ${({ headerBackground }) =>
    headerBackground ? "#000000dc" : "none"};
    }
    .header_row_ruler{
      width: 95%;
          height: 0.1px;
          background-color: #464646;
          opacity: 0.5;
          border: none;
          margin: 0 auto;
          margin-bottom: 20px;
    }
    .tracks {
      margin: 0 2rem;
      display: flex;
      flex-direction: column;
      margin-bottom: 5rem;
      .ruler{
          width: 100%;
          height: 0.3px;
          background-color: #494949;
          opacity: 0.5;
          border: none;
          margin: 0 auto;
          margin-top: 20px;
          margin-bottom: 10px;
      }
      .search_box{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 10px;
        .toggle_search_box{
          font-size: 2rem;
          color: #959595;
        }
        p{
          font-size: 1.6rem;
          color: white;
          font-weight: bold;
          padding: 2rem 0 ;
        }
      }
      .input_box{
        display: flex;
        align-items: center;
        position: relative;
        background-color: #292929;
        width: max-content;
        border-radius:3px;
        svg{
          position: absolute;
          color: whitesmoke;
          font-size: 20px;
          pointer-events: none;
          margin-left: 20px;
        }
        input{
          background-color: transparent;
          border: none;
          outline: none;
          width: max-content;
          height: 50px;
          padding: 0.8rem 2rem;
          color: white;
          padding-left: 50px;
          min-width: 30rem;
          &::placeholder{
            font-size: 1rem;
            color: #e0e0e0;
          }
        }
      }
      .row {
        padding: 0.5rem 1rem;
        display: grid;
        grid-template-columns: 0.1fr 1.2fr 1fr 0.5fr 0.1fr;
        &:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }
        .col {
          display: flex;
          align-items: center;
          span{
            font-size: 0.9rem;
            color: ${props=> props.theme.dirty_white};
          }
          img {
            height: 40px;
            width: 40px;
          }
        }
        .detail {
          display: flex;
          align-items: center;
          gap: 1rem;
          .image{
            width: 3rem;
            height: 3rem;
            box-shadow: 0 0 30px black;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .info {
            span{
              &:first-child {
                font-size: 1rem;
                letter-spacing: 0.5px;
                color: white;
                padding-bottom: 3px;
              }
            }
            display: flex;
            flex-direction: column;
          }
        }
      }
    }
  }
`;
