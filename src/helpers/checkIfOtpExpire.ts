export const checkIfOtpIsExpired = (otpCreationTime: Date | string) => {
  const otpDate = new Date(otpCreationTime);
  const currentTime = new Date();

  if (isNaN(otpDate.getTime())) {
    throw new Error("Invalid OTP creation time");
  }

  // Check if OTP is expired (1 minute = 60,000 milliseconds)
  if (currentTime.getTime() - otpDate.getTime() > 60000) {
    return true;
  }

  return false;
};
