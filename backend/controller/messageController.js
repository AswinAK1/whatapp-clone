import Conversation from "../model/conversationModel.js";
import Message from "../model/messageModel.js";
import mongoose from "mongoose";
import User from "../model/useModel.js";



const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }

    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverId,
      messages: message
    });


    conversation.messages.push(newMessage._id);

    // Save the newMessage and converstion at the same time
    await Promise.all([conversation.save(),newMessage.save()])

  //   const populatedMessage = await Message.findById(newMessage._id)
  //   .populate({
  //     path: 'senderId',
  //     select: 'profilePic fullName'
  //   })
  //   .populate({
  //     path: 'receiverId',
  //     select: 'profilePic fullName'
  //   });

  // console.log("Populated Message:", populatedMessage);
    res.status(201).json({ success:true, messages:newMessage});
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" });
  }
};



const getMessage = async(req,res) =>{
  try {
    const {userId:userToCartId} = req.params;
    const senderId = req.user._id

    const conversation = await Conversation.findOne({
      participants:{$all:[senderId,userToCartId]},
    }).populate("messages")
    
    if(!conversation){
      return res.status(404).json({ error: "Conversation not found" });
    }

      // Fetch AI messages and user messages together
    const aiMessages = await Message.find({
      $or: [
      { isAiMessage: true, receiverId: senderId }, // AI messages to the user
      { senderId, receiverId: userToCartId }      // User messages to AI
      ]
    });
    const allMessages = [...conversation.messages, ...aiMessages];

    res.status(200).json(allMessages);
    console.log(allMessages);
    


  } catch (error) {
    console.log(error);
  }
}

const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user._id;

    const messageObjectId = new mongoose.Types.ObjectId(messageId);

    const message = await Message.findById(messageObjectId);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    if (
      message.senderId.toString() !== userId.toString() &&
      message.receiverId.toString() !== userId.toString()
    ) {
      return res.status(403).json({ error: "Unauthorized to delete this message" });
    }


    const conversation = await Conversation.findOne({
      participants: { $all: [message.senderId, message.receiverId] },
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    console.log("Before Deletion:", conversation);


    const updateResult = await Conversation.updateOne(
      { _id: conversation._id },
      { $pull: { messages: messageObjectId } }
    );

    console.log("Update Result:", updateResult);

    const updatedConversation = await Conversation.findById(conversation._id);
    console.log("After Deletion:", updatedConversation);

    await Message.findByIdAndDelete(messageObjectId);

    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





export {sendMessage,getMessage, deleteMessage}