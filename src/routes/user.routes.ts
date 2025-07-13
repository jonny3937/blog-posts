import express from "express";
import { updateUser, updatePassword } from "../controllers/user.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.patch("/", protect, updateUser);
router.patch("/password", protect, updatePassword);

export default router;
