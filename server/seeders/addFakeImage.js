const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("../models/User"); // Adjust path as needed

// MongoDB connection
mongoose.connect('mongodb+srv://admin:1@cluster0.yae41.mongodb.net/ClinicManagement?retryWrites=true&w=majority&appName=Cluster0');

// Function to generate fake image URL
const generateFakeImageUrl = () => {
  return faker.image.avatar() // Generates a random avatar URL
};

// Function to update all users with a fake image URL
const addImagesToUsers = async () => {
  try {
    const users = await User.find({});

    // Iterate over each user and update with a fake image URL
    for (let user of users) {
      user.imageUrl = generateFakeImageUrl();
      await user.save();
    }

    console.log(`Successfully updated ${users.length} users with fake images.`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Có lỗi khi cập nhật người dùng với ảnh:", error);
    mongoose.connection.close();
  }
};

// Run the script
addImagesToUsers();
