import { SET_ACTIVE_DEVICE, SET_ACTIVE_DEVICES_REQUEST, SET_ACTIVE_DEVICES_SUCCESS, SET_CHANGESTATE_FAIL, SET_CHANGESTATE_REQUEST, SET_CHANGESTATE_SUCCESS, SET_PLAYERSTATE_FAIL, SET_PLAYERSTATE_REQUEST, SET_PLAYERSTATE_SUCCESS, SET_PLAYING, SET_PLAYLIST_FAIL, SET_PLAYLIST_REQUEST, SET_PLAYLIST_SUCCESS, SET_RECENT_TRACKS, SET_REPEAT_MODE, SET_SEARCH_RESULTS, SET_TOKEN, SET_TRACKS, SET_TRACT_STATE, SET_USER_FAIL, SET_USER_REQUEST, SET_USER_SUCCESS } from "./actionType";
import axios from "./axios";
import { default as ax } from "axios"

export const getUserInfo = async (dispatch, token) => {
  dispatch({ type: SET_USER_REQUEST })
  try {
    const { data } = await axios.get("/me", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    const userInfo = {
      userId: data.id,
      userUrl: data.external_urls.spotify,
      name: data.display_name,
      email: data.email,
      image: data.images[0].url,
      product: data.product,
      followers: data.followers.total,
      filter_enabled: data.explicit_content.filter_enabled,
      filter_locked: data.explicit_content.filter_locked,
      href: data.href,
    };
    dispatch({ type: SET_USER_SUCCESS, payload: userInfo });
  }
  catch (err) {
    dispatch({ type: SET_USER_FAIL, payload: err });
  }
};



export const setActiveDevice = async(dispatch, token, device) => {
  await axios.put("/me/player", 
    {
      play: true,
      device_ids: [device?.id],},
    {
      headers : {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }
  );
  dispatch({ type: SET_ACTIVE_DEVICE, payload: device });
}


export const setSeekPosition = async (dispatch, token, position) => {
  await axios.put("/me/player/seek", 
    {},
    {
      params: {
          position_ms : +Math.round(position)
      },
      headers : {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }
  );
  getCurrentTrack(dispatch, token)
}



export const search = async (dispatch, token, query) => {
  const { data} = await axios.get("/search", 
    {
      params: {
        q: query,
        type : "track,playlist"
      },
      headers : {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }
  );
  const tracks = data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map((artist) => artist.name),
        image: track.album?.images[0]?.url,
        duration: track.duration_ms,
        album: track.album.name,
        context_uri: track.album.uri,
        track_number: track.track_number,

  }))
  dispatch({ type: SET_SEARCH_RESULTS, payload: {tracks, playlists : data.playlists} })
}


export const getPlaylistData = async (dispatch, token, userInfo) => {
  dispatch({ type: SET_PLAYLIST_REQUEST })
  try {
    const response = await axios.get(
      `users/${userInfo.userId}/playlists`,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    const { items } = response.data;
    const playlists = items.map(({ name, id }) => {
      return { name, id };
    });
    dispatch({ type: SET_PLAYLIST_SUCCESS, payload: playlists })
    getInitialPlaylist(dispatch, token, playlists[0].id)
  }
  catch (err) {
    dispatch({ type: SET_PLAYLIST_FAIL, payload: err });
  }
};


export const login = async (code, setIsLoading) => {
  try {
    const res = await ax.post("https://accounts.spotify.com/api/token", {
      code,
        redirect_uri : process.env.REACT_APP_REDIRECT_URI,
        grant_type: 'authorization_code'
      }, {
        headers: {
          Authorization: "Basic " + window.btoa(encodeURIComponent(process.env.REACT_APP_CLIENT_ID + ":" + process.env.REACT_APP_CLIENT_SECRET)),
          json: true
        }
      })
      console.log(res);
      document.title = "Spotify";
  } catch (err) {
        console.log(err)
        sessionStorage.clear();
    }
    finally {
      setIsLoading(false);
    }
}

export const logout = (dispatch) => {
  window.sessionStorage.removeItem("token");
  dispatch({type: SET_TOKEN, payload : null})
}


export const getPlaybackState = async (dispatch, token) => {
  dispatch({ type: SET_PLAYERSTATE_REQUEST })
  try {
    const { data } = await axios.get("/me/player", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    const playBackState = {
      progress: data.progress_ms,
      repeatMode: data.repeat_state,
      shuffleMode: data.shuffle_state,
      isPlaying : data.is_playing
    }
    dispatch({ type: SET_PLAYERSTATE_SUCCESS, payload: playBackState })
    return playBackState;
  }
  catch (err) {
    console.log(err);
  }
};


export const changeState = async (dispatch, token, state, isSameAsCurrent, setIsPlaying) => {
  try {
    await axios.put(
      `me/player/${state}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    await getPlaybackState(dispatch, token);
    if (isSameAsCurrent) {
      setIsPlaying(state == "pause" ? false : true)
    } else {
      getCurrentTrack(dispatch, token)
    }
  }
  catch (err) {
   console.log(err);
  }
};


export const changeTrack = async (dispatch, token, type, firstTrackId, setIsPlaying) => {
  try {
    await axios.post(
      `me/player/${type}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    getPlaybackState(dispatch, token);
    const response1 = await axios.get(
      "/me/player/currently-playing",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response1.data !== "") {
      const currentPlaying = {
        id: response1.data.item.id,
        name: response1.data.item.name,
        artists: response1.data.item.artists.map((artist) => artist.name),
        image: response1.data.item.album.images[2].url,
        duration: response1.data.item.duration_ms,
        progress : response1.data.progress_ms
      };
      if (firstTrackId == currentPlaying.id) {
        setIsPlaying(true)
      } else {
        setIsPlaying(false)
      }
      dispatch({ type: SET_PLAYING, payload: currentPlaying });
    } else {
      dispatch({ type: SET_PLAYING, payload: null });
    }
  }
  catch (err) {
    console.log("err in chaning track");
  }
};





export const setVolume = async (token, e) => {
  try {
    await axios.put(
      "/me/player/volume",
      {},
      {
        params: {
          volume_percent: parseInt(e.target.value),
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
  }
  catch (err) {
    console.log(err);
  }
};


export const setRepeatMode = async (dispatch, token, state) => {
  try {
    await axios.put(
      "me/player/repeat",
      {},
      {
        params: {
          state,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    getPlaybackState(dispatch, token)
  }
  catch (err) {
    console.log(err);
  }
};

export const getCurrentTrack = async (dispatch, token) => {
  const response = await axios.get(
    "/me/player/currently-playing",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
  if (response.data !== "") {
    const currentPlaying = {
      id: response.data.item.id,
      name: response.data.item.name,
      artists: response.data.item.artists.map((artist) => artist.name),
      image: response.data.item.album.images[2].url,
      duration: response.data.item.duration_ms,
      progress : response.data.progress_ms
    };
    
    dispatch({ type: SET_PLAYING, payload: currentPlaying });
    return currentPlaying
  } else {
    dispatch({ type: SET_PLAYING, payload: null });
    getRecentTracks(dispatch, token)
  }
};

export const getInitialPlaylist = async (dispatch, token, selectedPlaylistId) => {
  try {
    const response = await axios.get(
      `playlists/${selectedPlaylistId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    const selectedPlaylist = {
      id: response.data.id,
      name: response.data.name,
      displayName: response.data.owner.display_name,
      description: response.data.description.startsWith("<a")
        ? ""
        : response.data.description,
      image: response.data?.images[0]?.url,
      totalSong: response.data.tracks.total,
      totalDuration: response.data.tracks.items.reduce((initial, { track: { duration_ms } }) => initial + duration_ms, 0),
      tracks: response.data.tracks.items.map(({ added_at, track }) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map((artist) => artist.name),
        image: track?.album?.images[2]?.url,
        duration: track.duration_ms,
        album: track.album.name,
        context_uri: track.album.uri,
        track_number: track.track_number,
        dateAdded: added_at,

      })),
    };
    dispatch({ type: SET_TRACKS, payload: selectedPlaylist });
  } catch (err) {
    console.log(err)
  }
};


export const getActiveDevices = async (dispatch, token) => {
  dispatch({ type: SET_ACTIVE_DEVICES_REQUEST })
  try {
    const { data } = await axios.get("me/player/devices",
      {
        headers: {
          Authorization: "Bearer " + token,
            "Content-Type": "application/json",
              },
      }
    )
    const devices = data.devices.map((device) => {
      return {
        id : device.id,
        isActive: device.is_active,
        isPrivate: device.is_private_session,
        isRestricted: device.is_restricted,
        name: device.name,
        type: device.type,
        volume : device.volume_percent
      }
    })
    const activeDevice = devices.find(device => device.isActive === true)
    if (!activeDevice) {
      setActiveDevice(dispatch, token, devices[0])
    }
    dispatch({ type: SET_ACTIVE_DEVICES_SUCCESS, payload: devices })
    dispatch({ type: SET_ACTIVE_DEVICE, payload: activeDevice });
    }
    catch (err) {
      console.log(err)
    }
}


export const playTrack = async (
  dispatch,
  token,
  id,
  name,
  artists,
  image,
  context_uri,
  track_number, 
  setIsPlaying,
  state,
  currentTrackId
) => {
  if (currentTrackId != id) {
    await axios.put(
      `me/player/play`,
      {
        context_uri,
        offset: {
          position: track_number - 1,
        },
        position_ms: 0,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
  }
  state = state && currentTrackId == id ? "pause" : "play"
  if (currentTrackId == id && state) {
    changeState(dispatch, token, state, currentTrackId == id, setIsPlaying);
  } else {
    getPlaybackState(dispatch, token)
    setIsPlaying(true);
    getCurrentTrack(dispatch, token)
  }
};



export const setShuffleMode = async (dispatch, token, state) => {
  try {
    await axios.put(
      "me/player/shuffle",
      {},
      {
        params: {
          state,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    getPlaybackState(dispatch, token)
  }
  catch (err) {
    console.log(err);
  }
};


export const getRecentTracks = async (dispatch, token) => {
  try {
    const { data } = await axios.get(
      `me/player/recently-played`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    const recentTracks = data.items.map(({ track }) => ({
      name: track.name,
      albumName: track.album.name,
      image : track.album.images[0].url,
      id: track.id,
      artists: track.artists.map((artist) => artist.name),
      duration : track.duration_ms,
    }))
    dispatch({ type: SET_RECENT_TRACKS, payload : recentTracks})
  }
  catch (err) {
   console.log(err);
  }
};






