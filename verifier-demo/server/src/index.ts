import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import LoginRoute from "./routes/LoginRoute";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/login", LoginRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
