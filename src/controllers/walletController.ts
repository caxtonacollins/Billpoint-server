import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { Wallets } from "../models/wallet.model";
import { log } from "console";
import {
  createReserveAccount,
  getReservedAccountDetails,
} from "../services/monnifyService";
import { Users } from "../models/userModel";

/**
 * @class WalletController
 */

class WalletController {
  /**
   * @method getWalletById
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise}
   */

  static async getWalletById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const wallet = await Wallets.findOne({ _id: new ObjectId(id) });

      if (!wallet) throw new Error("wallet not found 🥲");

      res.status(200).json({ error: false, data: wallet });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  /**
   * @method getWalletByUserId
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise}
   */

  static async getWalletByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;

      // getting the wallet information
      let wallet = await Wallets.findOne({ user: userId });

      if (!wallet) {
        throw new Error("wallet not found 🥲");
      }

      // If the wallet already has account numbers, return the wallet
      if (wallet.monnifyAccountNum.length > 0) {
        res.status(200).json({ error: false, data: wallet });
        return;
      }

      // Try to get reserved account details for the user
      let userMonnifyAccountNum = await getReservedAccountDetails(userId);

      if (!userMonnifyAccountNum) {
        const user = await Users.findOne({ _id: userId });

        if (!user) {
          res.status(400).json({ error: true, message: "User not found 😢" });
          return;
        }

        // Create a reserved account for the user
        await createReserveAccount(user);

        // Retrieve the reserved account details again
        userMonnifyAccountNum = await getReservedAccountDetails(userId);
      }

      const accounts = userMonnifyAccountNum?.accounts || [];

      // Check if there are accounts to push
      if (accounts.length > 0) {
        wallet.monnifyAccountNum.push(...accounts);
      }

      await wallet.save();

      res.status(200).json({ error: false, data: wallet });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }
}

export default WalletController;
