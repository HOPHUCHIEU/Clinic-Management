const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    category: {
      type: [String],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true, // Tóm tắt bài viết
    },
   
    author_name: {
      type: String,
      required: true, // Tên tác giả
    },
    content: {
      type: [
        {
          image: {
            type: String, // URL của ảnh trong phần nội dung
          },
          image_description: {
            type: String, // Mô tả ảnh
          },
          text: {
            type: String, // Nội dung văn bản
          },
        },
      ],
      required: true,
    },
    views: {
      type: Number,
      default: 0, // Giá trị mặc định là 0
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Blog", blogSchema);
