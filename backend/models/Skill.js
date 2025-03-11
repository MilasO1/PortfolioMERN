import { Schema, model } from "mongoose";
import User from "./User.js";

const skillSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ["Beginner", "Intermediate", "Expert"]
    },
    imageUrl: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    }
    
},
{
     timestamps: true
});

skillSchema.pre("save", async function (next) {
    try {
      const Skill = model("Skill");
  
      const count = await Skill.countDocuments({ user: this.user });
  
      if (count >= 10 ) { 
        return next(new Error("You have reached the maximum number of skills"));
      }
  
      next();
    } catch (error) {
      next(error);
    }
  });
  

export default model("Skill", skillSchema);  