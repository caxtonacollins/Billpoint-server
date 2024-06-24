import { Collection, Db, MongoClient, ObjectId } from "mongodb";

interface User {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  number: number;
  verified: boolean;
  verificationOTP: number;
  transactionPin?: string;
  otpCreationTime?: Date
  role: string;
}

const getUsersCollection = (client: MongoClient): Collection<User> => {
  const db: Db = client.db("ts-server-start");
  return db.collection<User>("users");
};

export { User, getUsersCollection };

// import mongoose, { Schema, Document } from 'mongoose';

// // Define the User interface extending Document from Mongoose
// export interface IUser extends Document {
//   firstName: string;
//   lastName: string;
//   email: string;
//   number: string;
//   password: string;
//   verified: boolean;
//   verificationOTP: number;
// }

// // Create the User schema
// const UserSchema: Schema = new Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   number: { type: String, required: true },
//   password: { type: String, required: true },
//   verified: { type: Boolean, default: false },
//   verificationOTP: { type: Number, required: true },
// });

// // Create and export the User model
// export const User = mongoose.model<IUser>('User', UserSchema);