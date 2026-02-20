import express from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

router.get("/me", auth(USER_ROLE.STUDENT, USER_ROLE.TUTOR), authController.me);
router.post("/register", authController.register);
router.post("/login", authController.login);

export const authRouter = router;
