import JwtHelper from "../../helpers/JwtHelper";
import { NextFunction, Request, Response } from "express";
import { IUserRequest } from "../../interfaces";
import { log } from "console";
import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { Users } from "../../models/userModel";

/**
 * @function Authenticate
 * @description Middleware to perform authentication in API routes
 * @param {IUserRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ error: true, message: "Access denied, no token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: true, message: "Access denied, no token provided" });
    }

    try {
      const decoded = JwtHelper.verifyToken(token) as JwtPayload;
      log("decoded", decoded);

      // Get user data
      const userId = decoded.userId;
      const user = await Users.findOne({ _id: new ObjectId(userId) });

      // log("user", user);

      if (!user) {
        throw new Error("User not found");
      }

      (req as IUserRequest).user = user; // Attach the decoded user information to the request object
      next();
    } catch (error) {
      return res.status(400).json({ error: true, message: "Invalid token or expired authentication token" });
    }
  } catch (err) {
    next(err);
  }
};
