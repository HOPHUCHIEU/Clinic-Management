import "../../style/userProfile/profileInfo.scss";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserById, editUser } from "../../utils/AuthAPI/userService";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

const ContentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    gender: "",
    birthdate: "",
    email: "",
    imageUrl: "",
  });

  const fetchUser = async () => {
    try {
      const token = Cookies.get("access_token");
      const role = Cookies.get("role");
      if (!token) {
        toast.error("Không tìm thấy token.");
        return;
      }

      // Decode the token to extract the user ID
      const decodedToken = jwt_decode(token);
      const userId = decodedToken._id;
      const data = await getUserById(userId, role);
      console.log(data);
      if (data && data.user) {
        // Ensure data.users exists
        setProfile(data.user);
      } else {
        toast.error("Không thể tải bệnh nhân");
      }
    } catch (error) {
      console.error("Error fetching users by role:", error);
      toast.error("Lỗi khi kết nối tới server.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []); // Empty dependency array to run once on mount

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleUpdateClick = async () => {
    const { first_name, last_name, phone, birthdate, email, address } = profile;

    // Basic validations
    if (
      !first_name ||
      !last_name ||
      !phone ||
      !birthdate ||
      !email ||
      !address
    ) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    if (phone.length > 11 || !/^\d+$/.test(phone)) {
      toast.error("Số điện thoại phải là số và không quá 11 ký tự.");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
      toast.error("Ngày sinh phải có định dạng YYYY-MM-DD.");
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Email không hợp lệ.");
      return;
    }

    // Additional validation for address
    if (!address) {
      toast.error("Vui lòng nhập địa chỉ.");
      return;
    }

    try {
      const userID = jwt_decode(Cookies.get("access_token"))._id;
      const res = await editUser(userID, profile);
      setProfile(res.user);
      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Lỗi khi kết nối tới server.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && value.length > 11) {
      toast.error("Số điện thoại không được quá 11 ký tự.");
      return;
    }

    setProfile({ ...profile, [name]: value });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleUpdateClick();
    }
  };
  const role = Cookies.get("role"); // Lấy vai trò từ cookie

  return (
    <main className="content">
      <div className="profile">
        <div className="profile-content">
          {isEditing ? (
            <div className="profile-details">
              <h2 className="text-xl font-bold mb-4">Điều chỉnh thông tin</h2>
              <form className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">
                    Họ và tên <span className="text-red-500 ">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Họ"
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Tên"
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    maxLength="11"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    value={profile.birthdate}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">
                    Giới tính <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex mb-2 items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={profile.gender === "Male"}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                        className="mr-2"
                      />
                      Nam
                    </label>
                    <label className="flex mb-2 items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={profile.gender === "Female"}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                        className="mr-2"
                      />
                      Nữ
                    </label>
                  </div>
                </div>
                <div>
                  <label className=" block mb-2 font-medium">
                    Địa chỉ cụ thể
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Email</label>
                  <input
                    type="text"
                    name="email"
                    value={profile.email}
                    readOnly // Ngăn không cho người dùng chỉnh sửa
                    title="Không thể thay đổi email" 
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex mt-3 justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="py-2 px-4 bg-gray-200 text-gray-700 rounded"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateClick}
                    className="py-2 px-4 bg-blue-500 text-white rounded"
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="profile-details">
              <div className="profile-header flex items-center mb-4">
                <div className="profile-avatar w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">
                  <div className="profile-avatar w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">
                    {role === "doctor" ? (
                      <img
                        src={`data:image/png;base64,${profile.imageUrl}`}
                        alt="Avatar"
                        className="image-profile-doctor  rounded-full "
                      />
                    ) : (
                      `${profile.first_name.charAt(
                        0
                      )}${profile.last_name.charAt(0)}`.toUpperCase()
                    )}
                  </div>
                </div>
                <div className="profile-info ml-4">
                  <div className="profile-name font-bold">
                    {profile.first_name} {profile.last_name}
                  </div>
                  {/* <div className="profile-id text-gray-500">Mã BN: {profile._id}</div> */}
                </div>
              </div>
              <div className="profile-warning mb-4 text-red-500">
                Hoàn thiện thông tin để đặt khám và quản lý hồ sơ y tế được tốt
                hơn.
              </div>
              <div className="profile-section mb-4">
                <div className="section-title font-bold mb-2">
                  Thông tin cơ bản
                </div>
                <div className="section-content grid grid-cols-2 gap-4">
                  <div>Họ và tên</div>
                  <div>
                    {profile.first_name} {profile.last_name}
                  </div>
                  <div>Điện thoại</div>
                  <div>{profile.phone}</div>
                  <div>Ngày sinh</div>
                  <div>{profile.birthdate}</div>
                  <div>Giới tính</div>
                  <div>{profile.gender}</div>
                  <div>Địa chỉ</div>
                  <div>{profile.address}</div>
                </div>
              </div>
              <div className="profile-section mb-4">
                <div className="section-title font-bold mb-2">
                  Thông tin bổ sung
                </div>
                <div className="section-content grid grid-cols-2 gap-4">
                  <div>Email</div>
                  <div>{profile.email}</div>
                </div>
                {role === "doctor" && (
                  <div className="section-content grid grid-cols-2 gap-4">
                    <div className="experience">Kinh nghiệm</div>
                    <div className="display-experience">
                      {profile.experience}
                    </div>
                    <div>Chuyên khoa</div>
                    <div className="list-chuyenkhoa">
                      {Array.isArray(profile.specialties) ? (
                        profile.specialties.map((specialty, index) => (
                          <li key={index}>{specialty}</li>
                        ))
                      ) : (
                        <p>Không có chuyên khoa</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {role !== "doctor" && (
                <button
                  onClick={handleEditClick}
                  className="edit-profile-btn py-2 px-4 bg-blue-500 text-white rounded"
                >
                  Thay đổi thông tin
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ContentProfile;
