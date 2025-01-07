import axios from "../../config/axios.customize";

const getBlog = () => {
  return axios.get(`/api/blog/get-all-blogs`);
};

const createBlog = (data) => {
  return axios.post(`/api/blog/create-blog`, data);
};

const updateBlog = (id, data) => {
  return axios.put(`/api/blog/update-blog-by-id/${id}`, data);
};

const deleteBlog = (id) => {
  return axios.delete(`/api/blog/delete-blog-by-id/${id}`);
};
const updateViewBlog=(id)=>{
  return axios.post(`/api/blog/increment-views/${id}`);
}
const getBlogById=(id)=>{
  return axios.get(`/api/blog/get-blog-by-id/${id}`);
};
const getBlogByCategory = (category) => {
  return axios.post('/api/blog/tin-tuc/the-loai', { category: category });
};
export { getBlog, createBlog, updateBlog, deleteBlog,updateViewBlog,getBlogById,getBlogByCategory };
