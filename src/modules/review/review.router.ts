import express from "express";
import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "../../../prisma/generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = express.Router();

router.post("/", auth(USER_ROLE.STUDENT), reviewController.createReview);

export const reviewRouter = router;
