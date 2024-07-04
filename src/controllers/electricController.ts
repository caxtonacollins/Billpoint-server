import { Request, Response } from "express";
import dataService from "../services/dataService";
import { getServiceId, getVariationCodes } from "../helpers/vtpassHelpers";
import electricService from "../services/electricService";

class electricController {
  static async getServiceId(req: Request, res: Response) {
    try {
      const { identifier } = req.query; // electricity
      if (!identifier) {
        return res
          .status(400)
          .json({ error: true, message: "Identifier is required 🥲" });
      }
      const options = await getServiceId(identifier.toString());
      res.status(200).json({ error: false, electric: options });
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

      res.status(200).json({ error: false, electric: options });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  static async purchaseElectricity(req: Request, res: Response) {
    try {
      const { user, billersCode, variationCode, amount, phone } = req.body;

      const serviceID = req.body.selectedServiceId;

      const purchaseRes = await electricService.electricProduct(
        user,
        billersCode,
        variationCode,
        amount,
        phone,
        serviceID
      );

      res.status(200).json({ error: false, message: purchaseRes });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }
}

export default electricController;
