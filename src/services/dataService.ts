import axios from "axios";
import { url } from "inspector";
import { generateRequestId } from "../helpers/generateRequestId";
import walletService from "./walletService";
import transactionService from "./transactionService";

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
const apiKey = process.env.API_KEY;
const secretKey = process.env.SECRETE_KEY;

class dataService {
  static async getServiceId(identifier: any) {
    try {
      const apiKey = process.env.API_KEY;
      const publicKey = process.env.PULIC_KEY;
      const basicAuth = Buffer.from(`${apiKey}:${publicKey}`).toString(
        "base64"
      );

      // const identifier = 'tv-subscription';

      if (!identifier) {
        throw new Error("Identifier is required 🥲");
      }

      const url = `${process.env.SERVICE_ID}/services?identifier=${identifier}`;

      const response = await axios.get(url, {
        headers: { authorization: `Basic ${basicAuth}` },
      });
      const options = response.data.content;

      return options;
    } catch (error: any) {
      console.error("Error fetching VTpass serviceID", error);
      throw new Error(error.message);
    }
  }

  static async getVariationCodes(serviceID: any) {
    try {
      const apiKey = process.env.API_KEY;
      const publicKey = process.env.PULIC_KEY;
      const url = `${process.env.VARIATION_CODES}?serviceID=${serviceID}`;

      const basicAuth = Buffer.from(`${apiKey}:${publicKey}`).toString(
        "base64"
      );

      const response = await axios.get(url, {
        headers: { authorization: `Basic ${basicAuth}` },
      });
      const options = response.data;

      return options;
    } catch (error: any) {
      console.error("Error fetching VTpass variation codes:", error);
      throw new Error(error.message);
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

  static async queryTransactionStatus(request_id: any) {
    const queryPayload = { request_id: request_id };
    const url = process.env.REQUERY;

    if (!url) throw new Error("url is required 😒");
    const headers = {
      "api-key": apiKey,
      "secret-key": secretKey,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.post(url, queryPayload, {
        headers: headers,
      });
      // Check if the response and its data are defined
      if (response && response.data) {
        return response;
      } else {
        throw new Error("No response data");
      }
    } catch (error) {
      console.error(error);
      throw error;
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

  static async buyData(
    user: any,
    serviceID: any,
    variation_code: any,
    phone: any
  ) {
    try {
      const request_id = await generateRequestId();

      const apiKey = process.env.API_KEY;
      const secretKey = process.env.SECRETE_KEY;

      const billersCode = "08011111111";

      const payload = {
        request_id,
        serviceID,
        variation_code,
        phone,
        billersCode,
      };

      const configurations = {
        method: "post",
        url: process.env.PURCHASE_DATA,
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

        // Query transaction status using the transaction ID
        const queryResponse = await this.queryTransactionStatus(requestId);

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

          const transactionData = {
            user,
            transactionType,
            details,
            amount,
            reference,
            status,
          };

          // If transaction is successful, deduct the amount from the user's wallet balance
          if (
            transactionStatus === "delivered" ||
            transactionStatus === "successful"
          ) {
            await walletService.subtractMoneyFromWalet(user, amount);

            await transactionService.createTransaction(user, transactionData);

            // Respond with success
            return { buyData: buyDataResponse, queryResult };
          } else if (transactionStatus === "pending") {
            await transactionService.createTransaction(user, transactionData);
          } else {
            await transactionService.createTransaction(user, transactionData);
            // Respond with error for unsuccessful transaction
            console.error(
              "Transaction failed:",
              queryResult.response_description
            );

            return {
              error: false,
              message: "Transaction failed",
              data: queryResult.response_description,
            };
          }
        } else {
          // Respond with error for failed query
          // console.error("Failed to query transaction status:", queryResponse);
          throw new Error("failed to requery transaction status");
        }
      } else {
        // Respond with error for failed purchase
        console.error("Failed to purchase data:", purchaseResponse);

        return { error: "Failed to process the request" };
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      throw new Error("failed to requery transaction status");
    }
  }
}

export default dataService;
