import { Request, Response } from "express";
import dataService from "../services/dataService";
import { getServiceId, getVariationCodes } from "../helpers/vtpassHelpers";

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
      const { user, serviceID, variationCode, phone } = req.body;
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
