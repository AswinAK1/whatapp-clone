import express from 'express';
import {sendMessage, getMessage, deleteMessage} from '../controller/messageController.js'
import protectRoute from '../middleware/protectRoute.js';


const router = express.Router();

router.post("/send/:id",protectRoute, sendMessage)
router.get("/:userId",protectRoute, getMessage)
router.delete('/delete-message/:id',protectRoute, deleteMessage)




export default router
