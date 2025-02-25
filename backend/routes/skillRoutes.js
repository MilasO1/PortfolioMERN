import { Router } from "express";
const router = Router();
import multer, { diskStorage } from "multer";
import { protect } from "../middleware/auth.js";
import { validatorRequest } from "../middleware/validatorRequest.js";
import { skillCreationValidator } from "../validations/authValidator.js";
import { createSkill, getSkills, updateSkill, deleteSkill } from "../controller/skillController.js";

// Configure multer storage
const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes
router.get("/", protect, getSkills);


router.post("/addSkills", 
  protect, 
  upload.single('imageUrl'),  // Process multipart form first
  skillCreationValidator,     // Then validate the processed fields
  validatorRequest, 
  createSkill
);

router.put("/:id", 
  protect, 
  upload.single('imageUrl'),  // Same here for update
  skillCreationValidator, 
  validatorRequest, 
  updateSkill
);

router.delete("/:id", protect, deleteSkill);

export default router;