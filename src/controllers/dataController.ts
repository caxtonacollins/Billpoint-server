import { Request, Response } from "express";
import dataService from "../services/dataService";
import { getServiceId, getVariationCodes } from "../helpers/vtpassHelpers";
import PricingService from "../services/pricingService";
import { verifyTransactionPin } from "../services/authService";
import { Users } from "../models/userModel";

class dataController {
  static async getServiceId(req: Request, res: Response) {
    try {
      const { identifier } = req.query; // data
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

  static async purchaseData(req: Request, res: Response) {
    try {
      const { user, serviceID, variationCode, phone, transactionPin } =
        req.body;

      const userData = await Users.findById(user);

      if (!userData)
        return res
          .status(404)
          .json({ error: true, message: "User not found 😒." });

      if (userData.status === "suspended")
        return res
          .status(403)
          .json({ error: true, message: "User is suspended 😢" });

      if (userData.status === "inactive")
        return res
          .status(403)
          .json({ error: true, message: "User is inactive 😢" });

      const isPinVerified = await verifyTransactionPin(user, transactionPin);

      if (isPinVerified !== true) {
        return res
          .status(403)
          .json({ error: true, message: "Invalid transaction pin 😢" });
      }

      const purchaseRes = await dataService.purchaseData(
        user,
        serviceID,
        variationCode,
        phone
      );

      res.status(200).json({ error: false, message: purchaseRes });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }
}

export default dataController;

// static async getServiceId(req: Request, res: Response) {
//    try {
//
//    res.status(200).json({ error: true });
//
//    } catch (error: any) {
//       console.log(error);
//       res.status(500).json({ error: true, message: error.message });
//    }
//   }
// }

// static async main() {
//    try {
//
//       return
//    } catch (error: any) {
//       console.log(error);
//       throw new Error(error.message);
//    }
//   }
// }
