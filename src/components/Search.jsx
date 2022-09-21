import React, { useContext, useState } from 'react'
import  {collection, getDoc, query, serverTimestamp, updateDoc, where} from "firebase/firestore";
import {db} from "../firebase";
import { getDocs,setDoc,doc } from 'firebase/firestore';
import {AuthContext} from '../context/AuthContext';
const Search = () => {

  const [username , setUsername] =useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const {currentUser} = useContext(AuthContext);

  const handleSearch = async() => {
    const q = query(
      collection(db,"users"), 
      where("displayName" ,"==", username)
    );

    try{
      const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        setUser(doc.data())
      }); 
    }catch(err){
      setErr(true);
    }
  };

  const handleKey = e =>{
    e.code === "Enter" &&  handleSearch();
  };

  const handleSelect = async() => {
    //check whether the group(chats in firestore) exist or not
    const combinedId = 
      currentUser.uid > user.uid 
        ? currentUser.uid + user.uid 
        : user.uid+ currentUser.uid;


    try{
      const res = await getDoc(doc(db,"chats",combinedId));
    
      if(!res.exists()){
        //create a chat 
        await setDoc(doc(db,"chats" , combinedId),{messages : []});
  
        //creating the userchats
        //This is the where we update thh first user's table
        await  updateDoc(doc(db,"usersChats", currentUser.uid),{
          [combinedId + ".userInfo"]:{
            uid:user.uid,
            displayName:user.displayName,
            photoURL:user.photoURL,
          },
          [combinedId+".date"]: serverTimestamp()
        });
        //This is where we update the other user's table
        await  updateDoc(doc(db,"usersChats", user.uid),{
          [combinedId + ".userInfo"]:{
            uid:currentUser.uid,
            displayName:currentUser.displayName,
            photoURL:currentUser.photoURL,
          },
          [combinedId+".date"]: serverTimestamp()
        });
      }
    }catch(err){ }
    setUser(null);
    setUsername("")
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input type="text" name=""  
          placeholder='Search for an User' 
          onKeyDown={handleKey} 
          onChange={ e => setUsername(e.target.value)}
          value={username}
        />
      </div>

      {err && <span>Somwthing went wrong</span>}
      {user && <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
          
        </div>
      }
    </div>
  )
}

export default Search;
