import express, { Application } from "express";
import config from "./config";
import cors from "cors";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRouter } from "./modules/auth/auth.router";
import { tutorRouter } from "./modules/tutor/tutor.router";
import { bookingRouter } from "./modules/booking/booking.router";

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
app.use(`${API_VERSION}/tutor`, tutorRouter);
app.use(`${API_VERSION}/bookings`, bookingRouter);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
