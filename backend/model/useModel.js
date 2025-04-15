import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  fullName:{
    type:String,
    required:true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  password:{
    type:String,
    required:true,
    minlength:6
  },
  email:{
    type:String,
    required:true,
    unique:true,
    // match:[/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  profilePic:{
    type:String,
    default:""
  },
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  about: {
    type: String,
    default: "Hey there! I am using WhatsApp Clone."
  },
  archivedChats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation"
  }],
  staredMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  }],
  isOnline: {
    type: Boolean,
    default: false
  },lastSeen: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }


})

const User = mongoose.model("User",userSchema)

export default User;