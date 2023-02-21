import React, { useState } from 'react'
import { createContext } from 'react';
import { useReducer } from 'react';
import { SET_ACTIVE_DEVICE, SET_ACTIVE_DEVICES_REQUEST, SET_ACTIVE_DEVICES_SUCCESS, SET_PLAYERSTATE_FAIL, SET_PLAYERSTATE_REQUEST, SET_PLAYERSTATE_SUCCESS, SET_PLAYING, SET_PLAYLIST_FAIL, SET_PLAYLIST_ID, SET_PLAYLIST_REQUEST, SET_PLAYLIST_SUCCESS, SET_TOKEN, SET_TRACKS, SET_USER_FAIL, SET_USER_REQUEST, SET_USER_SUCCESS, SET_REPEAT_MODE, SET_RECENT_TRACKS, SET_SEARCH_RESULTS } from './actionType';


export const Context = createContext({});


export const initialState = {
    isLoading: false,
    userInfo: null,
    token: window.sessionStorage.getItem("token"),
    playlists: [],
    currentPlaying: null,
    playerState: false,
    selectedPlaylist: null,
    selectedPlaylistId: null,
    devices: [],
    device: null,
    repeatMode: "off",
    recentTracks: [],
    searchResults: [],
};


const reducer = (state, { type, payload }) => {
    switch (type) {
        case SET_USER_REQUEST:
            return { ...state, isLoading: true }
        case SET_USER_SUCCESS:
            return { ...state, userInfo: payload, isLoading: false }
    
        case SET_PLAYLIST_REQUEST:
            return { ...state, isLoading: true }
        case SET_PLAYLIST_SUCCESS:
            return { ...state, playlists: payload, isLoading: false }
        
        
        case SET_PLAYERSTATE_REQUEST:
            return { ...state, isLoading: true }
        case SET_PLAYERSTATE_SUCCESS:
            return { ...state, playerState: payload, isLoading: false }
        
        
        case SET_ACTIVE_DEVICES_REQUEST:
            return { ...state, isLoading: true }
        case SET_ACTIVE_DEVICES_SUCCESS:
            return { ...state, devices: payload, isLoading: false }
        
        case SET_ACTIVE_DEVICE:
            return { ...state, device: payload, isLoading: false }
        
        
        case SET_TOKEN:
            return { ...state, token: payload}
       
        case SET_TRACKS:
            return { ...state, selectedPlaylist: payload}
        case SET_RECENT_TRACKS:
            return { ...state, recentTracks: payload}
        case SET_PLAYING:
            return { ...state, currentPlaying: payload}
        case SET_PLAYLIST_ID:
            return { ...state, selectedPlaylistId: payload}
        case SET_SEARCH_RESULTS:
            return { ...state, searchResults: payload}
    }
}


export const ContextProvider = ({ children }) => {
    

    const [isPlaying, setIsPlaying] = useState(false);

    const [toggleSearch, setToggleSearch] = useState(false);

    const [ state, dispatch ] = useReducer(reducer, initialState);

  return (
      <Context.Provider value={{...state, dispatch, setIsPlaying, isPlaying, toggleSearch, setToggleSearch}}>{children}</Context.Provider>
  )
}

export default Context