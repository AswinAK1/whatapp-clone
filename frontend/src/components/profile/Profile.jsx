import React, { useContext } from "react";
import { contextContainer } from "../../context/ContextProvider";
import axios from "axios";

const Profile = ({ setShowProfile, setShowEdit }) => {
  const { user, url, setUserDetails } = useContext(contextContainer);
  console.log("user in profile:",user);
  

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${url}/api/auth/logout`, {}, { withCredentials: true });
      console.log("response in logout", response);

      if (response.status === 200) {
        alert(response.data.message);
        setUserDetails(null);
        setShowProfile(false);
      }
    } catch (err) {
      console.log(err);
      alert("Logout failed. Try again...");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white shadow-lg rounded-md p-6 max-w-[90%] sm:min-w-[350px] md:min-w-[400px] min-h-[450px]">
        {/* Close Button */}
        <div
          className="absolute top-3 right-5 cursor-pointer font-bold text-lg text-black hover:text-red-600"
          onClick={() => setShowProfile(false)}
        >
          ×
        </div>

        {/* Profile Heading */}
        <p className="text-center font-bold text-black mt-3 text-lg">Profile</p>

        {/* Profile Image */}
        <div className="h-20 w-20 mx-auto mt-3">
        <img
          src={user?.profilePic?.includes('http') ? user.profilePic : `${url}/${user?.profilePic}`}
          alt="Profile Picture"
          className="rounded-full"
        />
        </div>

        {/* Name */}
        <div className="text-center font-bold mt-4 text-lg text-black">
          <p>{user.fullName}</p>
        </div>

        {/* Info */}
        <div className="mt-5 flex flex-col text-sm sm:text-base ml-3">
        <p><span className="text-black font-medium">Phone Number : </span>{user.phoneNumber}</p>
        <p><span className="text-black font-medium">Email : </span>{user.email  }</p>
        <p><span className="text-black font-medium">About : </span>{user.about}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-5 sm:gap-14 mt-9">
          <button className="w-full sm:w-28 px-4 py-2 bg-black text-white rounded-md font-semibold hover:bg-gray-800"
            onClick={()=>setShowEdit(true)}
          >
            Edit Profile
          </button>
          <button
            className="w-full sm:w-28 px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-800"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
