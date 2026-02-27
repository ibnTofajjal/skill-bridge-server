import express from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

router.get(
  "/",
  auth(USER_ROLE.STUDENT, USER_ROLE.TUTOR),
  bookingController.allBooking,
);

router.get(
  "/:id",
  auth(USER_ROLE.STUDENT, USER_ROLE.TUTOR),
  bookingController.singleBooking,
);

router.post("/", auth(USER_ROLE.STUDENT), bookingController.createBooking);

// STUDENT AND TUTOR BOTH CAN CANCEL THE BOOKING STATUS
router.patch(
  "/:id/cancel",
  auth(USER_ROLE.TUTOR, USER_ROLE.STUDENT),
  bookingController.cancelBooking,
);

router.patch(
  "/:id",
  auth(USER_ROLE.TUTOR),
  bookingController.updateBookingStatus,
);

export const bookingRouter = router;
