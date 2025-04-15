import { faBars ,faPhone, faComment, faCircleNotch,faStar,faBoxArchive, faGear, faUser} from '@fortawesome/free-solid-svg-icons';
import {faMeta} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useContext, useState} from 'react'
import React from 'react';
import {useNavigate} from 'react-router-dom'
import {contextContainer} from '../../context/ContextProvider'
import { toast } from 'react-toastify';



const SideBar = ({setShowLogin, setShowProfile}) => {

  const {user,url, selectedIndex, setSelectedIndex,allUsers, fetchStaredMessages, setChatMessages, chatMessages, staredMessage} = useContext(contextContainer)

  // console.log("user in sidebar",user);
  
  const [showAiChat, setShowAiChat] = useState(false);
  const [showNavbar,setShowNavbar] = useState(false)

  const navigate = useNavigate()

  return (
    <div className='h-screen bg-[#202020] w-14 flex fixed z-10 rounded-tr-lg'>
      <div className="dropdown dropdown-right mt-12 ">
      <button onClick={() => setShowNavbar(!showNavbar)} className='mt-1 p-1 ml-3'>
        <FontAwesomeIcon icon={faBars} style={{ color: "#ffffff" }} />
      </button>

      {/* Individual Icons with Spacing */}
      <button className="mt-2 p-1  ml-3">
        <FontAwesomeIcon icon={faComment} style={{ color: "#ffffff" }} />
      </button>

      <button className="mt-4 p-1 ml-3">
        <FontAwesomeIcon icon={faPhone} style={{ color: "#ffffff" }} />
      </button>

      <button className="mt-4 p-1 ml-3">
        <FontAwesomeIcon icon={faCircleNotch} style={{ color: "#ffffff" }} />
      </button>

      <button
        className="mt-4 p-1 ml-3"
        onClick={() => {
          const aiBotUser = allUsers.find((u) => u.fullName === "AI Bot");
          if (aiBotUser) {
            setSelectedIndex(aiBotUser);
            setShowAiChat(true);
            toast.success("You are now interacting with AI Bot!");
          } else {
            toast.error("AI Bot chat not available.");
          }
        }}
      >
        <FontAwesomeIcon icon={faMeta} style={{ color: "#ffffff" }} />
      </button>

      <button className="mt-48 p-1 ml-3 " onClick={() => {
            fetchStaredMessages();
            setChatMessages([...staredMessage]);
            setSelectedIndex({ _id: "starred", fullName: "Starred Messages", isStarred: true })
            }}>
        <FontAwesomeIcon icon={faStar} style={{ color: "#ffffff" }} />
      </button>

      <button className="mt-1 p-1 ml-3">
        <FontAwesomeIcon icon={faBoxArchive} style={{ color: "#ffffff" }} />
      </button>

      <button className="mt-6 p-1 ml-3">
        <FontAwesomeIcon icon={faGear} style={{ color: "#ffffff" }} />
      </button>

      {/* User Icon with Navigation */}
      <button className="mt-1 p-1 ml-3">
        {user ? (
          <img
            src={user?.profilePic?.includes('http') ? user.profilePic : `${url}/${user?.profilePic}`}
            alt="Profile Picture"
            className="w-6 h-6 rounded-full"
            onClick={()=>setShowProfile(true)}
          />
        ): (
          <FontAwesomeIcon icon={faUser} style={{ color: "#ffffff" }}  onClick={() => setShowLogin(true)} />
        )
        }
      </button>
        {showNavbar && (
        <ul tabIndex={0} className="dropdown-content menu bg-[#2c2c2c] z-[1] w-52 p-2 shadow h-full fixed top-0 left-0">
          <li className='mt-9 text-white'><a>Chats</a></li>
          <li className='mt-2 text-white'><a>calls</a></li>
          <li className='text-white mt-2'><a>status</a></li>
          <li></li>
          <li className='mb-2 text-white'
          onClick={() => {
            const aiBotUser = allUsers.find((u) => u.fullName === "AI Bot");
            if (aiBotUser) {
              setSelectedIndex(aiBotUser);
              setShowAiChat(true);
              toast.success("You are now interacting with AI Bot!");
            } else {
              toast.error("AI Bot chat not available.");
            }
          }}
          ><a>Meta Ai</a></li>
          <li className="mt-44 text-white " onClick={() => {
            fetchStaredMessages();
            setChatMessages([...staredMessage]);
            setSelectedIndex({ _id: "starred", fullName: "Starred Messages", isStarred: true })
            }}>
              <a>Stared Message</a>
          </li>
          <li className='text-white'><a>Archived Chats</a></li>
          <li></li>
          <li className='text-white'><a>Settings</a></li>
          <li className='text-white'>{user ?<a onClick={()=>setShowProfile(true)}>Profile</a> : <a onClick={()=>setShowLogin(true)}>Add Account</a>}</li>
        </ul>
        )}

      </div>
    </div>
  )
}

export default SideBar