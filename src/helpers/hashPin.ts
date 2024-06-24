import bcrypt from "bcrypt";

/**
 * Hash a transaction pin
 * @param pin - The transaction pin to be hashed
 * @returns The hashed pin
 */
export const hashPin = async (pin: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPin = await bcrypt.hash(pin, saltRounds);
  return hashedPin;
};

/**
 * Compare a plain pin with a hashed pin
 * @param plainPin - The plain pin
 * @param hashedPin - The hashed pin
 * @returns A boolean indicating whether the pins match
 */
export const comparePin = async (
  plainPin: string,
  hashedPin: string
): Promise<boolean> => {
  const match = await bcrypt.compare(plainPin, hashedPin);
  return match;
};
