import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { Db, MongoClient } from "mongodb";
import Routes from "./routes/index";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import "dotenv/config";
import { IRequest } from "./interfaces";

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

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// parse json request body
app.use(express.json());

let client: MongoClient;
let db: Db;

// MongoDB Connection
const connectDB = async () => {
  const uri = process.env.MONGODB_URI as string;
  client = new MongoClient(uri);
  try {
    await client.connect();
    app.set("mongoClient", client); // Save the client instance to the app
    db = client.db("ts-server-start");
    console.log(`MongoDB connected ${db.databaseName}✈️`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

connectDB();

// Middleware to add db to req
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as IRequest).db = db;
  next();
});

app.use("/api/v1", Routes);

export { app, db };
