const Blog = require("../models/Blog");
exports.createBlog = async (blogData) => {
  try {
    // Tạo blog mới
    const blog = new Blog(blogData);
    await blog.save();
    return {
      success: true,
      data: blog,
      message: "Blog đã được tạo thành công",
    };
  } catch (error) {
    console.error("Lỗi khi tạo blog:", error);
    return {
      success: false,
      message: "Tạo blog thất bại",
      error: error.message,
    };
  }
};

// Get all blogs
exports.getAllBlogs = async () => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return blogs;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách blog: " + error.message);
  }
};

// Get blog by ID
exports.getBlogById = async (id) => {
  try {
    const blog = await Blog.findById(id);
    return blog;
  } catch (error) {
    console.error("Error in blogService - findBlogById:", error);
    throw error; // Ném lỗi để controller xử lý
  }
};

exports.updateBlogById = async (id, updatedData) => {
  try {
    // Find the blog by ID and update it
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: updatedData }, // Update the fields with new data
      { new: true, runValidators: true } // Return the updated blog and validate the input
    );
    return updatedBlog;
  } catch (error) {
    throw new Error(error.message || "Error updating blog");
  }
};

// Delete blog by ID
exports.deleteBlogById = async (id) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) throw new Error("Blog not found");
  } catch (error) {
    throw new Error(`Error deleting blog: ${error.message}`);
  }
};
// Trong service layer
exports.getBlogsByCategory = async (category) => {
  try {
    // Tìm các bài viết có category tương ứng
    return await Blog.find({ category: category });
  } catch (error) {
    throw new Error("Lỗi khi lấy bài viết theo category.");
  }
};
