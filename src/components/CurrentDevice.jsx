import React, { useContext } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { GoDeviceMobile } from 'react-icons/go';
import { HiComputerDesktop, HiSpeakerWave } from 'react-icons/hi2';
import { IoStatsChart } from 'react-icons/io5';
import styled from 'styled-components';
import Context from '../utils/Context';

const CurrentDevice = () => {

const { playerState, device } = useContext(Context);

  return (
     <Device> 
          {playerState.isPlaying ? <IoStatsChart /> : device?.type?.toLowerCase() == "smartphone" ? <GoDeviceMobile /> : <HiComputerDesktop />}
          <div className="current_device_info">
            <span><HiSpeakerWave /> {device?.name}</span>
          </div>
    </Device>
  )
}

export default CurrentDevice


const Device = styled.div`
    position: relative;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding : 0.5rem 1rem;
  background-color: ${props=> props.theme.hover};
  border-radius: 3px;
     svg{
      color: white;
      font-size: 1.5rem;
    }
    .current_device_info{
      display: flex;
        span{
            color: white;
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

