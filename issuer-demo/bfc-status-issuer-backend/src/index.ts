import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import statusRoutes from "./routes/statusRoutes";

dotenv.config({ path: ".env" });

const app: Express = express();
const port = process.env.PORT;

app.use(
  cors({
    // origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/status", statusRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
