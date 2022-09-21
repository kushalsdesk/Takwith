import { arrayUnion, doc, Timestamp, updateDoc,serverTimestamp } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import Clip from '../assets/clip.png';
import Send from '../assets/send.png';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db, storage } from '../firebase';
import {v4 as uuid} from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {

  const [text,setText] = useState("");
  const [img,setImg] = useState(null);

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);


  const handleSend = async() => {
    if(img){

      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);
      
      uploadTask.on(
        (error) => {
          //setErr(true);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
            await updateDoc(doc(db,"chats" ,  data.chatId),{
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img:downloadURL
              }),
            })
          });
        }
      );

    }else{
      await updateDoc(doc(db,"chats" ,  data.chatId),{
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await  updateDoc(doc(db,"usersChats", currentUser.uid),{
      [data.chatId + ".lastMessage"]:{
        text 
      },
      [data.chatId + ".date"]: serverTimestamp(), 
    });
    await  updateDoc(doc(db,"usersChats", data.user.uid),{
      [data.chatId + ".lastMessage"]:{
        text 
      },
      [data.chatId + ".date"]: serverTimestamp(), 
    });
    setText("");
    setImg(null);

  };

  return (
    <div className='input'>
      <input type="text " 
        placeholder='Type your Message here' 
        onChange={e=> setText(e.target.value)} 
        value={text}
      />
      <div className="send">
       <input type="file" name="" id="file" 
        style={{display:"none"}}
        onChange={e=>setImg(e.target.files[0])}
       
      />
        <label htmlFor="file">
          <img src={Clip} alt="" />
        </label>
        <button style={{border:"none"}} onClick={handleSend}>
          <img src={Send} alt="" />
        </button>
      </div>
    </div>
  )
}

export default Input;
