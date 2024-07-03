export function generateAccountNumber(): string {
  const min = 1000000000; // Minimum 10-digit number
  const max = 9999999999; // Maximum 10-digit number
  const accountNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return accountNumber.toString();
}
