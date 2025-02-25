const express = require("express");
const router = express.Router();
const { verifyRecaptcha } = require("../middleware/recaptcha");
const { protect, admin } = require("../middleware/auth");
const {
    register,
    login,
    getAllUsers,
} = require("../controller/authController");
const { validatorRequest } = require("../middleware/validatorRequest");
const { loginValidator, registerValidator } = require("../validations/authValidator");

router.get("/", protect, admin, getAllUsers);
router.post("/register", registerValidator, register);
router.post("/login", verifyRecaptcha, loginValidator, validatorRequest, login);

module.exports = router;