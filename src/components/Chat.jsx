import React, { useContext } from 'react'
import Cam from '../assets/cam.png';
import Add from '../assets/add.png';
import More from '../assets/more.png';
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {

  const {data} =useContext(ChatContext);

  return (
    <div className='chat'>
      <div className="chatInfo">
        <img src={data.user?.photoURL} alt="" className='userFace'/>
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}

export default Chat;
