import "../../style/Blog/Blog.scss";
import Header from "../../components/layout/header";
import { useEffect, useState } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom"; // Import NavLink
import Footer from "../../components/layout/footer";
import { getBlog } from "../../utils/BlogManagement/BlogManagement";

const Blog = () => {
  const [topViewedBlogs, setTopViewedBlogs] = useState([]); // Top viewed blogs
  const [selectedCategory, setSelectedCategory] = useState("Tất cả"); // Set initial category to "Tất cả"
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Function to handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate(`/tin-tuc/`, { state: { selectedCategory: category } });
  };

  // Function to fetch the top viewed blogs
 // Function to fetch the top viewed blogs
const fetchTopViewedBlogs = async () => {
  try {
    setIsLoading(true); // Start loading
    const response = await getBlog();
    if (response && response.blogs) {
      // Sort blogs by view count in descending order and take the top 5
      const sortedBlogs = response.blogs
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

      setTopViewedBlogs(sortedBlogs); // Update state with top 5 blogs
    }
  } catch (error) {
    console.error("Error fetching top viewed blogs:", error);
  } finally {
    setIsLoading(false); // Stop loading
  }
};


  useEffect(() => {
    fetchTopViewedBlogs();
  }, []); // Fetch blogs when the component mounts

  return (
    <>
      <Header />
      <section className="banner">
        <div className="overlay"></div>
        <h1>Y TẾ SỐ 4.0</h1>
      </section>

      <main className="main-content">
        <Outlet context={{ selectedCategory }} /> {/* Pass selectedCategory to Outlet */}

        <aside className="sidebar-blog">
          <section className="categories">
            <p>Danh Mục</p>
            <ul>
              {/* Category buttons */}
              {["Tất cả", "Sức khỏe", "Dinh dưỡng", "Tập luyện", "Tin tức", "Hỗ trợ"].map((category) => (
                <li key={category}>
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className={`category-link ${selectedCategory === category ? "active" : ""}`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="most-viewed">
  <span>Xem nhiều nhất</span>
  {isLoading ? ( // Display loading spinner if data is loading
    <div className="loading">Đang tải...</div>
  ) : (
    topViewedBlogs.map((blog, index) => (
      <div
        key={index}
        className="most-blog"
        onClick={() => navigate(`/tin-tuc/bai-viet/${blog._id}`)}
      >
        <div className="most-viewed-img">
          <img
            src={
              blog.content &&
              Array.isArray(blog.content) &&
              blog.content[0]?.image
                ? blog.content[0].image
                : "path_to_default_image.png"
            }
            alt="Most Viewed"
          />
        </div>
        <div className="most-viewed-info">
          <p className="title">{blog.title || "Không rõ tiêu đề"}</p>
          <p className="view">{blog.views || 0} lượt xem</p>
        </div>
      </div>
    ))
  )}
</section>

        </aside>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
