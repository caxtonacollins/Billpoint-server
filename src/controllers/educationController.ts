import { Request, Response } from "express";
import dataService from "../services/dataService";
import { getVariationCodes } from "../helpers/vtpassHelpers";
import educationService from "../services/educationalService";

class eduController {
  static async getVariationCodes(req: Request, res: Response) {
    try {
      const { serviceID } = req.query;
      if (!serviceID) throw new Error("Service ID not provided 😒");
      const options = await getVariationCodes(serviceID.toString());

      res.status(200).json({ error: false, edu: options });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  static async purchaseEdu(req: Request, res: Response) {
    try {
      const { user, variationCode, phone, amount, quantity } = req.body;

      const purchaseRes = await educationService.educationPurchase(
        user,
        variationCode,
        phone,
        amount,
        quantity
      );

      res.status(200).json({ error: false, message: purchaseRes });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }
}

export default eduController;
