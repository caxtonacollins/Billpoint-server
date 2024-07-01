import axios from "axios";
import { log } from "console";
import dotenv from "dotenv";

dotenv.config();

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

export const createReserveAccount = async (user: any) => {
  try {
    const accessToken = await getAccessToken();
    const firstName = user.firstName;

    // Extract the first three letters from the user's firstName
    const firstThreeLetters = firstName.substring(0, 3);

    // Concatenate "EasyBiz-" with the first three letters
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

      const accountDetails = response.data.responseBody.accounts
      const accountNumbers = response.data.responseBody.accounts.map((account: any) => account.accountNumber);

      let walletUpdateDate = {
         walletName: accountDetails.accountName,
         user: user._id,
         monnifyAccountNum: accountNumbers
      }


    } else {
      // Handle errors or failed responses.
      console.error("message response:" + response);
    }
  } catch (error: any) {
    // Handle error response
    if (error.response) {
      console.error('Server responded with:', error.response.status);
      console.error('Response data:', error.response.data);
  } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
  } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
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
    let headers = {
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

