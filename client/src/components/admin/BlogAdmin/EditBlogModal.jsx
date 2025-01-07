import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateBlog } from "../../../utils/BlogManagement/BlogManagement";

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const EditBlogModal = ({ show, onClose, onSave, blog }) => {
  const [editedBlog, setEditedBlog] = useState({
    title: "",
    category: [],
    content: [],
    author_name: "",
    summary: "",
  });

  useEffect(() => {
    if (blog) {
      setEditedBlog({ ...blog });
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setEditedBlog((prev) => ({ ...prev, category: selectedOptions }));
  };

  const handleContentChange = (index, field, value) => {
    const updatedContent = [...editedBlog.content];
    updatedContent[index][field] = value;
    setEditedBlog((prev) => ({ ...prev, content: updatedContent }));
  };

  const handleImageChange = async (index, file) => {
    const base64Image = await convertToBase64(file);
    handleContentChange(index, "image", base64Image);
  };

  const handleAddContent = () => {
    setEditedBlog((prev) => ({
      ...prev,
      content: [
        ...prev.content,
        { text: "", image: "", image_description: "" },
      ],
    }));
  };

  const handleRemoveContent = (index) => {
    const updatedContent = [...editedBlog.content];
    updatedContent.splice(index, 1);
    setEditedBlog((prev) => ({ ...prev, content: updatedContent }));
  };

  const handleSave = async () => {
    // Kiểm tra các trường bắt buộc
    if (
      !editedBlog.title?.trim() ||
      !editedBlog.category.length ||
      !editedBlog.author_name?.trim() ||
      !editedBlog.summary?.trim()
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin cần thiết!");
      return;
    }
  
    try {
      // Gọi API cập nhật
      await updateBlog(editedBlog._id, editedBlog);
      toast.success("Bài viết đã được cập nhật thành công!");
      onSave(editedBlog);
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Không thể cập nhật bài viết. Vui lòng thử lại.");
    }
  };
  
  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa Bài viết</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Tiêu đề</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tiêu đề"
              name="title"
              value={editedBlog.title || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formCategory">
            <Form.Label>Danh mục</Form.Label>
            <Form.Select
              name="category"
              value={editedBlog.category[0] || ""} // Chỉ hiển thị danh mục đầu tiên
              onChange={(e) =>
                setEditedBlog((prev) => ({
                  ...prev,
                  category: [e.target.value],
                }))
              }
            >
              <option value="">Chọn danh mục</option>
              {["Sức khỏe", "Dinh dưỡng", "Tập luyện", "Tin tức"].map(
                (category, idx) => (
                  <option key={idx} value={category}>
                    {category}
                  </option>
                )
              )}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formSummary">
            <Form.Label>Tóm tắt</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập tóm tắt"
              name="summary"
              value={editedBlog.summary || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formAuthor">
            <Form.Label>Tác giả</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên tác giả"
              name="author_name"
              value={editedBlog.author_name || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Label>Nội dung</Form.Label>
          {editedBlog.content.map((item, index) => (
            <div key={index} className="mb-3 border p-3 rounded">
              <Row>
                <Col md={12} className="mb-2">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Nhập nội dung"
                    value={item.text || ""}
                    onChange={(e) =>
                      handleContentChange(index, "text", e.target.value)
                    }
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="file"
                    onChange={(e) =>
                      handleImageChange(index, e.target.files[0])
                    }
                  />
                  {item.image && (
                    <img
                      src={item.image}
                      alt={`Content ${index + 1}`}
                      className="img-thumbnail mt-2"
                      style={{ maxHeight: "100px" }}
                    />
                  )}
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="text"
                    placeholder="Nhập mô tả ảnh"
                    value={item.image_description || ""}
                    onChange={(e) =>
                      handleContentChange(
                        index,
                        "image_description",
                        e.target.value
                      )
                    }
                    className="mt-2"
                  />
                </Col>
              </Row>
              <Button
                variant="danger"
                size="sm"
                className="mt-2"
                onClick={() => handleRemoveContent(index)}
              >
                Xóa nội dung
              </Button>
            </div>
          ))}
          <Button variant="success" onClick={handleAddContent}>
            Thêm nội dung
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Lưu thay đổi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

EditBlogModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  blog: PropTypes.object,
};

export default EditBlogModal;
