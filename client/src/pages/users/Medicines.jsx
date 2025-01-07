// import React, { useState, useEffect } from "react";
// import ReactPaginate from "react-paginate";
// import axios from "axios";
// import "../../style/Medicines/Medicines.scss";

// const MedicinesList = () => {
//   const [medicines, setMedicines] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);

//   const limit = 7;

//   // Fetch medicines function
//   const fetchMedicines = async (page = 1) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8000/api/medicines/all-medicines?page=${page}&limit=${limit}&search=${searchKeyword}`
//       );
//       console.log(response.data);
//       if (response.data.success) {
//         setMedicines(response.data.medicines);
//         setTotalPages(response.data.totalPages);
//         setCurrentPage(response.data.currentPage);
//       } else {
//         console.error("Failed to fetch medicines:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching medicines:", error);
//     }
//   };

//   // Effect to fetch data when the page changes
//   useEffect(() => {
//     fetchMedicines(currentPage);
//   }, [currentPage]);

//   // Handle pagination click
//   const handlePageClick = (data) => {
//     const selectedPage = data.selected + 1; // ReactPaginate pages are 0-indexed
//     setCurrentPage(selectedPage);
//   };

//   return (
//     <div>
//       {/* <h1>Medicines</h1> */}
//       {medicines.length > 0 ? (
//         <ul className="product_grid">
//           {medicines.map((medicine) => (
//             <div className="product_card" key={medicine._id}>
//               <img
//                 src={medicine.medicalImage}
//                 alt={medicine.name}
//                 className="product_image"
//               />
//               <h3 className="product_name">{medicine.name}</h3>
//               <p className="product_description">
//                 <strong>Mô tả:</strong> {medicine.description.substring(0, 100)}
//                 ...
//               </p>
//               <p className="product_price">
//                 <strong>Giá:</strong> {medicine.price}đ
//               </p>
//               <a href={`/medicine/${medicine._id}`} className="product_link">
//                 Xem chi tiết
//               </a>
//             </div>
//           ))}
//         </ul>
//       ) : (
//         <p>Không tìm thấy thuốc nào.</p>
//       )}
//       <ReactPaginate
//         previousLabel={"Previous"}
//         nextLabel={"Next"}
//         breakLabel={"..."}
//         pageCount={totalPages}
//         marginPagesDisplayed={2}
//         pageRangeDisplayed={3}
//         onPageChange={handlePageClick}
//         containerClassName={"pagination-container"}
//         pageClassName={"page-item"}
//         pageLinkClassName={"page-link"}
//         previousClassName={"page-item"}
//         previousLinkClassName={"page-link"}
//         nextClassName={"page-item"}
//         nextLinkClassName={"page-link"}
//         breakClassName={"page-item"}
//         breakLinkClassName={"page-link"}
//         activeClassName={"active"}
//       />
//     </div>
//   );
// };

// export default MedicinesList;
