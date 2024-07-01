import bcrypt from "bcrypt";
import { log } from "console";
import { Users } from "../models/userModel";
import { ObjectId } from "mongodb";

export const checkThatUserExistWithPhoneNumber = async (number: number) => {
  try {
    const user = await Users.findOne({ number });
    return user;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const checkThatUserExistWithEmail = async (email: string) => {
  try {
    // const Users = db.collection("users");
    const user = await Users.findOne({ email });
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

    // const Users = db.collection("users");
    const user = await Users.findOne({ email });

    if (!user || !user.password) {
      return false;
    }

    hashedPassword = user.password;

    const match = await bcrypt.compare(password, hashedPassword);

    return match;
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
    // const Users = db.collection("users");
    const users = Users.find({}).select(
      "-password -verificationOTP -transactionPin"
    );
    return users;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const getUserById = async (id: any) => {
  try {
    // const Users = db.collection("users");
    const users = Users.findOne({ _id: new ObjectId(id) }).select(
      "-password -verificationOTP -transactionPin"
    );
    return users;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const updateUserById = async (id: any, updateData: object) => {
  try {
    // const Users = db.collection("users");
    const users = Users.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (!users) throw new Error("No users found🥲");

    const updatedUser = Users.findOne(
      { _id: new ObjectId(id) }).select(
        "-password -verificationOTP -transactionPin"
      );
    return updatedUser;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const updateUserByEmail = async (email: string, updateData: object) => {
  try {
    // const Users = db.collection("users");
    const users = Users.updateOne({ email }, { $set: updateData });

    if (!users) throw new Error("No users found🥲");

    const updatedUser = await Users.findOne(
      { email }).select(
        "-password -verificationOTP -transactionPin"
      );;

    log(updatedUser);
    return updatedUser;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const getCurrentAmountByEmail = async (email: string) => {
  try {
    const user = await Users.findOne({ email }).populate("wallet");
  if (!user) {
    throw new Error('User or wallet not found');
  }

  const balance = user.wallet.balance
  return balance
  } catch (error) {
    console.error('Error fetching user amount:', error);
    throw error;
  }
};