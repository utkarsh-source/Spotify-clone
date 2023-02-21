import React, { useContext } from "react";
import styled from "styled-components";
import Context from "../utils/Context";
import CurrentTrack from "./CurrentTrack";

import PlayerControls from "./PlayerControls";
import Volume from "./Volume";
import {GoDeviceMobile } from  'react-icons/go'
import {RiSoundcloudFill } from  'react-icons/ri'
import Tooltip from "./Tooltip";
import { IoStatsChart } from "react-icons/io5";
import { BsSpeaker, BsThreeDots } from "react-icons/bs";
import { HiComputerDesktop, HiSpeakerWave } from "react-icons/hi2";
import { FaWifi } from "react-icons/fa";
import { MdDownloading } from "react-icons/md";
import { getPlaybackState, setActiveDevice } from "../utils/action";



const StyledTooltip = styled(Tooltip)`
 background-color: #292929;
  border-radius: 3px;
  opacity: 1;
  height: max-content;
  padding: 1rem 0.5rem;
`


const Todos = styled.li`
    display: flex;
    align-items: center;
    list-style: none;
    padding: 1rem;
    gap: 1rem;
    cursor: default !important;
    
    svg{
      margin-right: 10px;
    }
    div{
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 15rem;
      span{
        color: whitesmoke;
        font-size: 1rem;
      }
      p{
        color: ${props => props.theme.dirty_white};
        font-size: 0.8rem;
      }      
    }
    
`


const getAvailableDeviceList = (dispatch, token ,devices) => {
  const availableDevices = devices.filter(device => device.isActive == false);
  if (!availableDevices.length) {
    return <>
        <p className="heading">No other devices found</p>
        <DeviceList>
          <Todos>
            <FaWifi />
            <div>
              <span>Check your wifi</span>
              <p>Connect the devices you're using to the same WiFi</p>
            </div>
          </Todos>
          <Todos>
            <BsSpeaker />
            <div>
              <span>Play from another device</span>
              <p>It will automatically appear here</p>
            </div>
          </Todos>
          <Todos>
            <MdDownloading />
            <div>
              <span>Switch to the Spotify app</span>
              <p>The app can detect more devices</p>
            </div>
          </Todos>
        </DeviceList>
    </>
  } else {
    return <>
        <p className="heading">Select another device</p>
        <DeviceList>
        {availableDevices.map(device => {
          return <li onClick={async() => {
            await setActiveDevice(dispatch, token, device)
            getPlaybackState(dispatch, token)
          }
          }>{device.type.toLowerCase() == "smartphone" ? <GoDeviceMobile /> : <HiComputerDesktop />} {device.name}</li>
          })}
        </DeviceList>
    </>
  }
}



const DeviceMenu = () => {

  const { device, devices, playerState, dispatch, token} = useContext(Context)

  return device && <Device>
      <CurrentDevice> 
          {playerState.isPlaying ? <IoStatsChart />  : device?.type?.toLowerCase() == "smartphone" ? <GoDeviceMobile/> : <HiComputerDesktop/> }
          <div className="current_device_info">
            <p>Current Device</p>
        <span><HiSpeakerWave /> {device?.name}</span>
          </div>
          <BsThreeDots className="forget_device"/>
    </CurrentDevice>
    {getAvailableDeviceList(dispatch, token, devices)}
  </Device>
}


const Device = styled.div`
  display: flex;
  flex-direction: column;
  .heading{
    padding: 0 1rem;
    padding-top: 2rem;
    padding-bottom: 1rem ;
  }
`

      
const DeviceList = styled.ul`
    display: flex;
    flex-direction: column;
    li{
      list-style: none;
      padding: 1rem;
      border-radius: 3px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      svg{
        font-size: 1.5rem;
      }
      &:hover{
        background-color: ${props => props.theme.hover};
      }
    }
`


const CurrentDevice = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding:0 1rem ;
  padding-top: 1rem;
    svg{
      color: ${props => props.theme.main_green};
      font-size: 1.5rem;
    }
    .current_device_info{
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      width: 12rem;
      overflow: hidden;
      p{
        font-size: 1rem;
        color: white;
      }
      span{
        color: ${props => props.theme.main_green};
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        svg{
          font-size: 1rem;
        }
      }
    }
    .forget_device{
      color:whitesmoke;
      font-size: 1.2rem;
    }    
`

export default function Footer() {

  const {device} = useContext(Context)
  

  return (
    <Wrapper>
      <Container>
        <CurrentTrack />
        <PlayerControls />
        <div className="device_controls">
          <div isMobile={device?.type?.toLowerCase() === "smartphone"} className="device_button_box" data-tooltip-id="device_button">
              <DeviceButton  isActive={device?.isActive && device?.type?.toLowerCase() === "smartphone"} />
          </div>
          <Volume />
          <StyledTooltip clickable id="device_button" ><DeviceMenu/></StyledTooltip>
        </div>
      </Container>
      {device?.type?.toLowerCase() === "smartphone" && <ActiveDevice><HiSpeakerWave /> <span>Listening on {device?.name}</span></ActiveDevice>}
    </Wrapper>
    
  );
}


const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #181818;
  border-top: 1px solid #292929;
  display: flex;
  flex-direction: column;
`

const DeviceButton = styled(GoDeviceMobile)`
  position: relative;
  font-size: 1.2rem;
  color: ${props => props.isActive ? props.theme.main_green : "white"} !important;
`

const Container = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 0.8rem 1rem;
  margin: auto 0;
  .device_controls{
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 1rem;
    .device_button_box{
      position: relative;
      &:after{
        visibility: ${props=> props.isMobile ? "visible" : "hidden"};
        pointer-events: ${props=> props.isMobile ? "default" : "none"};
        position: absolute;
        top : 180%;
        left: 50%;
        content: "";
        width: 1.5rem;
        height: 1.5rem;
        transform: translateX(-50%) rotate(45deg) ;
        background-color: ${props => props.theme.main_green};
    }
    }
    svg{
      color: white;
    }
  }
`;

const ActiveDevice = styled.p`
position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: ${props=> props.theme.main_green};
    width: 100%;
    padding: 0 10rem;
    gap: 0.5rem;
    height: 23px;
    span{
      z-index: 2;
      font-size: 0.8rem;
      font-weight: bolder !important;  
      color: black;
    }
    svg{
      color: black;
      font-size: 1rem;
    }
    
`
