import User from "../model/useModel.js";
import Conversation from "../model/conversationModel.js";
import mongoose from "mongoose";
import Message from "../model/messageModel.js";





const getUserForSidebar = async (req, res) => {
  try {
    const loginUserId = req.user?._id;
    if (!loginUserId) {
      return res.status(400).json({ success: false, message: "Invalid user." });
    }

    const filteredUsers = await User.find({ _id: { $ne: loginUserId } }).select("-password");

    if (filteredUsers.length === 0) {
      return res.status(404).json({ success: false, message: "No users found." });
    }

    return res.status(200).json({ success: true, users: filteredUsers });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};



const addContact = async(req,res) =>{
try {
  const userId = req.params.userId;
  const {contactId} = req.body;

  const updatedContact = await User.findByIdAndUpdate(userId,{$addToSet:{contacts:contactId}},{new:true})

  res.json({success:true,user:updatedContact})

} catch (error) {
  console.log(error);
  res.status(400).json({success:true,message:"Error in adding contact"})
}
}


const removeContact = async(req,res) =>{
  try {
    const userId = req.params.userId;
    const {contactId} = req.body;

    const updatedContact = await User.findByIdAndUpdate(userId,{$pull:{contacts:contactId}},{new:true})

    res.json({success:true,user:updatedContact})

  } catch (error) {
    console.log(error);
    res.status(401).json({success:false,message:"Error in removing the contact"})
  }
}

const staredMessage = async(req,res)=>{
  try {
    const messageId = req.params.messageId;
    const userId = req.user._id
  
    const updatedUser = await User.findByIdAndUpdate(userId,{$addToSet:{staredMessages:messageId}},{new:true})
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updatedMessage = await Message.findByIdAndUpdate(messageId,{$addToSet:{staredMessages:userId}},{new:true})
    if(!updatedMessage){
      return res.status(404).json({ success: false, message: "Message not found" });

    }
  
    res.json({success:true,message:{updatedUser,updatedMessage}})
  } catch (error) {
    console.log(error);
    res.status(401).json({success:true,message:"Error while adding stared message"})
  }
  }
  
  
  const removeStaredMessage = async(req,res) =>{
    try {
      const messageId = req.params.messageId;
      const userId = req.user._id;
  
      const updatedUser = await User.findByIdAndUpdate(userId,{$pull:{staredMessages:messageId}},{new:true})
      if(!updatedUser){
        return res.status(404).json({success:false,message:"User not found"})
      }

      const updatedMessage = await Message.findByIdAndUpdate(messageId,{$pull:{staredMessage:userId}},{new:true})
      if(!updatedMessage){
        return res.status(404).json({success:false,message:"Message not found"})
      }
  
      res.json({success:true,message:{updatedUser,updatedMessage}})
    } catch (error) {
      console.log(error);
      res.status(401).send({success:true,message:"Error while removing the stared message"})
    }
  }


  const getStaredMessages = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const user = await User.findById(userId)
        .select("fullName staredMessages") // also select fullName
        .populate({
          path: "staredMessages",
          populate: {
            path: "senderId",
            select: "fullName email profilePic"
          }
        });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({
        fullName:"Stared Messages",
        success: true,
        staredMessages: user.staredMessages,
        fullName: user.fullName
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  

  
  const archiveChat = async (req, res) => {
    try {
      const userId = req.params.userId;
      const { conversationId } = req.body;
  
      if (!conversationId) {
        return res.status(400).json({ success: false, message: "Conversation ID is required" });
      }
  
      if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return res.status(400).json({ success: false, message: "Invalid conversation ID" });
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { archivedChats: conversationId } },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { $addToSet: { archivedChats: userId } },
        { new: true }
      );
      if (!updatedConversation) {
        return res.status(404).json({ success: false, message: "Conversation not found" });
      }
  
      res.status(200).json({
        success: true,
        message: "Conversation archived successfully",
        user: updatedUser,
        conversation: updatedConversation
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  

  const unArchiveChat = async(req,res) =>{
    try {
      const userId = req.params.userId;
      const { conversationId } = req.body;

      if(!conversationId){
        return res.status(401).json({success:false,message:"Conversation ID is required"})
      }

      if(!mongoose.Types.ObjectId.isValid(!conversationId)){
        return res.status(401).json({success:false,message:"Invalid conversation ID "})
      }

      const updatedUser = await User.findByIdAndDelete(userId,{$pull:{archiveChat:conversationId}},{new:true})
      if(!updatedUser){
        return res.status(404).json({success:false,message:"User not found"})
      }

      const updateConversation = await Conversation.findByIdAndUpdate(conversationId,{$pull:{archivedChats:userId}},{new:true});
      if(!updateConversation){
        return res.status(404).json({success:false,message:"Conversation not found"})
      }

      res.status(200).json({
        success: true,
        message: "Conversation unarchived successfully",
        user: updatedUser,
        conversation: updatedConversation
      });
    } catch (error) {
      console.log(error);
      res.status(401).json({success:false, message:"Error for archived message"})
    }
  }


  const getUserWithArchivedChats = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const user = await User.findById(userId)
        .populate({
          path: "archivedChats",
          populate: [
            { path: "participants", select: "fullName email" },
            { path: "message", select: "message senderId" }
          ]
        });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  


export {getUserForSidebar, addContact, removeContact, staredMessage, removeStaredMessage, archiveChat, unArchiveChat, getUserWithArchivedChats, getStaredMessages}