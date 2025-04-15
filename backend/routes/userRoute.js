import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import {getUserForSidebar, addContact, removeContact, staredMessage, removeStaredMessage, archiveChat, unArchiveChat, getUserWithArchivedChats, getStaredMessages} from '../controller/userController.js'

const router = express.Router()

router.get("/",protectRoute,getUserForSidebar)
router.post('/add-contact/:userId',protectRoute,addContact)
router.post('/remove-contact/:userId',protectRoute,removeContact)
router.post("/stared-message/:messageId",protectRoute, staredMessage)
router.post("/remove-stared-message/:messageId",protectRoute,removeStaredMessage)
router.post("/archive/:userId",protectRoute,archiveChat)
router.post("/unarchive/:userId",protectRoute,unArchiveChat)
router.get("/archived-chats/:userId", protectRoute, getUserWithArchivedChats);
router.get('/get-stared-message/:userId',protectRoute,getStaredMessages)



export default router;