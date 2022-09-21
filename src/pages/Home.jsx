import React from 'react'
import Chat from '../components/Chat';
//import Search from '../components/Search';
import Sidebar from '../components/Sidebar';

const Home = () => {
  return (
    <div className='home'>
      <div className='container'>
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  )
}

export default Home;
