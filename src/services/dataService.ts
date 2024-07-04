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
  static async purchaseData(
    user: string,
    serviceID: string,
    variationCode: string,
    phone: number
  ) {
    try {
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
            return "success";

            // return { buyData: buyDataResponse, queryResult };
          } else if (transactionStatus === "pending") {
            await transactionService.createTransaction(transactionData);
            return "pending";
          } else {
            await transactionService.createTransaction(transactionData);

            return "failed";
          }
        } else {
          // Respond with error for failed query
          throw new Error("failed to requery transaction status");
        }
      } else {
        // Respond with error for failed purchase
        console.error("Failed to purchase data:", purchaseResponse);
        throw new Error("Failed to process the request");
      }
    } catch (error: any) {
      console.error("Error:", error);
      throw error;
    }
  }
}

export default dataService;
