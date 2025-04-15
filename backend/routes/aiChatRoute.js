import express from 'express';
import { chatWithAi, getAiChat } from '../controller/aiChatController.js';
import protectRoute from '../middleware/protectRoute.js';


const router = express.Router()

router.post('/send',chatWithAi)

router.post('/get',protectRoute,getAiChat)
export default router