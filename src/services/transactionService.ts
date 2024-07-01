// import { ICreateTransaction } from "../interfaces/ICreateTransaction";
// import PaystackService from "./external/paystack";
import { BankDetails } from "../models/bankDetailsModel";
import { Transactions } from "../models/transactionModel";
import { Wallets } from "../models/wallet.model";
import PaystackService from "./paystack";
import WalletService from "./walletService";

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
  static async createTransaction(user: string, data: any) {
    const transactionData = {
      title: data.title,
      description: data.description,
      amount: data.amount,
      user,
    };
    await Transactions.create(transactionData);
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
      await WalletService.updateWallet(senderId, amount, "EXPENSE");

      //update receiver wallet balance
      await WalletService.updateWallet(receiverWallet.user, amount, "INCOME");

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
      await WalletService.updateWallet(userId, amount, "EXPENSE");

      // create trasaction record
      const transactionData = {
        title: "withdrawal to wallet",
        description: reason,
        amount,
      };

      await this.createTransaction(userId, transactionData);

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
      await WalletService.updateWallet(userId, amount, "EXPENSE");

      // create transaction record
      const transactionData = {
        title: "Money Transfer",
        description: reason,
        amount,
      };

      await this.createTransaction(userId, transactionData);

      return sentMoney;
    }
  }
}

export default TransactionService;
