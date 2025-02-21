const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const { validatorRequest } = require("../middleware/validatorRequest");
const { skillCreationValidator } = require("../validations/authValidator");
const {
    createSkill,
    getSkills,
    updateSkill,
    deleteSkill,
} = require("../controllers/skillController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.get("/", protect, getSkills);
router.post("/addSkills", protect, upload.single("image"), skillCreationValidator, validatorRequest, createSkill);
router.put("/:id", protect, upload.single("image"), skillCreationValidator, validatorRequest, updateSkill);
router.delete("/:id", protect, deleteSkill);

module.exports = router;