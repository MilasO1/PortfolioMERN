import Skill from "../models/Skill.js";
import User from "../models/User.js";
import { unlinkSync, promises } from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function getSkills(req, res, next) {
    try {
      const skills = await Skill.find({ user: req.user._id });
      res.status(200).json(skills);
    } catch (error) {
      next(error);
    }
  }
  
  export async function createSkill(req, res, next) {
    try {
      console.log('Request body:', req.body);
      console.log('Request file:', req.file); 
  
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
      }
  
      const { title, category, level } = req.body;
  
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      console.log('Uploading file to Cloudinary...'); 
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'skills',
        resource_type: 'image'
      });
      console.log('Cloudinary upload result:', result); 
  
     
      unlinkSync(req.file.path);
      console.log('File deleted from server:', req.file.path);

      const skill = await Skill.create({
        title,
        category,
        level,
        user: req.user._id,
        imageUrl: result.secure_url,
        publicId: result.public_id
      });
      console.log('Skill created:', skill); 
  
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { skills: skill._id } },
        { new: true }
      ).select('-password');
      console.log('User updated:', user);
  
      res.status(201).json({ message: 'Skill created successfully', skill });
    } catch (error) {
      console.error('Error in createSkill:', error); 
      res.status(500).json({ success: false, message: "Internal Server Error", code: "INTERNAL_SERVER_ERROR" });
    }
  }

  export async function deleteSkill(req, res, next) {
    const userId = req.user.id;
    const skillId = req.params.id;
  
    try {
      const skill = await Skill.findOneAndDelete({ 
        _id: skillId,
        user: userId 
      });
  
      if (!skill) {
        return next({ status: 404, message: 'Skill not found or unauthorized' });
      }
  
      
      if (skill.publicId) {
        try {
          const cloudinaryResponse = await cloudinary.uploader.destroy(skill.publicId);
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
  }
  
  export async function updateSkill(req, res, next) {
      try {
          const { title, category, level, imageUrl: existingImageUrl, publicId: existingPublicId } = req.body;
          const { id: skillId } = req.params;
          const userId = req.user._id;
  
          const existingSkill = await Skill.findOne({
              _id: skillId,
              user: userId
          });
  
          if (!existingSkill) {
              return next({ status: 404, message: 'Skill not found or unauthorized' });
          }
  
          let imageData = {
              imageUrl: existingImageUrl,
              publicId: existingPublicId
          };
  
          if (req.file) {
              try {
                  const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                      folder: 'skills',
                      resource_type: 'auto',
                      quality: 'auto',
                      fetch_format: 'auto'
                  });
  
                  await promises.unlink(req.file.path);
  
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
                      imageUrl: uploadResult.secure_url,
                      publicId: uploadResult.public_id
                  };
              } catch (uploadError) {
                  if (req.file.path) {
                      await promises.unlink(req.file.path).catch(console.error);
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
                      imageUrl: imageData.imageUrl,
                      publicId: imageData.publicId
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
              await promises.unlink(req.file.path).catch(console.error);
          }
  
          if (error.name === 'ValidationError') {
              return next({ status: 400, message: 'Invalid request data' });
          }
  
          return next(error);
      }
  }
