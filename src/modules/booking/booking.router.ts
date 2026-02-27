import express from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

router.post("/", auth(USER_ROLE.STUDENT), bookingController.createBooking);
router.patch(
  "/:id/cancel",
  auth(USER_ROLE.TUTOR, USER_ROLE.STUDENT),
  bookingController.cancelBooking,
);

export const bookingRouter = router;
