import '../App.css';
import '../Chat.css'
import ChatBody from './chat_body';
import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:4000');


function ChatPage()
{
  //Access state details from previous component
  const {state} = useLocation();
  const username = state["username"];

    return(
        <div>
        <ChatBody socket={socket}/>
    </div>
    )
    
}

export default ChatPage;