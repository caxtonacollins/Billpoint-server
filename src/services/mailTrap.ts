import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { MailtrapClient } from "mailtrap";

dotenv.config();

const { SENDER_EMAIL2, MAILTRAP_TOKEN2 } = process.env;

const client = new MailtrapClient({ token: MAILTRAP_TOKEN2 });

const sender = { name: "Mailtrap Test", email: SENDER_EMAIL2 };

async function sendEmail(templateId, recipientEmails, variables) {
  try {
    // Ensure recipientEmails is an array
    const recipients = Array.isArray(recipientEmails)
      ? recipientEmails.map((email) => ({ email }))
      : [{ email: recipientEmails }];

    await client.send({
      from: sender,
      to: recipients,
      template_uuid: templateId,
      template_variables: variables,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export default sendEmail;

// Send an email using nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/** create reusable sendmail function
@params {object} options - mail options (to, subject, text, html)
@params {function} callback - callback function to handle response
*/
export const sendMail = (mailDetails) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailDetails, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};