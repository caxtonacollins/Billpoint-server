import {
  checkThatUserExistWithEmail,
  checkThatPasswordIsValid,
} from "../services/userService";
import JwtHelper from "../helpers/JwtHelper";
import bcrypt from "bcrypt";
import { Users } from "../models/userModel";
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
    // Get Userss collection

    // Find Users by email
    const users = await Users.findOne({ email });

    if (!users) {
      throw new Error(`Users with email: ${email} does not exist`);
    }

    const isExpired = await verifyOTP(email, verificationCode);
    log(isExpired);

    if (isExpired === false) {
      await Users.findOneAndUpdate(
        { _id: users._id },
        { $set: { verified: true, verificationOTP: "", otpCreationTime: "" } }
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
    // Find Users by email
    const user = await Users.findOne({ email });

    if (!user) {
      throw new Error("Users not found");
    }

    // const saltRounds = 10;
    // const hashedPin = await bcrypt.hash(transactionPin, saltRounds);
    const hashedPin = await hashPin(transactionPin);
    log("hashedPin:", hashedPin);

    await Users.findOneAndUpdate(
      { _id: user._id },
      { $set: { transactionPin: hashedPin, status: "active" } }
    );

    console.log("Transaction pin set successfully.");
  } catch (error: any) {
    console.error("Error verifying email:", error);
    throw new Error(error.message);
  }
};

export const verifyTransactionPin = async (
  UsersId: string,
  transactionPin: string
) => {
  const user = await Users.findOne({ _id: new ObjectId(UsersId) });

  if (!user || !user.transactionPin) {
    throw new Error("Users or transaction pin not found");
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
  try {
    const user = await checkThatUserExistWithEmail(email);

    if (!user) {
      throw new Error(`Users with email: ${email} does not exist`);
    }

    const UsersOtp = user.verificationOTP.toString();

    log(verificationCode, UsersOtp);

    if (verificationCode === UsersOtp) {
      const otpCreationTime = user.otpCreationTime;

      if (!otpCreationTime) {
        throw new Error("OTP creation time is not available");
      }

      const isExpired = checkIfOtpIsExpired(otpCreationTime);

      // setting the verificationOTP
      if (isExpired === false) {
        await Users.updateOne(
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
  } catch (error) {}
};
