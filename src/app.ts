import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import Routes from "./routes/index";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import "dotenv/config";
import mongoose from "mongoose";
import { logger } from "./config/wistonLogger";
import { log } from "console";
import WalletService from "./services/walletService";
import { Server } from 'socket.io';
import http from 'http';

// Load environment variables
dotenv.config();

const allowedOrigins = ["http://192.168.1.168:8081"];
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: true,
};

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server);

// app.use(cors(corsOptions));
app.use(cors());
app.options("*", cors());

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, PUT,PATCH, POST, DELETE");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Authorization, Content-Type, Accept"
//   );
//   res.header("Bypass-Tunnel-Reminder", "ff");
//   next();
// });

app.use(bodyParser.json());

app.use(cookieParser());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(`${__dirname}/public`));

// connectDB();
const uri = process.env.MONGODB_URI as string;
mongoose.connect(uri, {}).then(() => {
  logger.info("Connected to MongoDB✈️");
});

// Middleware to add db to req
app.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

app.use("/api/v1", Routes);

io.on('connection', (socket) => {
  console.log('a user connected 😎');
  socket.on('disconnect', () => {
    console.log('user disconnected 😌');
  });
});

// Passing the Socket.IO instance to the notification controller
import { initSocket } from './controllers/notificationController';
initSocket(io);

async function main() {
  try {
    // const user = {
    //   _id: "668086d2bb9369e95bf5e95a",
    //   firstName: "string",
    //   lastName: "string",
    //   email: "string2@gmail.com",
    //   number: "08628798897",
    // };
    // const newAccount = await createReserveAccount(user);
    // log("New Account: ", newAccount);
  } catch (error) {
    console.error("Error creating reserve account:", error);
  }
}

main();

export { app };
