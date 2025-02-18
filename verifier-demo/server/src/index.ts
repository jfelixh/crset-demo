import cors from "cors";
import express, { Express, Request, Response } from "express";
import { connectDB } from "@/db/database";
import LoanRoute from "@/routes/LoanRoute";
import LoginRoute from "@/routes/PresentCredentialRoute";
import { config } from "@/config/base";

const app: Express = express();
const { PORT } = config;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [process.env.FRONTEND_URL!],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
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
app.use("/present", LoginRoute);
app.use("/loans", LoanRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
