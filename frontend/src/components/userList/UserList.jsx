import React, { useContext } from "react"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { contextContainer } from "../../context/ContextProvider";


const UserList = ({users}) => {

  const {user, url, selectedIndex, setSelectedIndex} = useContext(contextContainer)
  // console.log("Users in the chat",users);
  

  const handleSelection = (user) =>{
    setSelectedIndex(user)
  }
  // console.log("handle selected index:",selectedIndex);
  
  
  
  return (
    <div>
      {users && users.length > 0 ? (
        users.map((user,index)=>(
          <div key={index} onClick={() =>handleSelection(user)} className={`w-full h-16 rounded-md py-2 flex mb-1 ${
            selectedIndex === user ? "bg-[#454545]" : "hover:bg-[#454545]"
          } cursor-pointer`}>
          <div className="flex bg-[#494949] h-12 w-14 ml-3 mx-auto rounded-full ">
            <img
              src={user?.profilePic?.includes('http') ? user.profilePic : `${url}/${user?.profilePic}`}
              alt="Profile Picture"
              className="rounded-full"
            />

          </div>
            <div className="w-full h-12">
              <p className="ml-4 font-medium text-white">{user?.fullName}</p>
              <p className="ml-4 text-xs text-white"></p>
            </div>
          </div>
      
        ))
      ) : (
        <div className="flex align-center justify-center">
          <p>No chats available</p>
        </div>
      )}
    </div>
  )
}

export default UserList