import "../../style/Blog/BlogList.scss";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Import NavLink and useNavigate
import { getBlogByCategory } from "../../utils/BlogManagement/BlogManagement";
import { useLocation } from "react-router-dom"; // Import useLocation để lấy state từ route
import {
  getBlog,
  updateViewBlog,
} from "../../utils/BlogManagement/BlogManagement"; // Import updateViewBlog
import "../../style/Blog/BlogList.scss";

const BlogList = () => {
  const location = useLocation(); // Sử dụng useLocation để lấy state
  const selectedCategory = location.state?.selectedCategory || "Tất cả"; // Ensure state exists

  const [blogData, setBlogData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch blogs based on the selected category
  const fetchBlogData = async () => {
    if (!selectedCategory) {
      console.error("Selected category is invalid");
      return;
    }

    try {
      setIsLoading(true); // Start loading

      if (selectedCategory === "Tất cả") {
        const response = await getBlog();
        if (response && response.blogs) {
          setBlogData(response.blogs);
        }
      } else {
        const response = await getBlogByCategory(selectedCategory);
        if (response && response.blogs) {
          setBlogData(response.blogs);
        }
      }
    } catch (error) {
      console.log("Error fetching blogs:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleArticleClick = async (id) => {
    try {
      // Increment views of the blog before navigation
      await updateViewBlog(id); // Call the updateViewBlog function
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };

  useEffect(() => {
    console.log("selectedCategory:", selectedCategory); // Debugging state
    fetchBlogData();
  }, [selectedCategory]); // Fetch again if selectedCategory changes

  return (
    <section className="articles">
      {isLoading ? (
        <div className="loading">Đang tải bài viết...</div> // Show loading text or spinner
      ) : blogData.length > 0 ? (
        blogData.map((blog, index) => {
          const imageSrc =
            blog.content?.[0]?.image || "path_to_default_image.png";

          return (
            <NavLink
              to={`/tin-tuc/bai-viet/${blog._id}`}
              key={index}
              onClick={() => handleArticleClick(blog._id)} // Call the function on click
            >
              <article className="article">
                <img src={imageSrc} alt="Article" />
                <div className="article-content">
                  <div className="title">
                    <p className="p1">
                      {blog.category?.join(", ") || "Không rõ danh mục"}
                    </p>
                    <p className="p2">{blog.title || "Không rõ tiêu đề"}</p>
                    <p className="p3">
                      {blog.author_name || "Tác giả ẩn danh"} |{" "}
                      {blog.views || 0} lượt xem
                    </p>
                  </div>
                  <p className="p4">{blog.summary || "Không có mô tả"}</p>
                </div>
              </article>
            </NavLink>
          );
        })
      ) : (
        <p>Không có bài viết nào phù hợp.</p>
      )}
    </section>
  );
};

export default BlogList;
