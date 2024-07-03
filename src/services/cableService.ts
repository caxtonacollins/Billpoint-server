import { Request, Response } from "express";
import { generateRequestId } from "../helpers/generateRequestId";
import axios from "axios";
import { queryTransactionStatus } from "../helpers/vtpassHelpers";
import walletService from "./walletService";
import transactionService from "./transactionService";

const apiUrl = "https://sandbox.vtpass.com/api"; // Use 'https://api-service.vtpass.com/api' for live
const secretKey = process.env.VTPASS_SECRET_KEY;

const apiKey = process.env.VTPASS_API_KEY;
const publicKey = process.env.VTPASS_PULIC_KEY;

async function purchaseProduct(
  requestId: any,
  billersCode: string,
  variationCode: string,
  serviceID: string,
  phone: string,
  subscriptionType: string,
  amount: number,
  quantity: number,
) {
  const payload = {
    request_id: requestId,
    billersCode,
    variationCode,
    serviceID,
    phone,
    subscription_type: subscriptionType,
    amount,
    quantity
  };

  const configurations = {
    method: "post",
    url: `${apiUrl}/pay`,
    headers: {
      "api-key": apiKey,
      "secret-key": secretKey,
      "Content-Type": "application/json",
    },
    data: payload,
  };

  return axios(configurations);
}

class cableService {
  static async cablePurchase(req: Request, res: Response) {
    try {
      const requestId = await generateRequestId();

      const { user, billersCode, variationCode, phone, subscriptionType, amount, quantity } =
        req.body;

      const serviceID = req.body.selectedServiceId;

      const purchaseResponse = await purchaseProduct(
        requestId,
        billersCode,
        variationCode,
        serviceID,
        phone,
        subscriptionType,
        amount,
        quantity
      );

      if (purchaseResponse.status === 200) {
        const cableResponse = purchaseResponse.data;
        // console.log(cableResponse);

        const ID = cableResponse.requestId;

        const queryResponse = await queryTransactionStatus(ID);
        // console.log(queryResponse);

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

          console.log("====================================");
          console.log("transactionData:", transactionData);
          console.log("====================================");

          // If transaction is successful, deduct the amount from the user's wallet balance
          if (
            transactionStatus === "delivered" ||
            transactionStatus === "successful"
          ) {
            await walletService.subtractMoneyFromWalet(user, amount);

            await transactionService.createTransaction(transactionData);

            // Respond with success
            res.status(200).json({ buyCable: cableResponse, queryResult });
          } else if (transactionStatus === "pending") {
            await transactionService.createTransaction(transactionData);
          } else {
            await transactionService.createTransaction(transactionData);
            // Respond with error for unsuccessful transaction
            console.error(
              "Transaction failed:",
              queryResult.response_description
            );

            res.status(400).json({
              error: "Transaction failed",
              details: queryResult.response_description,
            });
          }
        } else {
          res.status(401).json({ message: "Unauthorized" });
        }
      } else {
        res.status(500).json({ error: "Failed to process the request" });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }
}

export default cableService;
