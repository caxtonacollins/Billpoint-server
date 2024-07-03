import { Schema, model, Document } from 'mongoose';

interface INotification extends Document {
  userId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = model<INotification>('Notification', notificationSchema);
