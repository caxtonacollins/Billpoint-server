import axios from "axios";
import { log } from "console";
import { Request, Response } from "express";

const apiUrl = "https://sandbox.vtpass.com/api"; // Use 'https://api-service.vtpass.com/api' for live
const secretKey = process.env.VTPASS_SECRET_KEY;

const apiKey = process.env.VTPASS_API_KEY;
const publicKey = process.env.VTPASS_PULIC_KEY;

export async function queryTransactionStatus(requestId: any) {
  const queryPayload = { request_id: requestId };
  const url = process.env.VTPASS_REQUERY;

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

export async function verifyCustomer(req: Request, res: Response) {
  try {
    const { billersCode, type, serviceID } = req.body;
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
      res.status(200).json({ error: false, verifyInfo: response.data });
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
      res.status(200).json({ error: false, verifyInfo: response.data });
    }
  } catch (error: any) {
    console.error(error);
    res.status(200).json({ error: false, message: error.message });
  }
}

export async function vtpassWalletBalance(req: Request, res: Response) {
  try {
    const configurations = {
      method: "get",
      url: process.env.VTPASS_WALLET_BALANCE,
      headers: {
        "api-key": apiKey,
        "public-key": publicKey,
        "Content-Type": "application/json",
      },
    };

    const response = await axios(configurations);

    log("response", response);

    const balance = response.data.contents.balance;
    res.status(200).json({ error: false, walletBalance: balance });
  } catch (error: any) {
    console.error(error);
    res.status(200).json({ error: false, message: error.message });
  }
}
