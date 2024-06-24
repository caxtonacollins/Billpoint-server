import { db } from "../app";
import bcrypt from "bcrypt";
import { log } from "console";
import { Db, ObjectId } from "mongodb";

export const checkThatUserExistWithPhoneNumber = async (number: number) => {
  try {
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ number });
    return user;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const checkThatUserExistWithEmail = async (email: string) => {
  try {
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email });
    return user;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const checkThatPasswordIsValid = async (
  email: string,
  password: string
) => {
  try {
    let hashedPassword;

    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email });

    if (!user || !user.password) {
      return false;
    }

    hashedPassword = user.password;

    const match = await bcrypt.compare(password, hashedPassword);
    
    return match
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const isValidEmail = (email: string) => {
  // Regular expression for basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phoneNumber: string) => {
  // Regular expression for basic phone number format validation
  const phoneRegex = /^\d{11}$/;
  return phoneRegex.test(phoneNumber);
};

export const getAllUsers = async () => {
  try {
    const usersCollection = db.collection("users");
    const users = usersCollection
      .find(
        {},
        { projection: { password: 0, verificationOTP: 0, transactionPin: 0 } }
      )
      .toArray();
    return users;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const getUserById = async (id: any) => {
  try {
    const usersCollection = db.collection("users");
    const users = usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0, verificationOTP: 0, transactionPin: 0 } }
    );
    return users;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const updateUserById = async (id: any, updateData: object) => {
  try {
    const usersCollection = db.collection("users");
    const users = usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (!users) throw new Error("No users found🥲");

    const updatedUser = usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0, verificationOTP: 0, transactionPin: 0 } }
    );
    return updatedUser;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const updateUserByEmail = async (email: string, updateData: object) => {
  try {
    const usersCollection = db.collection("users");
    const users = usersCollection.updateOne({ email }, { $set: updateData });

    if (!users) throw new Error("No users found🥲");

    const updatedUser = await usersCollection.findOne(
      { email },
      { projection: { password: 0, verificationOTP: 0, transactionPin: 0 } }
    );

    log(updatedUser);
    return updatedUser;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};
