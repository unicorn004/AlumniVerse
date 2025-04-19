const User = require("../models/User");
const { cloudinary, uploadToCloudinary } = require("../utils/cloudinary");
// GET /users?branch=IT&graduationYear=2020&location=Delhi&page=1&limit=10
exports.getAllUsers = async (req, res) => {
  try {
    console.log("GET ALL USER CALLED");
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.branch) filters.branch = req.query.branch;
    if (req.query.graduationYear)
      filters.graduationYear = req.query.graduationYear;
    if (req.query.location) filters.location = req.query.location;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find(filters)
      .skip(skip)
      .limit(limit)
      .select("-passwordHash");

    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

// GET /users/me
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
};

// GET /users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: err.message });
  }
};

// PUT /users/:id
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userToUpdate = await User.findById(id);
    if (!userToUpdate)
      return res.status(404).json({ message: "User not found" });

    const currentUser = req.user;
    const isSelf = currentUser.id === id;
    const sameRole = currentUser.role === userToUpdate.role;

    if (!isSelf && currentUser.role !== "admin" && !sameRole) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this profile" });
    }

    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).select("-passwordHash");
    res.json(updatedUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Profile update failed", error: err.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload the image to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "alumniverse", // Cloudinary folder
      public_id: `${req.user.id}-profile`, // Using user ID for a unique file name
      resource_type: "image", // Ensures it's treated as an image
    });

    // Find the user and save the Cloudinary image URL
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profileImage = cloudinaryResult.secure_url; // Save Cloudinary image URL

    await user.save();

    res.json({
      message: "Profile image uploaded successfully",
      url: cloudinaryResult.secure_url, // Respond with the image URL
    });
  } catch (err) {
    console.error("Error uploading profile image:", err);
    res.status(500).json({
      message: "Image upload failed",
      error: err.message,
    });
  }
};

// PUT /users/upload/resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Check if the uploaded file is a resume (e.g., PDF or document)
    if (!req.file.mimetype.startsWith("application/")) {
      return res
        .status(400)
        .json({ message: "Invalid file type. Only documents are allowed." });
    }

    // Upload the resume to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "alumniverse/resumes",
      public_id: `${req.user.id}-resume-${Date.now()}`,
      resource_type: "raw",
    });

    // Find the user and update the resume URL in the profile
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's resume URL with the one returned by Cloudinary
    user.resume = cloudinaryResult.secure_url;

    await user.save();

    res.json({
      message: "Resume uploaded successfully",
      url: cloudinaryResult.secure_url, // The URL of the uploaded resume
    });
  } catch (err) {
    console.error("Error uploading resume:", err);
    res.status(500).json({
      message: "Resume upload failed",
      error: err.message,
    });
  }
};

exports.updateAllUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Log to check if the user ID exists
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID not found in request" });
    }

    console.log("User ID from request:", userId); // Check if userId is valid

    let {
      fullName,
      role,
      graduationYear,
      branch,
      jobTitle,
      company,
      location,
      bio,
      profileImage,
      linkedIn,
      resume,
      experiences,
      education,
      skills,
      achievements,
    } = req.body;

    // Parse arrays if they come in as JSON strings
    if (typeof experiences === "string") experiences = JSON.parse(experiences);
    if (typeof education === "string") education = JSON.parse(education);
    if (typeof skills === "string") skills = JSON.parse(skills);
    if (typeof achievements === "string")
      achievements = JSON.parse(achievements);

    // Handle profileImage and resume (file uploads via req.file)
    let profileImageUrl = profileImage; // Store updated URL for profileImage
    let resumeUrl = resume; // Store updated URL for resume

    if (req.files) {
      // Handle profileImage upload (from req.files)
      if (req.files.profileImage) {
        const cloudinaryResult = await cloudinary.uploader.upload(
          req.files.profileImage[0].path,
          {
            folder: "alumniverse",
            public_id: `${userId}-profile`,
            resource_type: "image",
          }
        );
        profileImageUrl = cloudinaryResult.secure_url; // Save Cloudinary URL
      }

      // Handle resume upload (from req.files)
      if (req.files.resume) {
        const cloudinaryResult = await cloudinary.uploader.upload(
          req.files.resume[0].path,
          {
            folder: "alumniverse",
            public_id: `${userId}-resume`,
            resource_type: "raw",
          }
        );
        resumeUrl = cloudinaryResult.secure_url; // Save Cloudinary URL
      }
    }

    // Handle profileImage upload if Base64 string
    if (profileImage && profileImage.startsWith("data:image")) {
      const cloudinaryResult = await cloudinary.uploader.upload(profileImage, {
        folder: "alumniverse",
        public_id: `${userId}-profile`,
        resource_type: "image",
      });
      profileImageUrl = cloudinaryResult.secure_url; // Save Cloudinary URL
    }

    // Handle resume upload if Base64 string
    if (resume && resume.startsWith("data:application")) {
      const cloudinaryResult = await cloudinary.uploader.upload(resume, {
        folder: "alumniverse",
        public_id: `${userId}-resume`,
        resource_type: "raw",
      });
      resumeUrl = cloudinaryResult.secure_url; // Save Cloudinary URL
    }

    // Match uploaded achievement images
    let achievementImages = req.files?.achievementImages || [];

    if (!Array.isArray(achievements)) {
      achievements = [];
    }

    if (!Array.isArray(achievementImages)) {
      achievementImages = [achievementImages]; // handle single file case
    }

    // const updatedAchievements = await Promise.all(
    //   achievements.map(async (ach, idx) => {
    //     const imageFile = achievementImages[idx];

    //     if (imageFile) {
    //       try {
    //         const result = await cloudinary.uploader.upload(imageFile.path, {
    //           folder: "alumniverse/achievements",
    //           public_id: `${userId}-achievement-${idx}`,
    //           resource_type: "image",
    //         });

    //         return {
    //           ...ach,
    //           image: result.secure_url,
    //         };
    //       } catch (err) {
    //         console.error(`Error uploading achievement image ${idx}:`, err);
    //         return ach;
    //       }
    //     }

    //     return ach;
    //   })
    // );
    let imageIndex = 0;

    const updatedAchievements = await Promise.all(
      achievements.map(async (ach) => {
        // Skip if the achievement already has a Cloudinary image URL
        if (ach.image && ach.image.includes("cloudinary.com")) {
          return ach;
        }

        // Only use an image if we still have one available
        if (imageIndex < achievementImages.length) {
          const imageFile = achievementImages[imageIndex];
          imageIndex++; // Increment for the next achievement that needs an image

          if (imageFile) {
            try {
              const result = await cloudinary.uploader.upload(imageFile.path, {
                folder: "alumniverse/achievements",
                public_id: `${userId}-achievement-${imageIndex - 1}`, // Use correct index in the file name
                resource_type: "image",
              });

              return {
                ...ach,
                image: result.secure_url,
              };
            } catch (err) {
              console.error(
                `Error uploading achievement image ${imageIndex - 1}:`,
                err
              );
              return ach;
            }
          }
        }

        return ach;
      })
    );

    achievements = updatedAchievements;

    // Prepare updated data object with the Cloudinary URLs
    const updatedData = {
      fullName,
      role,
      graduationYear,
      branch,
      jobTitle,
      company,
      location,
      bio,
      profileImage: profileImageUrl, // Updated with Cloudinary URL
      linkedIn,
      resume: resumeUrl, // Updated with Cloudinary URL
      experiences,
      education,
      skills,
      achievements,
      isProfileComplete: true,
      updatedAt: new Date(),
    };
    console.log(updatedData);

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Send the updated user profile in the response
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile",
    });
  }
};
