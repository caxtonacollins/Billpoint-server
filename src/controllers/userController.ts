import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import {
  checkThatUserExistWithEmail,
  checkThatUserExistWithPhoneNumber,
  getAllUsers,
  getUserById,
  isValidEmail,
  updateUserById,
} from "../services/userService";
import { Users } from "../models/userModel";
import { MongoClient, ObjectId } from "mongodb";
import {
  generateAndSaveOTP,
  generateRandomToken,
} from "../helpers/GenerateRandomToken";
import EmailSender from "../services/mail";
import { log } from "console";
import JwtHelper from "../helpers/JwtHelper";

/**
 * @class UserController
 */
class UserController {
  /**
   * @method createUser
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise}
   */
  static async createUser(req: Request, res: Response) {
    try {
      log(req.body);
      const { firstName, lastName, email, number, password, confirmPassword } =
        req.body;

      if (
        !firstName ||
        !lastName ||
        !email ||
        !number ||
        !password ||
        !confirmPassword
      ) {
        return res
          .status(400)
          .json({ message: "Name, email, and password are required" });
      }

      if (!isValidEmail(email)) {
        throw new Error("Invalid company email address");
      }

      const emailExist = await checkThatUserExistWithEmail(email);
      const numberExist = await checkThatUserExistWithPhoneNumber(number);

      if (emailExist) {
        console.log(`User ${email} already exists`);
        throw new Error(`User ${email} already exists`);
      }

      if (numberExist) {
        console.log(`User ${number} already exists`);
        throw new Error(`User ${number} already exists`);
      }

      // checking if password is equal to confirm password
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ error: true, message: "passwords mismatch🥱" });
      }

      // hashing of password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the user object to be inserted
      const userData = {
        firstName,
        lastName,
        email,
        number,
        password: hashedPassword,
        verified: false,
      };
      const newUser = await Users.create(userData);

      const expiresIn = "30m";
      const payload = {
        userId: newUser._id,
      };
      const token = JwtHelper.generateToken(payload, expiresIn);

      log({ payload, token });
      res.status(201).json({
        error: false,
        message: "User created successfully",
        data: newUser,
        token,
      });

      // sending email verification otp
      try {
        await generateAndSaveOTP(email);
      } catch (error: any) {
        console.error(error);
        throw new Error("Error sending otp: " + error.message);
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  /**
   * @method getAllUsers
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise}
   */

  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await getAllUsers();

      res.status(200).json({ error: false, data: users });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  /**
   * @method getUserById
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise}
   */

  static async getUserById(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const users = await getUserById(id);
      if (!users) throw new Error("User not found 🥲");

      res.status(200).json({ error: false, data: users });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  /**
   * @method getUserById
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {object}
   */

  static async updateUser(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateData = req.body;

      if (updateData.password) {
        return res.status(400).json({
          error: true,
          message: "Authentication required to update or set password",
        });
      }

      const users = await updateUserById(id, updateData);

      return res.status(200).json({ error: false, data: users });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  /**
   * @method getUserById
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise}
   */

  static async deleteUser(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const deletedUser = await Users.deleteOne({
        _id: new ObjectId(id),
      });

      log("deletedUser:", deletedUser);
      res
        .status(200)
        .json({ error: false, message: "staff deleted succesfully" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }
}

export default UserController;
