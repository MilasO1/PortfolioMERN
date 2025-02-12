const Skill = require("../models/Skill");

exports.getSkills = async (req, res) => {
    try {
      const skills = await Skill.find({ user: req.user._id });
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.createSkill = async (req, res) => {
    try {
      const { title, category, level } = req.body;
      const skill = await Skill.create({
        user: req.user._id,
        title,
        category,
        level,
        imageUrl: req.file.path
      });
      res.status(201).json(skill);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };