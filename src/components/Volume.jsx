import React from "react";
import { useContext } from "react";
import styled from "styled-components";
import { setVolume } from "../utils/action";
import Context from "../utils/Context";
import { GoDeviceMobile } from 'react-icons/go'

export default function Volume() {
  const { token} = useContext(Context);

  return (
    <Container>
      <input type="range" onMouseUp={(e) => setVolume(token, e)} min={0} max={100} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-content: center;
  input {
    width: 15rem;
    border-radius: 2rem;
    height: 0.5rem;
  }
`;
