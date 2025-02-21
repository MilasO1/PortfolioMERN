const Skill = require("../models/Skill");
const User = require("../models/User");
const fs = require("fs");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

exports.getSkills = async (req, res, next) => {
    try {
      const skills = await Skill.find({ user: req.user._id });
      res.status(200).json(skills);
    } catch (error) {
      next(error);
    }
  };
  
  exports.createSkill = async (req, res, next) => {
    try {
      const { title, category, level } = req.body;
      const user = await User.findById(req.user._id);
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'skills',
        resource_type: 'image'
      });
      fs.unlinkSync(req.file.path);
      let imageUrl = result.secure_url;
      let publicId = result.public_id;
      const skill = await Skill.create({ title, category, level, user, imageUrl, publicId });

      user = await User.findByIdAndUpdate(req.user._id, { $addToSet: { skills: skill._id } }, { new: true }).select('-password');

      res.status(201).json({ message: 'Skill created successfully', skill });
    } catch (error) {
      next(error);
    }
  };

  exports.deleteSkill = async (req, res, next) => {
    const userId = req.user.id;
    const skillId = req.params.id;
    try {
  
      // Find and delete skill in one operation
      const skill = await Skill.findOneAndDelete({ 
        _id: skillId,
        user: userId 
      });
  
      if (!skill) {
        return next({status:404, message: 'Skill not found or unauthorized' });
      }
  
      if (skill.public_id) {
        try {
          const cloudinaryResponse = await cloudinary.uploader.destroy(skill.public_id);
          
          if (cloudinaryResponse.result !== 'ok') {
            console.error('Cloudinary deletion warning:', cloudinaryResponse);
          }
        } catch (cloudinaryError) {
          console.error('Cloudinary deletion error:', cloudinaryError);
        }
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { skills: skillId } },
        { new: true }
      ).select('-password');
  
      return res.status(200).json({ 
        message: 'Skill deleted successfully',
        user: updatedUser
      });
  
    } catch (error) {
      console.error('Skill deletion error:', error);
      return next(error);
    }
  };

  exports.updateSkill = async (req, res, next) => {
    try {
      const { title, category, level, urlImage: existingUrlImage, public_id: existingPublicId } = req.body;
      const { id: skillId } = req.params;
      const userId = req.user._id; 
  
      const existingSkill = await Skill.findOne({ 
        _id: skillId,
        user: userId 
      });
  
      if (!existingSkill) {
       return next({status:404, message: 'Skill not found or unauthorized' });
      }

      let imageData = {
        urlImage: existingUrlImage,
        public_id: existingPublicId
      };
  
      if (req.file) {
        try {
          const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'skills',
            resource_type: 'auto',
            quality: 'auto',
            fetch_format: 'auto'
          });

          await fs.promises.unlink(req.file.path);
  
          if (existingPublicId) {
            try {
              const deleteResult = await cloudinary.uploader.destroy(existingPublicId);
              if (deleteResult.result !== 'ok') {
                console.warn('Warning: Previous image deletion may have failed:', deleteResult);
              }
            } catch (cloudinaryError) {
              console.error('Error deleting previous image:', cloudinaryError);
            }
          }
  
          imageData = {
            urlImage: uploadResult.secure_url,
            public_id: uploadResult.public_id
          };
        } catch (uploadError) {
          if (req.file.path) {
            await fs.promises.unlink(req.file.path).catch(console.error);
          }
          return res.status(500).json({
            message: 'Error uploading image',
            error: uploadError.message
          });
        }
      }
  
      const updatedSkill = await Skill.findByIdAndUpdate(
        skillId,
        {
          $set: {
            title: title || existingSkill.title,
            category: category || existingSkill.category,
            level: level || existingSkill.level,
            urlImage: imageData.urlImage,
            public_id: imageData.public_id,
            updatedAt: new Date()
          }
        },
        { 
          new: true,
          runValidators: true 
        }
      );
  
      return res.status(200).json({
        message: 'Skill updated successfully',
        skill: updatedSkill
      });
  
    } catch (error) {
      if (req.file?.path) {
        await fs.promises.unlink(req.file.path).catch(console.error);
      }
      
      if (error.name === 'ValidationError') {
        return next({ status: 400, message: 'Invalid request data' });
      }
  
      return next(error);
    }
  };
