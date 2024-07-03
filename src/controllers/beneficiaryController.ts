import { Request, Response } from 'express';
import { Beneficiary } from '../models/beneficiariesModel';

export const addBeneficiary = async (req: Request, res: Response) => {
  try {
    const { type, name, accountNumber, bankName, phoneNumber, network, meterNumber, customerName, billingType } = req.body;

    const newBeneficiary = new Beneficiary({
      type,
      name,
      accountNumber,
      bankName,
      phoneNumber,
      network,
      meterNumber,
      customerName,
      billingType
    });

    await newBeneficiary.save();
    res.status(201).json(newBeneficiary);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getBeneficiaries = async (req: Request, res: Response) => {
  try {
    const beneficiaries = await Beneficiary.find();
    res.status(200).json(beneficiaries);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
