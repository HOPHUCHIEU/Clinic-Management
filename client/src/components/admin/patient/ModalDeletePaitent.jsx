import PropTypes from "prop-types"; // Import PropTypes
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { deletedUser } from "../../../utils/AuthAPI/AdminService";
import {  toast,ToastContainer } from 'react-toastify';

const ModalDeleteUser = (props) => {
  const { showDeleteModal, setShowDeleteModal, selectedUser, fetchPatients } = props;
  
  // Đóng modal
  const handleClose = () => setShowDeleteModal(false); // Sửa lại hàm này

  // Hàm xử lý xóa người dùng
  const handleDeleteUser = async(userID) => {
    try{
      setShowDeleteModal(false);
        await deletedUser(userID);
        await fetchPatients(1);
        toast.success("Xóa người dùng thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        toast.error("Xóa người dùng thất bại!");
      }
    }
    
  return (
    <>
    <Modal show={showDeleteModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xóa người dùng</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Bạn có chắc chắn muốn xóa người dùng {selectedUser?.first_name} {selectedUser?.last_name} không?
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button
          variant="danger"
          onClick={() => handleDeleteUser(selectedUser?._id)}
        >
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
      <ToastContainer></ToastContainer>
     
      </>
  );
};


// Define propTypes to validate the props passed to the component
ModalDeleteUser.propTypes = {
  showDeleteModal: PropTypes.bool.isRequired, // show should be a boolean and is required
  setShowDeleteModal: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  fetchPatients: PropTypes.func.isRequired,
  // setShow should be a function and is required
};

export default ModalDeleteUser;
