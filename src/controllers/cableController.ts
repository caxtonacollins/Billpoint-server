import { Request, Response } from "express";
import { getServiceId, getVariationCodes } from "../helpers/vtpassHelpers";
import cableService from "../services/cableService";

class cableController {
  static async getServiceId(req: Request, res: Response) {
    try {
      const { identifier } = req.query; // cable if any
      if (!identifier) {
        return res
          .status(400)
          .json({ error: true, message: "Identifier is required 🥲" });
      }
      const options = await getServiceId(identifier.toString());
      res.status(200).json({ error: false, cable: options });
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

      res.status(200).json({ error: false, cable: options });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  static async cablePurchase(req: Request, res: Response) {
    try {
      const {
        user,
        billersCode,
        variationCode,
        phone,
        subscriptionType,
        amount,
        quantity,
      } = req.body;

      const serviceID = req.body.selectedServiceId;

      const purchaseRes = await cableService.cablePurchase(
        user,
        billersCode,
        variationCode,
        phone,
        subscriptionType,
        amount,
        quantity,
        serviceID
      );

      res.status(200).json({ error: false, message: purchaseRes });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }
}

export default cableController;
