import JWT, { JwtPayload } from "jsonwebtoken";
import 'dotenv/config';


if (!process.env.JWT_TOKEN_SECRET) {
  throw new Error(
    "JWT_TOKEN_SECRET is not defined in the environment variables."
  );
}
const secret = process.env.JWT_TOKEN_SECRET as string;

/**
 * @class JwtHelper
 */
class JwtHelper {
  /**
   * @method generateToken
   * @static
   * @param {object} payload
   * @param {string} expiresIn
   * @returns {string}
   */

  static generateToken(payload: object, expiresIn: string): string {
    if (!expiresIn) {
      
      return JWT.sign(payload, secret);
    }

    return JWT.sign(payload, secret, { expiresIn });
  }

  /**
   * @method verifyToken
   * @static
   * @param {string} token
   * @returns {string|JwtPayload}
   */
  static verifyToken(token: string): string | JwtPayload {
    try {
      const payload = JWT.verify(token, secret);
      return payload
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export default JwtHelper;
