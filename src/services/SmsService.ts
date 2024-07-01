const axios = require("axios");

// const token = process.env.SMS_TOKEN
// const key = process.env.SMS_KEY
// const number = process.env.SMS_NUMBER

// export const sendSms = async (phoneNumber: string, code: number) => {
//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };
// console.log(phoneNumber, code)
//   const validPhoneNo = phoneNumber.slice(1)
//   const data = {
//     from: `${number}`,
//     to: [`234${validPhoneNo}`],
//     body: `your lendqr otp code is: ${code}`,
//   };
//   const respone = await fetch(
//     `https://sms.api.sinch.com/xms/v1/${key}/batches`,
//     {
//       method: "POST",
//       body: JSON.stringify(data),
//       headers: headers,
//     }
//   );

//   console.log("sms sent successfuly");
// };

import { SinchClient } from "@sinch/sdk-core";

const sinchClient = new SinchClient({
    projectId: "YOUR_project_id",
    keyId: "YOUR_access_key",
    keySecret: "YOUR_access_secret",
    applicationKey: "YOUR_application_key",
    applicationSecret: "YOUR_application_secret"
});

async function sendSms(){
    const response = await sinchClient.sms.batches.send({
        sendSMSRequestBody: {
            to: [
                "YOUR_to_number"
            ],
            from: "YOUR_sinch_number",
            body: "This is a test message using the Sinch Node.js SDK."
        }
    });

    console.log(JSON.stringify(response));
}
// sendSms();
