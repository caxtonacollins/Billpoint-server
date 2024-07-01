import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { Wallets } from "../models/wallet.model";

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
      const wallet = Wallets.findOne(
        { _id: new ObjectId(id) }
      );

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
      const wallet = Wallets.findOne(
        {user: userId }
      );

      if (!wallet) throw new Error("wallet not found 🥲");

      res.status(200).json({ error: false, data: wallet });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }
}

export default WalletController;
