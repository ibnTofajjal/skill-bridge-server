import express from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

router.get("/users", auth(USER_ROLE.ADMIN), adminController.getAllUsers);
router.patch("/users/:id", auth(USER_ROLE.ADMIN), adminController.updateStatus);
router.get("/bookings", auth(USER_ROLE.ADMIN), adminController.getAllBookings);
router.get("/analytics", auth(USER_ROLE.ADMIN), adminController.getAnalytics);

export const adminRouter = router;
