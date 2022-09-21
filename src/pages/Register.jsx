/* eslint-disable default-case */
import React,{useState} from 'react'
import pic from "../assets/img.png";

import {createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {auth,db,storage} from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import  {doc, setDoc}  from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [err,setErr] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async(e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try{
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, displayName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on(
        (error) => {
          setErr(true);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
            await updateProfile(res.user,{
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db,"users",res.user.uid),{
              uid: res.user.uid,
              displayName: res.user.displayName,
              email: res.user.email,
              photoURL: downloadURL
            }); 

            await setDoc(doc(db,"usersChats", res.user.uid), {});
            navigate("/");


          });
        }
      );
    }catch(err){
      setErr(true);
      console.log(err.message);
    }
  };
  return (
    <div className='formContainer'>
      <div className='formWrapper'>
        <span className="logo">Takwith</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" name=""  placeholder='username' />
          <input type="email" name="" placeholder='email' />
          <input type="password" name=""  placeholder='password'/>
          <input style={{display: "none"}} type="file" id='file'/>
          <label  htmlFor="file">
            <img src={pic} style={{height: "35px",width:"33px"}} alt="image_uploader" />
            <span>Add an Avatar</span>
          </label>
          <button>Sign Up</button>
          {err && <span>There is some error</span>}
        </form>
        <p>You Already have an Account? <Link to="/login" style={{color : "whitesmoke"}}>Login</Link></p>
      </div>
      
    </div>
  )
}

export default Register;
