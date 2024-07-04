import { Request, Response } from "express";

/**
 * @class airtime
 */

const apiUrl = "https://sandbox.vtpass.com/api"; // Use 'https://api-service.vtpass.com/api' for live
const secretKey = process.env.VTPASS_SECRET_KEY;

const apiKey = process.env.VTPASS_API_KEY;
const publicKey = process.env.VTPASS_PULIC_KEY;

import { generateRequestId } from "../helpers/generateRequestId";
import axios from "axios";
import { queryTransactionStatus } from "../helpers/vtpassHelpers";
import userController from "../controllers/userController";
import walletService from "./walletService";
import transactionService from "./transactionService";

class airtimeService {
  static purchaseAirtime = async (
    user: string,
    serviceID: string,
    amount: number,
    phone: number
  ) => {
    try {
      const request_id = await generateRequestId();

      const payload = {
        request_id,
        serviceID,
        amount,
        phone,
      };

      const configurations = {
        method: "post",
        url: `https://sandbox.vtpass.com/api/pay`,
        headers: {
          "api-key": apiKey,
          "secret-key": secretKey,
          "Content-Type": "application/json",
        },
        data: payload,
      };

      const purchaseResponse = await axios(configurations);

      if (purchaseResponse.status === 200) {
        const airtimeResponse = purchaseResponse.data;

        // Extraact transaction ID from the response
        const requestId = airtimeResponse.requestId;

        // Query transaction status using the transaction ID
        const queryResponse = await queryTransactionStatus(requestId);

        // checking if the query was successful
        if (queryResponse.status === 200) {
          const queryResult = queryResponse.data;

          // Extract relevant information from the query result
          const transactionStatus = queryResult.content.transactions.status;
          const amount = queryResult.content.transactions.amount;
          const transactionType = queryResult.content.transactions.type;
          const details = queryResult.content.transactions.product_name;
          const reference = queryResult.content.transactions.transactionId;
          const status = queryResult.content.transactions.status;
          const date = queryResult.transaction_date.date;

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
            // res.status(200).json({ error: false, Airtime: airtimeResponse, queryResult });
            return "success";
          } else if (transactionStatus === "pending") {
            await transactionService.createTransaction(transactionData);

            return "pending";
          } else {
            await transactionService.createTransaction(transactionData);
            // Respond with error for unsuccessful transaction
            return "failed";
          }
        } else {
          // Respond with error for failed query
          // console.error("Failed to query transaction status:", queryResponse);
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
  };
}

export default airtimeService;
