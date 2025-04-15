import express from 'express'
import { signUp ,login ,logout, editUser, verifyOtp, resentOtp} from '../controller/authController.js'
import multer from 'multer'



const router = express.Router()

const storage = multer.diskStorage({
  destination: "uploads",
  filename:(req,file,cb)=>{
    return cb(null,`${Date.now()}${file.originalname}`)
  }
})

const upload = multer({storage:storage})

router.post("/signup",signUp)
router.post("/login",login)
router.post("/logout",logout)
router.put("/edit/:id",upload.single("profilePic"),editUser)
router.post('/verify-otp',verifyOtp)
router.post("/resent-otp",resentOtp)




export default router