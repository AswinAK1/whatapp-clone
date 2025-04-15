import jwt from 'jsonwebtoken'
import User from '../model/useModel.js';

const protectRoute = async(req,res,next)=>{
  try {
    const token = req.cookies.jwt;
    if(!token){
      return res.status(401).json({error:"Unauthorized token - No token provided"})
    }

    const decode = jwt.verify(token,process.env.JWT_SECRET_KEY)
    if(!decode){
      return res.status(401).json({error:"Unauthorized token - No token provided"})
    }

    const user = await User.findById(decode.userId).select("-password")

    if(!user){
      return res.status(404).json({error:"User not found"})
    }
    
    req.user = user
    next();

  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal server error"})
  }
}

export default protectRoute;