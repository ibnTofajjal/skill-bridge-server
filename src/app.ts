import express, { Application } from "express";
import config from "./config";
import cors from "cors";
import { notFound } from "./middlewares/notFound";
import { authRouter } from "./modules/auth/auth.router";

const app: Application = express();
const API_VERSION = "/api/v1";

app.use(cors({ origin: config.frontend_url, credentials: true }));
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("✨ Server is Up and Running");
});

// APPLICATION ROUTE
app.use(`${API_VERSION}/auth`, authRouter);

app.use(notFound);

export default app;
