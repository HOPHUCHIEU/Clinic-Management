import React, { useEffect, useState } from "react";
import { Button, Table, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import AddBlogModal from "../../components/admin/BlogAdmin/AddBlogModal";
import EditBlogModal from "../../components/admin/BlogAdmin/EditBlogModal";
import DeleteBlogModal from "../../components/admin/BlogAdmin/DeleteBlogModal";
import { getBlog, deleteBlog } from "../../utils/BlogManagement/BlogManagement";
import { toast, ToastContainer } from "react-toastify";
import "../../style/adminStyle/blogAdmin.scss";
import "react-toastify/dist/ReactToastify.css";

const BlogAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const blogsPerPage = 8; // Số bài viết mỗi trang

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getBlog();
      if (data?.blogs) {
        setBlogs(data.blogs);
      } else {
        throw new Error("Dữ liệu blogs không hợp lệ");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error.message);
      setError("Không thể lấy dữ liệu bài viết.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowEditModal = (blog) => {
    setSelectedBlog(blog);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleShowDeleteModal = (blog) => {
    setSelectedBlog(blog);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleSave = async (newBlog) => {
    setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
    await fetchBlogs();
    handleCloseModal();
  };

  const handleSaveEdit = (updatedBlog) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog._id === updatedBlog._id ? updatedBlog : blog
      )
    );
    handleCloseEditModal();
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Đang xóa bài viết...");
    try {
      await deleteBlog(selectedBlog._id);
      setBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id !== selectedBlog._id)
      );

      toast.update(toastId, {
        render: `Bài viết "${selectedBlog.title}" đã được xóa thành công!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error during delete:", error);
      toast.update(toastId, {
        render: "Không thể xóa bài viết.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset về trang đầu khi tìm kiếm
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog?.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog?.content.some((content) =>
        content.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const startIndex = currentPage * blogsPerPage;
  const displayedBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + blogsPerPage
  );

  const pageCount = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handlePageChange = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="primary" onClick={handleShowModal}>
          Thêm Bài viết
        </Button>
        <div style={{ maxWidth: "300px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <Table striped bordered hover responsive>
        <thead className="thead-light">
          <tr>
            <th>Tiêu đề</th>
            <th>Danh mục</th>
            <th>Nội dung</th>
            <th>Tác giả</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center">
                <Spinner animation="border" variant="primary" /> Đang tải dữ
                liệu...
              </td>
            </tr>
          ) : displayedBlogs.length > 0 ? (
            displayedBlogs.map((blog) => (
              <tr key={blog._id}>
                <td>
                  <a
                    href={`/tin-tuc/bai-viet/${blog._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {blog?.title || "Không xác định"}
                  </a>
                </td>
                <td>
                  {Array.isArray(blog?.category)
                    ? blog.category.join(", ")
                    : "Không xác định"}
                </td>
                <td
                  style={{
                    maxWidth: "300px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {blog?.content[0]?.text || "Không có nội dung"}
                </td>
                <td>{blog?.author_name || "Không rõ"}</td>
                <td>
                  {blog?.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString("vi-VN")
                    : "N/A"}
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleShowEditModal(blog)}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleShowDeleteModal(blog)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Không có bài viết nào
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <ReactPaginate
        previousLabel={"Lùi"}
        nextLabel={"Tiếp"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageChange}
        containerClassName={"pagination_blog"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
      <AddBlogModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
      {selectedBlog && (
        <EditBlogModal
          show={showEditModal}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
          blog={selectedBlog}
        />
      )}
      {selectedBlog && (
        <DeleteBlogModal
          show={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onDelete={handleDelete}
          blogTitle={selectedBlog.title || "Không xác định"}
        />
      )}
    </div>
  );
};

export default BlogAdmin;
