import { Request, Response } from 'express';
import { Users } from '../models/userModel';
import { Wallets } from '../models/wallet.model';
import { Transactions } from '../models/transactionModel';
import { endOfDay, startOfDay } from 'date-fns';

class adminController {
   static async getTotalUsers(req: Request, res: Response) {
      try {
        const totalUsers = await Users.countDocuments();
        res.status(200).json({ totalUsers });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  
    static async getTotalWalletBalance(req: Request, res: Response) {
      try {
        const totalBalance = await Wallets.aggregate([
          { $group: { _id: null, totalBalance: { $sum: "$balance" } } }
        ]);
        res.status(200).json({ totalBalance: totalBalance[0].totalBalance });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  
    static async getTotalTransactions(req: Request, res: Response) {
      try {
        const totalTransactions = await Transactions.countDocuments();
        res.status(200).json({ totalTransactions });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  
    static async getTotalTodayTransactions(req: Request, res: Response) {
      try {
        const today = new Date();
        const totalTodayTransactions = await Transactions.countDocuments({
          date: { $gte: startOfDay(today), $lte: endOfDay(today) }
        });
        res.status(200).json({ totalTodayTransactions });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  
    static async getTotalAgents(req: Request, res: Response) {
      try {
        const totalAgents = await Users.countDocuments({ role: 'agent' });
        res.status(200).json({ totalAgents });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  
    static async getTotalSalesForTheDay(req: Request, res: Response) {
      try {
        const today = new Date();
        const totalSales = await Transactions.aggregate([
          { $match: { date: { $gte: startOfDay(today), $lte: endOfDay(today) } } },
          { $group: { _id: null, totalSales: { $sum: "$amount" } } }
        ]);
        res.status(200).json({ totalSales: totalSales[0].totalSales });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  
    static async getTotalCommissionForTheDay(req: Request, res: Response) {
      try {
        const today = new Date();
        const totalCommission = await Transactions.aggregate([
          { $match: { date: { $gte: startOfDay(today), $lte: endOfDay(today) } } },
          { $group: { _id: null, totalCommission: { $sum: "$commission" } } }
        ]);
        res.status(200).json({ totalCommission: totalCommission[0].totalCommission });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
}

export default adminController