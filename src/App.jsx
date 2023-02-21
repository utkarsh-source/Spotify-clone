import React, { useEffect } from "react";
import { useContext } from "react";
import Login from "./components/Login";
import Spotify from "./components/Spotify";
import Context from "./utils/Context";
export default function App() {
  const { token, userInfo } = useContext(Context);

  return <div>{token && userInfo?.userId ? <Spotify /> : <Login />}</div>;
}
