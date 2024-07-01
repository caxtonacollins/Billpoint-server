import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  verifyEmail,
  setTransactionPin,
  verifyOTP,
  verifyTransactionPin,
} from "../services/authService";
import { log } from "console";
import { IUserRequest } from "../interfaces";
import {
  checkThatPasswordIsValid,
  checkThatUserExistWithEmail,
  updateUserByEmail,
  updateUserById,
} from "../services/userService";
import {
  generateAndSaveOTP,
  generateRandomToken,
} from "../helpers/GenerateRandomToken";
import EmailSender from "../services/mail";
import JwtHelper from "../helpers/JwtHelper";

/**
 * @class UserController
 */
class AuthController {
  /**
   * @method createPassCode
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */

  static verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      log(req.body);
      const { email, verificationCode } = req.body;

      if (!email || !verificationCode) {
        throw new Error("Missing fields: Email and OTP required");
      }

      try {
        await verifyEmail(email, verificationCode);
      } catch (error: any) {
        console.error("Error verifying email:", error);
        throw new Error(error.message);
      }

      console.log("Email verified errorfully.");

      return res
        .status(200)
        .json({ error: false, message: "User verification successful😁" });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  };

  /**
   * @method login
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      log(req.body);
      const { email, password } = req.body;

      if (!email || !password) {
        throw Error("All fields must be filled");
      }

      const user = await checkThatUserExistWithEmail(email);

      if (!user) {
        return res
          .status(404)
          .json({ error: true, message: "User does not exist😒" });
      }

      const passwordMatched = await checkThatPasswordIsValid(email, password);

      if (!passwordMatched) {
        return res
          .status(401)
          .json({ error: true, message: "Incorrect Password 😢" });
      }

      log(user);
      const expiresIn = "30m";
      const payload = {
        userId: user._id,
      };

      const token = JwtHelper.generateToken(payload, expiresIn);

      res.status(200).json({
        error: false,
        data: user,
        token: token,
        message: "login successful",
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  /**
   * @method setTransactionPin
   * @static
   * @async
   * @param {IUserRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */

  static setTransactionPin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { newPin } = req.body;
      const email = (req as IUserRequest).user.email;
      log(`Email from auth req: ${email}`);

      if (!newPin) {
        res.status(400).json({
          error: true,
          message: "Missing fields: Email and newPin required",
        });
      }

      try {
        await setTransactionPin(email, newPin);
      } catch (error: any) {
        console.error("Error setting transaction pin:", error);
        throw new Error(error.message);
      }

      console.log("Transaction Pin set successfully.");

      res.status(200).json({
        error: false,
        message: "User transaction pin set successfully😁",
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  };

  /**
   * @method verifyTransactionPin
   * @static
   * @async
   * @param {IUserRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */

  static verifyTransactionPin = async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { newPin } = req.body;
    const email = (req as IUserRequest).user.email;
    try {
      const user = await checkThatUserExistWithEmail(email);

      if (!user) throw new Error("user does not exist😒");

      const userId = user._id as string;

      await verifyTransactionPin(userId, newPin);

      res.status(200).json({
        error: false,
        message: "Transaction pin verified successfully",
      });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: true, message: error.message });
    }
  };

  /**
   * @method checkIfEmailExistAndSendToken
   * @static
   * @async
   * @param {IUserRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */

  static async checkIfEmailExistAndSendToken(
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      // generate reset token
      const token = await generateRandomToken();

      const email = req.body.email;

      // check if user exist
      const userExist = await checkThatUserExistWithEmail(email);

      if (!userExist) {
        throw new Error(`User with email: ${email} does not exist`);
      }

      // updating the user with otp
      const updateData = {
        verificationOTP: token,
        otpCreationTime: Date.now(),
      };
      await updateUserById(userExist._id, updateData);

      // sending email verification otp
      const emailSender = new EmailSender(
        process.env.SENDER_EMAIL,
        process.env.SENDER_PASSWORD
      );
      await emailSender.send(
        email,
        "Your OTP Code",
        `Your OTP code is: ${token}`
      );
      return res
        .status(200)
        .json({ error: false, message: `token sent successfully to ${email}` });
    } catch (error: any) {
      log({ error: true, message: error.message });
      res.status(500).json({ error: true, message: error.message });
    }
  }

  /**
   * @method checkIfEmailExistAndSendToken
   * @static
   * @async
   * @param {IUserRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */

  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log(req.body.companyEmail, req.body.resetOtp);
      const { email, verificationCode } = req.body;

      const verifyCode = await verifyOTP(email, verificationCode);
      log("verifyCode:", verifyCode);

      if (verifyCode === true) {
        return res.status(200).json({
          error: false,
          data: email,
          message: "OTP verification successful😁",
        });
      }

      return res.status(200).json({
        error: true,
        message: "OTP verification unsuccessful 😢",
      });
    } catch (error: any) {
      console.error(error.message);
      res.status(400).json({ error: true, message: error.message });
    }
  }

  /**
   * @method checkIfEmailExistAndSendToken
   * @static
   * @async
   * @param {IUserRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */

  static async setPassword(req: IUserRequest, res: Response) {
    try {
      const { email, password } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const updateData = { password: hash };
      // updating user by email
      await updateUserByEmail(email, updateData);

      res.status(200).json({ error: false });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: true, message: error.message });
    }
  }

  /**
   * @method resendOtp
   * @static
   * @async
   * @param {IUserRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {boolean}
   */

  static async resendOtp(req: IUserRequest, res: Response) {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await checkThatUserExistWithEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      // Generate and save a new OTP
      await generateAndSaveOTP(email);

      res
        .status(200)
        .json({ error: false, message: `email successful sent to ${email}` });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: true, message: error.message });
    }
  }
}

export default AuthController;
