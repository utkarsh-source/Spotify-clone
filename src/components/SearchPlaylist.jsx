import React, { useContext, useRef, useState } from 'react'
import { AiFillClockCircle } from 'react-icons/ai';
import { BiSearch, BiSearchAlt } from 'react-icons/bi';
import styled, { css } from 'styled-components';
import { playTrack, search } from '../utils/action';
import Context from '../utils/Context';
import { useEffect } from 'react';
import { ReactDOM } from 'react-dom';
import { VscTriangleDown, VscTriangleRight } from 'react-icons/vsc';
import { IoClose } from 'react-icons/io5';
import Tooltip from './Tooltip';
import { FaRegSadTear } from 'react-icons/fa';
import { TbPlayerPause } from 'react-icons/tb';
import { CgPlayButtonO, CgPlayPauseO } from 'react-icons/cg';

function debounce(func, wait, immediate) {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;
	    
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
	
    clearTimeout(timeout);

    timeout = setTimeout(later, wait);
	
    if (callNow) func.apply(context, args);
  };
};

const SearchPlaylist = ({toggleTop}) => {


    const { toggleSearch, setToggleSearch, searchResults, dispatch, token, playerState, currentPlaying} = useContext(Context); 
    
    const modalRef = useRef()

    const [input, setInput] = useState("")

    const handleChange = debounce((val) => {
        setInput(val);
        search(dispatch, token, val)
    }, 20)


    const msToMinutesAndSeconds = (ms, seperate) => {
        let minutes = Math.floor(ms / 60000);
        let seconds = ((ms % 60000) / 1000).toFixed(0);

        return seperate ? minutes + " min " + (seconds < 10 ? "0" : "") + seconds + " sec" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    };

    

  return ( 
      <Modal $isOpen={toggleSearch}>
          <Header $toggleTop={toggleTop} className="header">
              <div className='search_box'>
                <div className='search_bar'>
                    <BiSearchAlt />
                    <input value={input} onChange={(e)=> handleChange(e.target.value)} type="text" placeholder="Search for songs or episodes"/>
                  </div>
                  <div onClick={()=>setToggleSearch(false)} data-tooltip-id='back_button' className='back_button'>
                      <IoClose/>
                  </div>
                  <Tooltip id="back_button">Close</Tooltip>
              </div>
          {searchResults?.tracks?.length && <><div className="header-row">
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
                  <span>
                      <AiFillClockCircle />
                  </span>
              </div>
          </div>
              <hr className="header_row_ruler" /></>
              }
        </Header>
          {searchResults?.tracks?.length ?
          <Tracks>
              <div className="tracks">
              {searchResults.tracks.length ? searchResults.tracks.map(
                (
                  {
                    id,
                    name,
                    artists,
                        duration,
                    image,
                    album,
                    context_uri,
                    track_number,
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
                        )
                      }
                    >
                      <div className="col">
                        <span>{currentPlaying?.id == id ? playerState.isPlaying ? <CgPlayPauseO/> : <CgPlayButtonO/> :  index + 1}</span>
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
                        <span>{msToMinutesAndSeconds(duration)}</span>
                      </div>
                    </div>
                  );
                }
              ) : null
              }
            </div>
              </Tracks> : <Info><FaRegSadTear/> Nothing here...</Info>
        }
    </Modal>
  )
}

export default SearchPlaylist



const Info = styled.p`  
    display: flex;
    align-items: center;
    gap: 1rem;
    color: whitesmoke;
    font-size: 2rem;
    padding: 3rem 3rem;
    svg{
        font-size: 3rem;
    }
`

const Header = styled.header`
        position: relative;
        width: 100%;
        position: sticky;
        top: 0;
        padding: 2rem;
         padding-bottom: 0;
         margin-bottom: 1rem;
        background-color: #141414;
        
        .search_box{
            display: flex;
            align-items: center;
            gap: 1rem;
            width: 100%;
            .search_bar{
                display: flex;
                align-items: center;
                gap: 1rem;
                background-color: ${props=> props.theme.hover};
                border-radius: 100px;
                overflow: hidden;
                width: 100%;
                input{
                    width:100% ;
                    padding: 1rem;
                    padding-left: 80px;
                    border: none;
                    outline: none;
                    font-size: 1.2rem;
                    background-color: transparent;
                    color: white;
                    &::placeholder{
                        color: white;
                    }
                }
                svg{
                    position: absolute;
                    font-size: 2rem;
                    margin-left: 30px;
                    color: white;
                }
            }
            .back_button{
                display: grid;
                place-items: center;
                background-color: ${props => props.theme.hover};
                width: 3.5rem;
                height: 3.5rem;
                flex-shrink: 0;
                border-radius: 100%;
                cursor: pointer;
                svg{
                    color: white;
                    font-size: 1.3rem;
                }
            }
        }
        .header-row {
            display: grid;
            grid-template-columns: 0.1fr 1.2fr 1fr  0.1fr;
            margin: 1rem 0 0 0;
            color: #dddcdc;
            padding: 1rem;
            transition: 0.3s ease-in-out;
        }
        .header_row_ruler{
            width: 100%;
                height: 0.1px;
                background-color: #464646;
                opacity: 0.5;
                border: none;
                margin: 0 auto;
        }
    
`

const Modal = styled.div`
    position: absolute;
    top: 0;
    transition: opacity 0.07s ease-out;
    background:  #141414;
    width: 100%;
    height: max-content;
    pointer-events: none;
    opacity: 0;
    z-index: 99999999999;
    ${props => props.$isOpen && css`
    pointer-events: auto;
        opacity: 1;
    `}
    min-height: 87vh;
`

const Tracks = styled.div`
    padding: 2rem;
    padding-top: 0;
    .tracks {
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
        padding: 0.7rem 1rem;
        display: grid;
        grid-template-columns: 0.1fr 1.2fr 1fr 0.1fr;
        cursor: pointer;
        &:hover {
          background-color: ${props=> props.theme.hover};
        }
        border-radius: 5px;
        .col {
          display: flex;
          align-items: center;
          span{
            font-size: 0.9rem;
            color: ${props => props.theme.dirty_white};
            svg{
                font-size: 1.5rem;
                margin-left: -7px;
                color: ${props => props.theme.main_green};
            }
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

`

const Playlists = styled.div`

`

const Card = styled.div`

`