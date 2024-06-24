import { db } from "../app";
import EmailSender from "../services/mail";

export const generateRandomToken = async () => {
  const min = 1000;
  const max = 9999;
  const OTP = Math.floor(min + Math.random() * (max - min + 1));
  return OTP;
};

export const generateAndSaveOTP = async (email: string) => {
  const usersCollection = db.collection('users');
  const min = 1000;
  const max = 9999;
  const otp = Math.floor(min + Math.random() * (max - min + 1));
  const otpCreationTime = new Date();

  await usersCollection.updateOne(
    { email },
    { $set: { verificationOTP: otp, otpCreationTime } }
  );

  // Send OTP to user's email (implementation depends on your email service)
   // sending email verification otp
   const emailSender = new EmailSender(
    process.env.SENDER_EMAIL,
    process.env.SENDER_PASSWORD
  );
  await emailSender.send(
    email,
    "Your OTP Code",
    `Your OTP code is: ${otp}`
  );

  return true;
};