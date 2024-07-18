import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { Transactions } from "../models/transactionModel";
import TransactionService from "../services/transactionService";
import PaystackService from "../services/paystack";
import { log } from "console";

/**
 * @class TransactionController
 */

class TransactionController {
  /**
   * @method verifyAccountData
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async verifyAccountData(req: any, res: Response, next: NextFunction) {
    const { bankName, accountNumber } = req.body;
    try {
      const response = await PaystackService.getBankCode(
        bankName,
        accountNumber
      );

      if (!response) {
        throw new Error("something went wrong");
      }

      res.status(200).json({
        error: false,
        data: response.account_name,
        message: "verification success",
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @method initateTransaction
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async initateTransaction(req: any, res: Response, next: NextFunction) {
    const { bankName, accountNumber } = req.body;
    try {
      const response = await TransactionService.initiateTransaction(
        bankName,
        accountNumber
      );
      if (!response) {
        throw new Error("something went wrong");
      }

      res
        .status(200)
        .json({ error: false, data: response, message: "success" });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @method sendMoneyToUser
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async sendMoneyToUser(req: any, res: Response, next: NextFunction) {
    const userId = req.user.id;
    const { walletNumber, amount } = req.body;
    try {
      const sendMoney = await TransactionService.sendMoney(
        userId,
        walletNumber,
        amount
      );
      if (sendMoney) {
        res
          .status(200)
          .json({ error: false, message: "money sent successfully" });
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * @method withdrawFromWallet
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async withDrawFromWallet(req: any, res: Response, next: NextFunction) {
    const userId = req.user.id;
    const { amount, recipient } = req.body;

    const reason = "withrawal from wallet";

    try {
      const withdrawal = await TransactionService.withdrawWalletBalance(
        userId,
        amount,
        reason,
        recipient
      );

      if (withdrawal) {
        res
          .status(200)
          .json({ error: false, message: "require third party API" });
      }

    } catch (err: any) {
      log(err)
      res
          .status(200)
          .json({ error: false, message: err.message });
    }

  }

  /**
   * @method sendMoneyToUserBank
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {object}
   */
  static async sendMoneyToUserBank(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    const userId = req.user.id;
    const { amount, recipient, reason } = req.body;
    try {
      const sendMoney = await TransactionService.sendMoneyToBank(
        userId,
        amount,
        reason,
        recipient
      );

      if (sendMoney) {
        res
          .status(200)
          .json({ error: false, message: "money sent successfully" });
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * @method getTransactionById
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise}
   */

  static async getTransactionById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const transaction = await Transactions.findOne({
        _id: new ObjectId(id),
      });

      if (!transaction) throw new Error("transaction not found 🥲");

      res.status(200).json({ error: false, data: transaction });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  /**
   * @method getTransactionByUserId
   * @static
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise}
   */

  static async getTransactionByUserId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const transaction = await Transactions.find({ user: userId });

      if (!transaction) throw new Error("transaction not found 🥲");

      res.status(200).json({ error: false, data: transaction });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }
}

export default TransactionController;
