import Mailer, { Transporter } from "nodemailer";
import { IEmailSender } from "../interfaces";

/**
 * @class EmailSender
 */
class EmailSender implements IEmailSender {
  transporter: Transporter;

  SENDER_EMAIL: string;

  MAIL_FROM_NAME = "Billpoint";

  /**
   * @constructor
   * @param {string} SENDER_EMAIL
   * @param {string} SENDER_PASSWORD
   */
  constructor(SENDER_EMAIL: any, SENDER_PASSWORD: any) {
    const AUTH = {
      user: SENDER_EMAIL,
      pass: SENDER_PASSWORD,
    };

    this.transporter = Mailer.createTransport({
      service: "gmail",
      auth: AUTH,
    });

    this.SENDER_EMAIL = SENDER_EMAIL;
  }

  /**
   * @method send
   * @async
   * @param {string} toEmail
   * @param {string} subject
   * @param {string} message
   */
  async send(toEmail: string, subject: string, message: string): Promise<void> {
    const FROM_MAIL_INFO = {
      name: this.MAIL_FROM_NAME,
      address: this.SENDER_EMAIL,
    };

    this.transporter.sendMail({
      from: FROM_MAIL_INFO,
      to: toEmail,
      subject,
      text: message,
    });
  }
}

export default EmailSender;

// import dotenv from 'dotenv';
// import nodemailer from 'nodemailer';
// import mailgunTransport from 'nodemailer-mailgun-transport';
// import path from 'path';
// import { promises as fs } from 'fs';
// import { fileURLToPath } from 'url';

// dotenv.config();

// // Configure your Mailgun API credentials
// const auth = {
//   auth: {
//     api_key: process.env.MAILGUN_API_KEY,
//     domain: process.env.MAILGUN_DOMAIN,
//   },
//  tls: process.env.NODE_ENV === 'production' ? {} : { rejectUnauthorized: false },
// };

// // Create a Nodemailer transporter using Mailgun
// const transporter = nodemailer.createTransport(mailgunTransport({
//   auth: {
//     api_key: process.env.MAILGUN_API_KEY,
//     domain: process.env.MAILGUN_DOMAIN,
//   },
// }));

// // Function to read HTML template
// const readHTMLTemplate = async (templateName) => {
//   try {
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = path.dirname(__filename);
//     const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);

//     // Read template file
//     return await fs.readFile(templatePath, 'utf8');
//   } catch (error) {
//     throw new Error(`Error reading HTML template: ${error.message}`);
//   }
// };

// // Function to send email
// const sendEmail = async (emails, subject, templateName, replacements) => {
//   try {
//     // Ensure recipientEmails is an array or not
//     const recipients = Array.isArray(emails) ? emails : [emails];
//     console.log(recipients);

//     const htmlTemplate = await readHTMLTemplate(templateName);

//     // Replace placeholders in the template
//     let personalizedTemplate = htmlTemplate;
//     for (const [key, value] of Object.entries(replacements)) {
//       const placeholder = `{{${key}}}`;
//       personalizedTemplate = personalizedTemplate.replace(
//         new RegExp(placeholder, 'g'),
//         value,
//       );
//     }

//     // Email options
//     const mailOptions = {
//       from: 'Victoria Travels <info@victoriatravels.org>',
//       to: recipients,
//       subject,
//       html: personalizedTemplate,
//     };

//     // console.log(mailOptions);

//     // Send email
//     await transporter.sendMail(mailOptions);
//     console.log(`Email sent successfully to: ${recipients}`);
//   } catch (error) {
//     console.error(`Error sending email: ${error.message}`);
//   }
// };

// export default sendEmail;

// // Example usage
// // const email = ["caxtonacollins@gmail.com", "strngecloud.iv@gmail.com"]
// // const subject = "Welcome to Wintergreen";
// // const templateName = "welcome-template";
// // const replacements = {
// //   link: "https://example.com/verify?token=some-token",
// //       businessName: "Wintergreen",
// //       buttonText: "LOGIN",
// // }

// // try {
// //   await sendEmail(email, subject, templateName, replacements);
// // } catch (error) {
// //   console.log(error);
// // }
