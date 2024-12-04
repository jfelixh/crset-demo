import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import LoginRoute from "./routes/LoginRoute";
import { redisClient } from "./config/redis";
import { RedisStore } from "connect-redis";
import session from "express-session";

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

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "login_id:",
});

// Initialize session storage.
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

app.use("/login", LoginRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
