const mongoose = require("mongoose");
const User = require("./User");

const skillSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
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
    imageURL: {
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
      const Skill = mongoose.model("Skill");
  
      const count = await Skill.countDocuments({ user: this.user });
  
      if (count >= 10 ) { 
        return next(new Error("You have reached the maximum number of skills"));
      }
  
      next();
    } catch (error) {
      next(error);
    }
  });
  

module.exports = mongoose.model("Skill", skillSchema);  