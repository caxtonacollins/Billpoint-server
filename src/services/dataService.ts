import axios from "axios";
import { Request, Response } from "express";
import { generateRequestId } from "../helpers/generateRequestId";
import walletService from "./walletService";
import transactionService from "./transactionService";
import { log } from "console";
import { queryTransactionStatus } from "../helpers/vtpassHelpers";

/**
 * How to use your api keys:
   For GET request you’ll need to pass the api-key and public-key through the request header.
   api-key: xxxxxxxxxxxxxxxxxxxx
   public-key: PK_xxxxxxxxxxxxxxxxx
   For POST request you’ll need to pass the api-key and secret-key through the request header.
   api-key: xxxxxxxxxxxxxxxxxxxx 
   secret-key: SK_xxxxxxxxxxxxxxxxx
 */

const apiUrl = "https://sandbox.vtpass.com/api"; // Use 'https://api-service.vtpass.com/api' for live
const secretKey = process.env.VTPASS_SECRET_KEY;

const apiKey = process.env.VTPASS_API_KEY;
const publicKey = process.env.VTPASS_PULIC_KEY;


class dataService {
  static async getServiceId(req: Request, res: Response) {
    try {
      const { identifier } = req.query;

      const basicAuth = Buffer.from(`${apiKey}:${publicKey}`).toString(
        "base64"
      );

      // const identifier = 'tv-subscription';

      if (!identifier) {
        throw new Error("Identifier is required 🥲");
      }

      const url = `${process.env.VTPASS_SERVICE_ID}/services?identifier=${identifier}`;

      const response = await axios.get(url, {
        headers: { authorization: `Basic ${basicAuth}` },
      });
      const options = response.data.content;

      res.status(200).json({ error: false, data: options });
    } catch (error: any) {
      console.error("Error fetching VTpass serviceID", error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  static async getVariationCodes(req: Request, res: Response) {
    try {
      const { serviceID } = req.query;

      const url = `${process.env.VTPASS_GET_VARIATION_CODES}?serviceID=${serviceID}`;

      log("url:", url);

      const basicAuth = Buffer.from(`${apiKey}:${publicKey}`).toString(
        "base64"
      );

      const response = await axios.get(url, {
        headers: { authorization: `Basic ${basicAuth}` },
      });
      const options = response.data;

      res.status(200).json({ error: false, data: options });
    } catch (error: any) {
      console.error("Error fetching VTpass variation codes:", error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  static async verifyCustomer(billersCode: any, type: any, serviceID: any) {
    try {
      if (type === "prepaid" || type === "postpaid") {
        const payload = {
          billersCode,
          serviceID,
          type,
        };

        const configurations = {
          method: "post",
          url: `${apiUrl}/merchant-verify`,
          headers: {
            "api-key": apiKey,
            "secret-key": secretKey,
            "Content-Type": "application/json",
          },
          data: payload,
        };

        const response = await axios(configurations);
        return { verifyInfo: response.data };
      } else {
        const payload = {
          billersCode,
          serviceID,
        };
        const configurations = {
          method: "post",
          url: `${apiUrl}/merchant-verify`,
          headers: {
            "api-key": apiKey,
            "secret-key": secretKey,
            "Content-Type": "application/json",
          },
          data: payload,
        };

        const response = await axios(configurations);
        return { verifyInfo: response.data };
      }
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  static async getWalletBalance() {
    try {
      const apiKey = process.env.API_KEY;
      const publicKey = process.env.PULIC_KEY;
      const url = process.env.WALLET_BALANCE;

      if (!url) throw new Error("Invalid Url 😒");

      const basicAuth = Buffer.from(`${apiKey}:${publicKey}`).toString(
        "base64"
      );

      const response = await axios.get(url, {
        headers: {
          authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
        },
      });
      const walletBalance = response.data;

      return walletBalance;
    } catch (err: any) {
      console.error("Error fetching VTpass wallet balance:", err);
      throw { error: true, message: err.message };
    }
  }

  static async buyData(req: Request, res: Response) {
    try {
      const { user, serviceID, variationCode, phone } = req.body;

      const request_id = await generateRequestId();

      const billersCode = "08011111111";

      const payload = {
        request_id,
        serviceID,
        variation_code: variationCode,
        phone,
        billersCode,
      };

      const configurations = {
        method: "post",
        url: process.env.VTPASS_PURCHASE_DATA,
        headers: {
          "api-key": apiKey,
          "secret-key": secretKey,
          "Content-Type": "application/json",
        },
        data: payload,
      };

      const purchaseResponse = await axios(configurations);

      if (purchaseResponse.status === 200) {
        const buyDataResponse = purchaseResponse.data;

        // Extraact transaction ID from the response
        const requestId = buyDataResponse.requestId;

        log("requestId:", requestId);

        // Query transaction status using the transaction ID
        const queryResponse = await queryTransactionStatus(requestId);

        // checking if the query was successful
        if (queryResponse.status === 200) {
          const queryResult = queryResponse.data;

          // Extract relevant information from the query result
          const transactionStatus = queryResult.content.transactions.status;
          const amount = queryResult.content.transactions.amount;
          const date = queryResult.transaction_date.date;
          const transactionType = queryResult.content.transactions.type;
          const details = queryResult.content.transactions.product_name;
          const reference = queryResult.content.transactions.transactionId;
          const status = queryResult.content.transactions.status;

          const transactionData = {
            user,
            transactionType,
            details,
            amount,
            transactionId: reference,
            status,
            date,
          };

          // If transaction is successful, deduct the amount from the user's wallet balance
          if (
            transactionStatus === "delivered" ||
            transactionStatus === "successful"
          ) {
            await walletService.subtractMoneyFromWalet(user, amount);

            await transactionService.createTransaction(transactionData);

            // Respond with success
            res
              .status(200)
              .json({ error: false, data: buyDataResponse, queryResult });

            // return { buyData: buyDataResponse, queryResult };
          } else if (transactionStatus === "pending") {
            await transactionService.createTransaction(transactionData);
          } else {
            await transactionService.createTransaction(transactionData);
            // Respond with error for unsuccessful transaction
            // console.error(
            //   "Transaction failed:",
            //   queryResult.response_description
            // );

            res
              .status(200)
              .json({ error: false, data: queryResult.response_description });

            // return {
            //   error: false,
            //   message: "Transaction failed",
            //   data: queryResult.response_description,
            // };
          }
        } else {
          // Respond with error for failed query
          // console.error("Failed to query transaction status:", queryResponse);
          res.status(500).json({
            error: true,
            message: "failed to requery transaction status",
          });

          // throw new Error("failed to requery transaction status");
        }
      } else {
        // Respond with error for failed purchase
        console.error("Failed to purchase data:", purchaseResponse);
        res
          .status(500)
          .json({ error: true, message: "Failed to process the request" });

        // return { error: "Failed to process the request" };
      }
    } catch (error: any) {
      console.error("Error:", error);
      res.status(500).json({ error: true, message: error.message });
      // throw new Error("failed to requery transaction status");
    }
  }
}

export default dataService;
