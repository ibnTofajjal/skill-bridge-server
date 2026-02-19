import express, { Application } from "express";
import config from "./config";
import cors from "cors";

const app: Application = express();

app.use(cors({ origin: config.frontend_url, credentials: true }));
app.use(express.json());

console.log("req start");
app.get("/", (req, res) => {
  console.log("inside");

  res.send("✨ Server is Up and Running");
});
console.log("req end");

export default app;
