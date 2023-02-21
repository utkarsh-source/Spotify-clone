import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
} from "react-icons/bs";

import { BiShuffle} from "react-icons/bi"
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { TbRepeat, TbRepeatOnce, TbRepeatOff} from "react-icons/tb";
import { useContext } from "react";
import Context from "../utils/Context";
import { changeState, changeTrack, getActiveDevices, getCurrentTrack, getPlaybackState, setRepeatMode, setSeekPosition, setShuffleMode } from "../utils/action";
import Tooltip from "./Tooltip";
import { IoRepeat } from "react-icons/io5";
import { MdOutlineRepeat } from "react-icons/md";


const repeatModes = ["track", "context", "off"];



const msToMinutesAndSeconds = (ms, seperate) => {
  var minutes = Math.floor(ms / 60000);
  var seconds = ((ms % 60000) / 1000).toFixed(0);

  return seperate ? minutes + " min " + (seconds < 10 ? "0" : "") + seconds + " sec" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

const buttonStyle = {
  color: "#1db954",
  fontSize: "1.3rem",
  cursor: "pointer",
} 



const HelperTooltip = styled(Tooltip)`
    font-size: 0.75rem;
    background-color: #292929;
    opacity: 1;
    padding: 0.5rem;
    color: whitesmoke;
`

export default function PlayerControls() {
  const { token, playerState, dispatch, setIsPlaying, currentPlaying, recentTracks,  selectedPlaylist}  = useContext(Context)
  const modeCount = useRef(0);
  const shuffleMode = useRef(false);
  const timerId = useRef();
  const seekProgressCounter = useRef();


  
  
  useEffect(() => {
    clearInterval(timerId.current)
    if (playerState.isPlaying) {
        timerId.current = setInterval(async () => {
          getCurrentTrack(dispatch, token)
          getActiveDevices(dispatch, token)
        }, 1000)
      } else {
      clearInterval(timerId.current)
    }
  }, [playerState.isPlaying])

  useEffect(async () => {
    getPlaybackState(dispatch, token);
    return () => {
      clearInterval(timerId.current)
    }
  }, [])


  const handleMouseMove = (e) => {
    seekProgressCounter.current = (e.clientX - e.target.offsetLeft) / e.target.offsetWidth * 100;
  }

  
  

  return (
    <Wrapper>
      <Container>
      <div className="shuffle" onClick={()=>setShuffleMode(dispatch, token, shuffleMode.current = !shuffleMode.current)}>
        <Shuffle data-tooltip-id="shuffle_button" isActive={playerState.shuffleMode} />
        <HelperTooltip id="shuffle_button">{playerState.shuffleMode ? "Disable shuffle" : "Enable shuffle" }</HelperTooltip>
      </div>
      <div className="previous">
        <CgPlayTrackPrev data-tooltip-id="prev_button" onClick={() => {
          changeTrack(dispatch, token, "previous", selectedPlaylist?.tracks[0]?.id, setIsPlaying)
        }} />
        <HelperTooltip id="prev_button">Previous</HelperTooltip>
      </div>
      <div data-tooltip-id="plate_state_button" className="state">
        {playerState.isPlaying ? (
          <BsFillPauseCircleFill onClick={() => {
            changeState(dispatch, token, "pause", currentPlaying?.id == selectedPlaylist?.tracks[0]?.id, setIsPlaying)
          }
          } />
        ) : (
            <BsFillPlayCircleFill onClick={() => {
              changeState(dispatch, token, "play", currentPlaying?.id == selectedPlaylist?.tracks[0]?.id, setIsPlaying)
            }
            } />
        )}
        </div>
         <HelperTooltip id="plate_state_button">{playerState.isPlaying ? "Pause" : "Play" }</HelperTooltip>
      <div className="next">
        <CgPlayTrackNext data-tooltip-id="next_button" onClick={() => {
          changeTrack(dispatch, token, "next", selectedPlaylist?.tracks[0]?.id, setIsPlaying)
        }
        } />
        <HelperTooltip id="next_button">Next</HelperTooltip>
      </div>
      <div className="repeat" >
        <MdOutlineRepeat id="repeatOff" style={{ ...buttonStyle}} />
        <HelperTooltip anchorSelect="#repeatOff">Spotify API is not working as expected</HelperTooltip>
      </div>
    </Container>
      <Player>
        <span>{msToMinutesAndSeconds(currentPlaying.progress)}</span>
        <div onClick={() => {
          const pos = currentPlaying.duration * (seekProgressCounter.current / 100)
          setSeekPosition(dispatch, token, pos)
        }} onMouseMove={handleMouseMove}>
          <Bar style={{width: 0}} progressPer={(currentPlaying.progress / currentPlaying.duration) * 100}/>
        </div>
        <span>{msToMinutesAndSeconds(currentPlaying?.duration ?? recentTracks[0]?.duration)}</span>
      </Player>
    </Wrapper>
    
  );
}



const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`


const Bar = styled.p`
    height: 100%;
    width : ${props=> props.progressPer + "%"} !important; 
    background-color: ${props => props.theme.main_green};
    pointer-events: none;
`


const Player = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    span{
      color: whitesmoke;
      font-size: 0.8rem;
      min-width: 2rem;
      text-align: center;
    }
    div{
      position: relative;
      height: 5px;
      background-color: ${props => props.theme.hover};
      border-radius: 10px;
      width: 25rem;
      overflow: hidden;
      cursor: pointer;
    }
`


const Shuffle = styled(BiShuffle)`
  color: ${props => props.isActive ? "#1db954" : props.theme.dirty_white} !important;
  font-size: 1.3rem;
  &:hover{
    color: ${props => !props.isActive  && "white" } !important;
  }
  outline: none;
  border: none;

`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  svg {
    color: #b3b3b3;
    transition: 0.1s ease-in-out;
    cursor: pointer;
    &:hover {
      color: white;
    }
  }
  .state {
    svg {
      color: white;
      transition: transform 0.07s linear;
      &:active{
        transform: scale(1.2);
      }
    }
  }
  .shuffle,
  .repeat,
  .previous,
  .next,
  .state {
    display: grid;
    place-items: center;
    font-size: 2rem;
  }
  
  .shuffle{
    font-size: 1.5rem;
  }
`;
