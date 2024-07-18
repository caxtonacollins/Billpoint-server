import { BankDetails } from "../models/bankDetailsModel";
import { Request, Response } from "express";

class bankDetailsController {
  static createOrUpdateBankDetails = async (req: any, res: Response) => {
    const { bankName, accountNumber } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: true, message: "Unauthorized" });
    }

    const user = req.user._id;

    // Check if user have bank details
    const isBankDetails = await BankDetails.findOne({ user: user });
    if (!isBankDetails) {
      await BankDetails.create({
        user,
        bankName,
        accountNumber,
      });
      return res
        .status(200)
        .json({ error: false, message: "Bank details created successfully" });
    }

    // Update existing bank details
    isBankDetails.bankName = bankName;
    isBankDetails.accountNumber = accountNumber;
    await isBankDetails.save();

    return res
      .status(200)
      .json({ error: false, message: "Bank details updated successfully" });
  };

  static getBankDetails = async (req: any, res: Response) => {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: true, message: "Unauthorized" });
    }

    const user = req.user._id;

    const bankDetails = await BankDetails.findOne({ user: user });

    return res.status(200).json({ error: false, data: bankDetails });
  };
}

export default bankDetailsController;
