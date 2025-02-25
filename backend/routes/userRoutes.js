import { Router } from "express";
const router = Router();
import { verifyRecaptcha } from "../middleware/recaptcha.js";
import { protect, admin } from "../middleware/auth.js";
import { register, login, getAllUsers } from "../controller/authController.js";
import { validatorRequest } from "../middleware/validatorRequest.js";
import { loginValidator, registerValidator } from "../validations/authValidator.js";

router.get("/", admin, getAllUsers);
router.post("/register", registerValidator, register);
router.post("/login", loginValidator, validatorRequest, login);

export default router;