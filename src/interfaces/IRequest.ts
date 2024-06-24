import { Request } from 'express';
import { Db } from 'mongodb';

/**
 * @interface IRequest
 */
export interface IRequest extends Request {
  db?: Db;
}
