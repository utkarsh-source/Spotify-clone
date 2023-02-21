import React, { useEffect } from "react";
import styled from "styled-components";
import { useContext } from "react";
import Context from "../utils/Context";
import { getCurrentTrack } from "../utils/action";


const TrackDetails = ({ track }) => {

  return track ? <div className="track">
    <div className="track__image">
      <img src={track.image} alt="currentPlaying" />
    </div>
    <div className="track__info">
      <h4 className="track__info__track__name">{track.name}</h4>
      <h6 className="track__info__track__artists">
        {track.artists.join(" ,  ")}
      </h6>
    </div>
  </div> : null;
}


export default function CurrentTrack() {
  const { currentPlaying, recentTracks} = useContext(Context);
  
  
  return (
    <Container>
      {currentPlaying ? 
        <TrackDetails track={currentPlaying} /> : <TrackDetails track={recentTracks[0]} />
      }
    </Container>
  );
}

const Container = styled.div`
  .track {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    &__image {
      position: relative;
      width: 4rem;
      height: 4rem;
      img{
        height: 100%;
        width: 100%;
      }
    }
    &__info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      &__track__name {
        color: white;
        font-weight: 500;
        font-size: 0.9rem;
        max-width: 20rem;
        white-space: nowrap;
        overflow: hidden;
      }
      &__track__artists {
        font-size: 0.7rem;
        font-weight: normal;
        color: ${props=> props.theme.dirty_white};
      }
    }
  }
`;
