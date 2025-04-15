import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar'
import SideBar from '../../components/SideBar/SideBar'
import Chat from '../../components/chat/Chat'
import Profile from '../../components/profile/Profile'
import Login from '../../components/login/Login'
import EditProfile from '../../components/editProfile/EditProfile'
import UserChat from '../../components/UserChat/UserChat';

const Home = () => {

  const [showLogin,setShowLogin] = useState(false)
    const [showProfile,setShowProfile] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    
  return (
    <div className='h-screen'>
      {showLogin ? <Login setShowLogin={setShowLogin}/>:<></>}
      {showProfile ? <Profile setShowProfile={setShowProfile} setShowEdit={setShowEdit}/> : <></>}
      {showEdit ? <EditProfile setShowEdit={setShowEdit}/> : <></>}

      <Navbar/>
      <SideBar setShowLogin={setShowLogin} setShowProfile={setShowProfile} />
      <div className="flex flex-row h-full">
      <Chat className="w-1/3" />
      <UserChat className="w-2/3" />
    </div>
      <Routes>
        <Route path='/edit-profile' element={<EditProfile />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Chat' element={<Chat/>} />
      </Routes>
      
    </div>
  )
}

export default Home