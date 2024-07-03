// import { ICreateTransaction } from "../interfaces/ICreateTransaction";
// import PaystackService from "./external/paystack";
import { BankDetails } from "../models/bankDetailsModel";
import { Transactions } from "../models/transactionModel";
import { Wallets } from "../models/wallet.model";
import PaystackService from "./paystack";
import WalletService, { updateWallet } from "./walletService";

/**
 * @class TransactionService
 */
class TransactionService {
  /**
   * @method createTransaction
   * @static
   * @async
   * @param {object} data
   * @returns {Promise<UserTransactionDetails>}
   */
  static async createTransaction(data: object) {
    await Transactions.create(data);
  }

  /**
   * @method sendMoney
   * @static
   * @async
   * @param {object} data
   * @returns {Promise<UserTransactionDetails>}
   */
  static async sendMoney(
    senderId: string,
    walletNumber: number,
    amount: number
  ) {
    const senderWallet = await Wallets.findOne({ user: senderId });
    const receiverWallet = await Wallets.findOne({
      billPointAccountNum: walletNumber,
    });
    if (senderWallet && receiverWallet) {
      if (senderWallet.balance < amount) {
        throw new Error("insufficient balance");
      }
      // update sender wallet balance
      await updateWallet(senderId, amount, "EXPENSE");

      //update receiver wallet balance
      await updateWallet(receiverWallet.user, amount, "INCOME");

      return true;
    }
  }

  /**
   * @method initiateTrasaction
   * @static
   * @async
   * @param {object} data
   * @returns {Promise<UserTransactionDetails>}
   */
  static async initiateTransaction(bankName: string, accountNumber: string) {
    const response = await PaystackService.createRecipient(
      bankName,
      accountNumber
    );

    return response.data;
  }

  /**
   * @method withdrawWalletBalance
   * @static
   * @async
   * @param {object} data
   * @returns {Promise<UserTransactionDetails>}
   */
  static async withdrawWalletBalance(
    userId: string,
    amount: number,
    reason: string,
    recipient: string
  ) {
    const userWallet = await Wallets.findOne({ user: userId });
    const userBank = await BankDetails.findOne({ user: userId });
    if (!userWallet) {
      throw new Error("User wallet not found");
    }

    if (!userBank) {
      throw new Error("add bank account");
    }

    if (userWallet.balance < amount) {
      throw new Error("insufficient balance");
    }

    const withdrawal = await PaystackService.makePayment(
      amount,
      reason,
      recipient
    );
    if (withdrawal) {
      // update sender wallet balance
      await updateWallet(userId, amount, "EXPENSE");

      return withdrawal;
    }
  }

  /**
   * @method sendMoneyToBank
   * @static
   * @async
   * @param {object} data
   * @returns {Promise<UserTransactionDetails>}
   */
  static async sendMoneyToBank(
    userId: string,
    amount: number,
    reason: string,
    recipient: string
  ) {
    const userWallet = await Wallets.findOne({ user: userId });

    if (!userWallet) throw new Error("user wallet not found");
    if (userWallet.balance < amount) {
      throw new Error("insufficient balance");
    }

    const sentMoney = await PaystackService.makePayment(
      amount,
      reason,
      recipient
    );

    if (sentMoney) {
      // update sender wallet balance
      await updateWallet(userId, amount, "EXPENSE");

      return sentMoney;
    }
  }
}

export default TransactionService;
