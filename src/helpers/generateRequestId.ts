import moment from "moment-timezone";
// import moment from "moment";

const generateRandomString = (length: any) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
};

export const generateRequestId = async () => {
  // Get current date and time in Africa/Lagos timezone (GMT +1)
  const currentDateTime = moment().tz("Africa/Lagos");

  // Format the date and time in the required format (YYYYMMDDHHII)
  const formattedDateTime = currentDateTime.format("YYYYMMDDHHmm");

  // Generate a random alphanumeric string (e.g., "YUs83meikd")
  const randomString = generateRandomString(10);

  // Concatenate the formatted date and time with the random string
  const requestId = `${formattedDateTime}${randomString}`;

  return Promise.resolve(requestId);
};
