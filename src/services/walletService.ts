import { Wallets } from "../models/wallet.model";


/**
 * @class WalletService
 */
class WalletService {
  /**
   * @method addMoneyToWallet
   * @static
   * @async
   * @param {number} amount
   * @returns {Promise<void>}
   */
  static async addMoneyToWalet(userId: string, amount: number) {
    await this.updateWallet(userId, amount, "INCOME");

    //update usertransaction details
    const transactionData = {
      title: "add money",
      description: "added money to wallet",
      amount: amount,
    };
   //  await TransactionService.createTransaction(userId, transactionData);
    return "success";
  }

    /**
   * @method subtractMoneyFromWalet
   * @static
   * @async
   * @param {number} amount
   * @returns {Promise<void>}
   */
    static async subtractMoneyFromWalet(user: string, amount: number) {
      await this.updateWallet(user, amount, "EXPENSE");
  
      //update usertransaction details
      const transactionData = {
        title: "subtract money",
        description: "subtract money from wallet",
        amount: amount,
      };
     //  await TransactionService.createTransaction(userId, transactionData);
      return "success";
    }

  /**
   * @method updateWallet
   * @static
   * @async
   * @param {number} amount
   * @returns {Promise<void>}
   */
  static async updateWallet(userId: string, amount: number, type: string) {
    const userWallet = await Wallets.findOne({ user: userId})

    if (!userWallet) throw new Error('Wallet not found')

    let newBalance;
    // add amount to walletbalance if type income
    if (type === "INCOME") {
      newBalance = userWallet.balance + amount;
    }

    // reduct payment from wallet balance if type payment
    if (type === "EXPENSE") {
      if (amount > userWallet.balance) {
        throw new Error(
          "payment can't be greater than current wallet balance"
        );
      }
      newBalance = userWallet.balance - amount;
    }
    //update wallet balance
    await Wallets.updateOne({ userId: userId }, {$set: { balance: newBalance,}})
  }
}

export default WalletService;
