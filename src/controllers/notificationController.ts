import { Request, Response } from "express";
import { Notification } from "../models/notificationModel";
import { Server } from "socket.io";

let io: Server;

export const initSocket = (socketIo: Server) => {
  io = socketIo;
};

export const createNotification = async (user: string, message: string) => {
  const notification = new Notification({ user, message });
  await notification.save();
  io.to(user).emit('notification', notification);
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { user } = req.params;
    const notifications = await Notification.find({ user });
    res.status(200).json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
