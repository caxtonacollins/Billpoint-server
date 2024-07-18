import axios from "axios";
import { log } from "console";
import dotenv from "dotenv";
import { IUser } from "../models/userModel";

dotenv.config();

interface initiateTransferResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody: object;
}

/**
 * generate monnify access token
 *
 */
const getAccessToken = async () => {
  const key = process.env.MONNIFY_API_KEY;
  const secret = process.env.MONNIFY_SECRET_KEY;
  const accessToken = process.env.MONNIFY_ACCESSTOKEN_URL;

  log(key, secret, accessToken);

  if (!key || !secret || !accessToken) {
    throw new Error("Please make sure all environment variables are defined.");
  }

  const basicAuth = Buffer.from(`${key}:${secret}`).toString("base64");

  const response = await axios.post(
    accessToken,
    {
      body: "",
    },
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    }
  );
  return response.data.responseBody.accessToken;
};

export const createReserveAccount = async (user: IUser) => {
  try {
    const accessToken = await getAccessToken();
    const firstName = user.firstName;

    // Extract the first three letters from the user's firstName
    const firstThreeLetters = firstName.substring(0, 3);

    // Concatenate "BillPoint-" with the first three letters
    const accountName = `BillPoint-${firstThreeLetters}`;

    const payload = {
      accountReference: user._id,
      accountName: accountName,
      currencyCode: "NGN",
      contractCode: process.env.MONNIFY_CONTRACT_CODE,
      customerEmail: user.email,
      customerName: `${user.firstName} ${user.lastName}`,
      getAllAvailableBanks: true,
    };

    const configurations = {
      method: "post",
      url: process.env.MONNIFY_RESERVE_ACCT_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: payload,
    };

    const response = await axios(configurations);

    if (response.status === 200) {
      // Account created successfully.
      console.log(`Account created successfully, ${accountName}`);

      const accountDetails = response.data.responseBody.accounts;
      const accountNumbers = response.data.responseBody.accounts.map(
        (account: any) => account.accountNumber
      );

      let walletUpdateDate = {
        walletName: accountDetails.accountName,
        user: user._id,
        monnifyAccountNum: accountNumbers,
      };
    } else {
      // Handle errors or failed responses.
      console.error("message response:" + response);
    }
  } catch (error: any) {
    // Handle error response
    if (error.response) {
      console.error("Server responded with:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request setup error:", error.message);
      throw new Error(error.message);
    }
  }
};

export const getReservedAccountDetails = async (userId: any) => {
  try {
    const API_URL = process.env.MONNIFY_RESERVE_ACCT_DETAILS_URL;
    const accountReference = userId;
    const accessToken = await getAccessToken();

    let path = `${API_URL}/${accountReference}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(path, { headers });

    //extraction the account details from the monnify response
    const accounts = response.data.responseBody.accounts;
    //  .map(
    //    (account) => account.accountNumber
    //  );

    // Return the response to the client
    return { accounts };
  } catch (error) {
    // Handle errors here
    console.error("Error fetching Monnify account details:", error);
  }
};

export const initiateTransfer = async (
  user: IUser,
  amount: number,
  narration: string,
  destinationBankCode: string,
  destinationAccountNumber: string,
  sourceAccountNumber: string,
  destinationAccountName: string
) => {
  try {
    const accessToken = await getAccessToken();

    const payload = {
      amount,
      reference: user._id,
      narration,
      destinationBankCode,
      destinationAccountNumber,
      currency: "NGN",
      sourceAccountNumber,
      destinationAccountName,
    };

    const configurations = {
      method: "post",
      url: process.env.MONNIFY_INITIATE_TRANSFER_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: payload,
    };

    const response = await axios(configurations);

    return response.data;
  } catch (error: any) {
    log(error);
    throw new Error(error);
  }
};

export const getTransferStatus = async (reference: string) => {
  const accessToken = await getAccessToken();
  const API_URL = process.env.MONNIFY_GET_TRANSFER_STATUS;

  let path = `${API_URL}?reference=${{ reference }}`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await axios.get(path, { headers });

    return response.data;
  } catch (error: any) {
    log(error);
    throw new Error(error);
  }
};

export const getWalletBalance = async (walletAccountNumber: string) => {
  const accessToken = await getAccessToken();
  const API_URL = process.env.MONNIFY_WALLET_BALANCE_URL;

  let path = `${API_URL}?accountNumber=${{ walletAccountNumber }}`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await axios.get(path, { headers });

    return response.data;
  } catch (error: any) {
    log(error);
    throw new Error(error);
  }
};

export const getAllTransfer = async (pageSize?: number, pageNo?: number) => {
  const accessToken = await getAccessToken();
  const API_URL = process.env.MONNIFY_GET_ALL_TRANSFER;

  let pageSizee = pageSize || 5;
  let pageNoo = pageNo || 1;

  let path = `${API_URL}?pageSize=${pageSizee}&pageNo=${pageNoo}`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await axios.get(path, { headers });

    return response.data;
  } catch (error: any) {
    log(error);
    throw new Error(error);
  }
};

export const getAllBanks = async () => {
  try {
    const accessToken = await getAccessToken();

    const configurations = {
      method: "get",
      url: process.env.MONNIFY_GET_ALL_BANKS,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios(configurations);
log(response.data)
    return response.data;
  } catch (error: any) {
    log(error);
    throw new Error(error);
  }
};
