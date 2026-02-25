import express from "express";
import { tutorController } from "./tutor.controller";
import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

router.post("/profile", auth(USER_ROLE.TUTOR), tutorController.createProfile);

export const tutorRouter = router;
