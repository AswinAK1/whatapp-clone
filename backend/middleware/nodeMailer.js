import express, { text } from 'express'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

const getRandomNumber = () =>{
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return randomNumber;
}

const generateOtp = (email) =>{

  if (!email) {
    console.error("Error: Email is undefined. Cannot send OTP.");
    return null; // Prevent further execution if email is missing
  }

  const otp = getRandomNumber()

  // Generate a JWT token containing the OTP
  const otpToken = jwt.sign({ email, otp }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' });

  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: process.env.USERS_EMAIL,
      pass: process.env.USERS_PASSWORD,
    },
  });
  
  const mailOption = {
    from:"aswinak50561@gmail.com",
    to:email,
    subject: "Whatsapp clone has send an email for authentication",
    text:`Your Otp for authentication is ${otp}`
  }

  transporter.sendMail(mailOption, (err, info)=>{
    if(err){
      console.log("error in sending mail",err);
    }
  })
  return otp;
}

export default generateOtp;