import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema({
  participants:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
  ],
  messages:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Message",
      default:[],
    }
  ],
  archivedChats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: []
  }],
  isAiChat:{
    type:Boolean,
    default:false
  }
},{timestamps:true})


const Conversation = mongoose.model("Conversation",conversationSchema)
export default Conversation;