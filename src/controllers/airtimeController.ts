import { Request, Response } from "express";
import { getServiceId, getVariationCodes } from "../helpers/vtpassHelpers";
import airtimeService from "../services/airtimeService";

class airtimeController {
  static async getServiceId(req: Request, res: Response) {
    try {
      const { identifier } = req.query; // airtime
      if (!identifier) {
        return res
          .status(400)
          .json({ error: true, message: "Identifier is required 🥲" });
      }
      const options = await getServiceId(identifier.toString());
      res.status(200).json({ error: false, data: options });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  static async getVariationCodes(req: Request, res: Response) {
    try {
      const { serviceID } = req.query;
      if (!serviceID) throw new Error("Service ID not provided 😒");
      const options = await getVariationCodes(serviceID.toString());

      res.status(200).json({ error: false, data: options });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  static async purchaseAirtime(req: Request, res: Response) {
    try {
      const { user, serviceID, amount, phone } = req.body;

      const purchaseRes = await airtimeService.purchaseAirtime(
         user, serviceID, parseFloat(amount), parseFloat(phone)
      );

      res.status(200).json({ error: false, message: purchaseRes });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }
}

export default airtimeController;