import { db } from "../app";
import {
  checkThatUserExistWithEmail,
  checkThatPasswordIsValid,
} from "../services/userService";
import JwtHelper from "../helpers/JwtHelper";
import bcrypt from "bcrypt";
import { log } from "console";
import { ObjectId } from "mongodb";
import { checkIfOtpIsExpired } from "../helpers/checkIfOtpExpire";
import { comparePin, hashPin } from "../helpers/hashPin";

/**
 * @method verifyEmail
 * @static
 * @async
 * @param {string} email
 * @param {string} verificationCode
 */

export const verifyEmail = async (email: string, verificationCode: string) => {
  try {
    // Get users collection
    const usersCollection = db.collection("users");

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      throw new Error(`User with email: ${email} does not exist`);
    }

    const isExpired = await verifyOTP(email, verificationCode);
    log(isExpired);

    if (isExpired === false) {
      await usersCollection.findOneAndUpdate(
        { _id: user._id },
        { $set: { verified: true } }
      );
    }
  } catch (error: any) {
    console.error("Error verifying email:", error);
    throw new Error(error.message);
  }
};

/**
 * @method setTransactionPin
 * @static
 * @async
 * @param {string} email
 * @param {string} transactionPin
 */

export const setTransactionPin = async (
  email: string,
  transactionPin: string
) => {
  try {
    // Get users collection
    const usersCollection = db.collection("users");

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    // const saltRounds = 10;
    // const hashedPin = await bcrypt.hash(transactionPin, saltRounds);
    const hashedPin = await hashPin(transactionPin);
    log("hashedPin:", hashedPin);

    await usersCollection.findOneAndUpdate(
      { _id: user._id },
      { $set: { transactionPin: hashedPin } }
    );

    console.log("Transaction pin set successfully.");
  } catch (error: any) {
    console.error("Error verifying email:", error);
    throw new Error(error.message);
  }
};

export const verifyTransactionPin = async (
  userId: string,
  transactionPin: string
) => {
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
  if (!user || !user.transactionPin) {
    throw new Error("User or transaction pin not found");
  }

  const match = await comparePin(transactionPin, user.transactionPin);
  if (!match) {
    throw new Error("Incorrect transaction pin");
  }

  return true;
};

/**
 * @method authenticate
 * @static
 * @async
 * @param {string} email
 * @param {string} password
 * @returns {boolean}
 */

export const verifyOTP = async (email: string, verificationCode: string) => {
  const usersCollection = db.collection("users");
  const user = await checkThatUserExistWithEmail(email);

  if (!user) {
    throw new Error(`User with email: ${email} does not exist`);
  }

  const userOtp = user.verificationOTP.toString();

  log(verificationCode, userOtp);

  if (verificationCode === userOtp) {
    const otpCreationTime = user.otpCreationTime;

    const isExpired = checkIfOtpIsExpired(otpCreationTime);

    // setting the verificationOTP
    if (isExpired === false) {
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { verificationOTP: "", otpCreationTime: "" } }
      );
      return true;
    }
    return false;
  } else {
    console.log({ error: true, message: "Incorrect OTP😢" });
    throw new Error("Incorrect OTP😢");
  }

  return true;
};
