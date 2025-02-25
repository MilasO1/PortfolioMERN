import expressValidator from "express-validator";

const { body } = expressValidator;

export const registerValidator = [
    body("name").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long."),
    body("email").isEmail().withMessage("Invalid email format."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
];

export const loginValidator = [
    body("email").isEmail().withMessage("Invalid email format."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
];

export const skillCreationValidator = [
    body("title").isLength({ min: 3 }).withMessage("Title must be at least 3 characters long."),
    body("category").isLength({ min: 3 }).withMessage("Category must be at least 3 characters long."),
    body("level").isIn(["Beginner", "Intermediate", "Expert"]).withMessage("Invalid skill level."),
];
