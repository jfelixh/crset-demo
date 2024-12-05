import { RedisStore } from "connect-redis";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import { redisClient } from "./config/redis";
import { connectDB } from "./db/database";
import LoanRoute from "./routes/LoanRoute";
import LoginRoute from "./routes/LoginRoute";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Initialize store
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "login_id:",
});

// Initialize session storage
app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: "Fear is the mind-killer.", // TODO: extract to env
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Initialize DB
const initializeDatabase = async () => {
  try {
    await connectDB();
    console.log("Database and table setup complete.");
  } catch (error) {
    console.error("Error setting up the database:", error);
  }
};
initializeDatabase();

// Routes
app.use("/login", LoginRoute);
app.use("/loans", LoanRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
