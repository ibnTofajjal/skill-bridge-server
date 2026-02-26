import express from "express";
import { tutorController } from "./tutor.controller";
import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

// Public — browse all tutors
// Filters: subjectId, subjectName, minPrice, maxPrice, page, limit
router.get("/", tutorController.getAllTutors);

router.post("/profile", auth(USER_ROLE.TUTOR), tutorController.createProfile);
router.get("/profile", auth(USER_ROLE.TUTOR), tutorController.getProfile);

router.get(
  "/profile/availability",
  auth(USER_ROLE.TUTOR),
  tutorController.getMyAvailability,
);

router.post(
  "/profile/availability",
  auth(USER_ROLE.TUTOR),
  tutorController.setAvailability,
);

router.delete(
  "/profile/availability/:id",
  auth(USER_ROLE.TUTOR),
  tutorController.deleteAvailability,
);

router.patch(
  "/profile/:id",
  auth(USER_ROLE.TUTOR),
  tutorController.updateProfile,
);

// Public — get single tutor by profile ID (includes available slots & reviews)
router.get("/:id", tutorController.getTutorById);

export const tutorRouter = router;
