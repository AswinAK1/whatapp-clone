import React, { useContext, useState, useRef } from 'react'
import { contextContainer } from '../../context/ContextProvider'
import axios from 'axios'


const EditProfile = ({setShowEdit}) => {

  const {user,url,setUserDetails} = useContext(contextContainer)
  const fileInputRef = useRef(null);



  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const [editedData, setEditedData] = useState({
    fullName:"",
    about:"",
    profilePic:""
  })

  const onChangeHandler = (event) =>{
    const {name, value} = event.target;
    setEditedData((prev)=>({...prev, [name]:value}))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      // Read the file as a Data URL for preview
      reader.onload = (e) => {
        setEditedData((prev) => ({
          ...prev,
          profilePic: e.target.result,
        }));
      };
  
      reader.readAsDataURL(file);

      console.log("Render the uploaded file",reader);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("fullName", editedData.fullName);
      formData.append("about", editedData.about);
  
      if (fileInputRef.current?.files[0]) {
        formData.append("profilePic", fileInputRef.current.files[0]);
      }
  
      const response = await axios.put(`${url}/api/auth/edit/${user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response in the edit:",response);
      
  
      if (response.data.success) {
        alert("Profile updated successfully!");
        setUserDetails(response.data.user)
        setShowEdit(false);
      } else {
        alert(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile.");
    }
  };
  
  
  
  

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='relative bg-white shadow-lg rounded-md p-6 max-w-[90%] sm:min-w-[350px] md:min-w-[400px] min-h-[450px]'>
      <div
          className="absolute top-3 right-5 cursor-pointer font-bold text-lg text-black hover:text-red-600"
          onClick={() => setShowEdit(false)}
        >
          ×
        </div>
        <form onSubmit={onSubmitHandler}>
        <div className="h-16 w-16 mt-3">
        <img
          src={user?.profilePic?.includes('http') ? user.profilePic : `${url}/${user?.profilePic}`}
          alt="Profile Picture"
          className="rounded-full"
        />
        </div>
        <div className="font-medium mt-1 text-lg text-black">
          <p>{user.fullName}</p>
          <p className='font-normal text-sm '>aswinak1212@gmail.com</p>
        </div>
        <hr className='mt-2 mb-4' />
        <div className='flex'>
          <p className='mr-16 text-black text-sm font-semibold'>Name</p>
          <input type="text" name='fullName' value={editedData.fullName} onChange={onChangeHandler} className='bg-white border w-80 rounded-md border-gray-300 text-xs px-2 py-1 focus:outline focus:outline-2 focus:outline-black'/>
        </div>
        <hr  className='mt-3 mb-3'/>
        {/* <div className='flex'>
          <p className='mr-4 text-black text-sm font-semibold'>Email Address</p>
          {/* <FontAwesomeIcon icon={faEnvelope} style={{color: "#000000",}} className='absolute left-36 top-54' /> */}
          {/* <input  type="mail" className='w-80 bg-white border rounded-md border-gray-300 text-xs px-2 py-1 focus:outline focus:outline-2 focus:outline-black'/>
        </div> */}
        <hr  className='mt-3 mb-3'/>
        <div className='flex'>
          <p className='mr-16 text-black text-sm font-semibold'>About</p>
          {/* <FontAwesomeIcon icon={faEnvelope} style={{color: "#000000",}} className='absolute left-36 top-54' /> */}
          <input  type="mail" name='about' value={editedData.about} onChange={onChangeHandler} className='w-80 bg-white border rounded-md border-gray-300 text-xs px-2 py-1 focus:outline focus:outline-2 focus:outline-black'/>
        </div>
        <hr  className='mt-3 mb-3'/>
        {/* <div className='flex'>
          <p className='mr-8 text-black text-sm font-semibold'>User Name</p>
          <input  type="mail" className='w-80 bg-white border rounded-md border-gray-300 text-xs px-2 py-1 focus:outline focus:outline-2 focus:outline-black'/>
        </div> */}
        <hr  className='mt-3 mb-3'/>
        <div className='flex'>
          <p className="mr-4 text-black text-sm font-semibold">Profile Photo</p>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="h-10 w-10 mt-6">
          <img
            src={user?.profilePic?.includes('http') ? user.profilePic : `${url}/${user?.profilePic}`}
            alt="Profile Picture"
            className="rounded-full"
          />
          </div>
          <button
              type="button"
              className="border ml-4 mt-6 h-8 p-2 rounded-md text-xs cursor-pointer font-semibold text-black"
              onClick={handleButtonClick}
            >
              Click to replace
            </button>
        </div>
        <hr  className='mt-3 mb-3'/>
        <div className='flex flex-col sm:flex-row justify-center mt-9 '>
          <button className='border p-2 rounded-md font-semibold text-red-700 cursor-pointer bg-red-200 mr-16 text-sm px-4 py-2'>
            Delete user
          </button>
          
          <button className='border  rounded-md font-semibold text-black cursor-pointer ml-10 mr-4 text-sm px-4 py-2' 
            onClick={()=>setShowEdit(false)}
          >
            Cancel
          </button>
          <button className='border font-semibold text-white bg-black p-2 rounded-md cursor-pointer text-sm px-4 py-2'>
            Save changes
          </button>
        </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfile