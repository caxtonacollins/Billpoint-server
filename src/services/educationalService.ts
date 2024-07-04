import { Request, Response } from "express";
import { generateRequestId } from "../helpers/generateRequestId";
import axios from "axios";
import { queryTransactionStatus } from "../helpers/vtpassHelpers";
import walletService from "./walletService";
import transactionService from "./transactionService";
import { log } from "console";

const apiUrl = "https://sandbox.vtpass.com/api"; // Use 'https://api-service.vtpass.com/api' for live
const secretKey = process.env.VTPASS_SECRET_KEY;

const apiKey = process.env.VTPASS_API_KEY;
const publicKey = process.env.VTPASS_PULIC_KEY;

async function purchaseProduct(
  requestId: any,
  variationCode: string,
  phone: number,
  amount: number,
  quantity: number
) {
  try {
    const payload = {
      request_id: requestId,
      variation_code: variationCode,
      serviceID: "waec-registraion",
      phone,
      quantity,
    };

    log("payload", payload);

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

    const purchaseRes = await axios(configurations);

    //  console.log("====================================");
    //  console.log("purchaseRes:", purchaseRes);
    //  console.log("====================================");

    return purchaseRes;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
}

class educationService {
  static async educationPurchase(
    user: string,
    variationCode: string,
    phone: number,
    amount: number,
    quantity: number
  ) {
    try {
      const requestId = await generateRequestId();

      const purchaseResponse = await purchaseProduct(
        requestId,
        variationCode,
        phone,
        amount,
        quantity
      );

      if (
        purchaseResponse.data.response_description === "PRODUCT DOES NOT EXIST"
      ) {
        throw new Error("service not available at the moment 😌");
      }

      if (purchaseResponse.status === 200) {
        const eduResponse = purchaseResponse.data;
        //   console.log(eduResponse);

        const ID = eduResponse.requestId;

        const queryResponse = await queryTransactionStatus(ID);

        if (queryResponse.status === 200) {
          const queryResult = queryResponse.data;
          //  console.log("queryResult:", queryResult);

          // Extract relevant information from the query result
          const transactionStatus = queryResult.content.transactions.status;
          const amount = queryResult.content.transactions.amount;
          const date = queryResult.transaction_date.date;
          const token = queryResult.token;
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
            token,
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
          } else if (transactionStatus === "pending") {
            await transactionService.createTransaction(transactionData);
            return "pending";
          } else {
            await transactionService.createTransaction(transactionData);
            // Respond with error for unsuccessful transaction
            return "failed";
          }
        } else {
          throw new Error("Unauthorized");
        }
      } else {
        throw new Error("Failed to process the request");
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
}

export default educationService;
