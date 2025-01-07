import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Form, Button } from "react-bootstrap";
import { createBlog } from "../../../utils/BlogManagement/BlogManagement";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper function to convert a file to Base64
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => { 
      reject(error);
    };
  });
};

const AddBlogModal = ({ show, onClose, onSave }) => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    category: [],
    summary: "",
    author_name: "",
    content: [
      {
        image: "",
        image_description: "",
        text: "",
      },
    ],
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      // Update content section
      setNewBlog((prev) => {
        const updatedContent = [...prev.content];
        if (updatedContent[index]) {
          updatedContent[index][name] = value;
        }
        return { ...prev, content: updatedContent };
      });
    } else if (name === "category") {
      // Ensure category is always a single-element array
      setNewBlog((prev) => ({ ...prev, category: [value] }));
    } else {
      setNewBlog((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const base64Image = await convertToBase64(file);
      setNewBlog((prev) => {
        const updatedContent = [...prev.content];
        updatedContent[index].image = base64Image;
        return { ...prev, content: updatedContent };
      });
    }
  };

  const handleAddContent = () => {
    setNewBlog((prev) => ({
      ...prev,
      content: [
        ...prev.content,
        {
          image: "",
          image_description: "",
          text: "",
        },
      ],
    }));
  };

  const handleSave = async () => {
    try {
      console.log("Saving blog with data:", newBlog);
      const createdBlog = await createBlog(newBlog);
      console.log("API response:", createdBlog);

      if (createdBlog) {
        onSave(createdBlog  .blog);
        toast.success("Bài viết đã được tạo thành công!");
        onClose();
        setNewBlog({
          title: "",
          category: [],
          summary: "",
          author_name: "",
          content: [
            {
              image: "",
              image_description: "",
              text: "",
            },
          ],
        });
      } else {
        throw new Error("Dữ liệu bài viết không hợp lệ nhận được");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Tạo bài viết thất bại.");
    }
  };

  return (
    <>
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Bài viết Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tiêu đề"
                name="title"
                value={newBlog.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formCategory">
              <Form.Label>Danh mục</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={newBlog.category[0] || ""}
                onChange={handleChange}
              >
                <option value="">Chọn danh mục</option>
                <option value="Sức khỏe">Sức khỏe</option>
                <option value="Dinh dưỡng">Dinh dưỡng</option>
                <option value="Tập luyện">Tập luyện</option>
                <option value="Tin tức">Tin tức</option>
                <option value="Hỗ trợ">Hỗ trợ</option>

              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formSummary">
              <Form.Label>Tóm tắt</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tóm tắt"
                name="summary"
                value={newBlog.summary}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formAuthor">
              <Form.Label>Tên tác giả</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên tác giả"
                name="author_name"
                value={newBlog.author_name}
                onChange={handleChange}
              />
            </Form.Group>

            {newBlog.content.map((contentItem, index) => (
              <div key={index} className="mb-3">
                <Form.Group controlId={`formContentImage_${index}`}>
                  <Form.Label>Hình ảnh nội dung {index + 1}</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => handleImageChange(e, index)}
                  />
                  {contentItem.image && (
                    <img
                      src={contentItem.image}
                      alt={`Hình ảnh ${index + 1}`}
                      className="img-thumbnail mt-2"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Form.Group>
                <Form.Group controlId={`formImageDescription_${index}`}>
                  <Form.Label>Mô tả hình ảnh {index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập mô tả hình ảnh"
                    name="image_description"
                    value={contentItem.image_description}
                    onChange={(e) => handleChange(e, index)}
                  />
                </Form.Group>
                <Form.Group controlId={`formText_${index}`}>
                  <Form.Label>Nội dung {index + 1}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Nhập nội dung"
                    name="text"
                    value={contentItem.text}
                    onChange={(e) => handleChange(e, index)}
                  />
                </Form.Group>
              </div>
            ))}
            <Button variant="link" onClick={handleAddContent}>
              Thêm nội dung (+)
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    
    </>
  );
};

AddBlogModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AddBlogModal;
