import axioi from "../config/axios.customize";

export const getAllServices = async (page, limit) => {
  return await axioi.get(
    `/api/services/all-services?page=${page}&limit=${limit}`
  );
};

export const addNewService = async (serviceData) => {
  return await axioi.post("/api/services/create-services", serviceData);
};

export const deleteService = async (serviceId) => {
  return await axioi.delete(`/api/services/delete-services/${serviceId}`);
};

export const updateService = async (serviceId, serviceData) => {
  return await axioi.put(
    `/api/services/update-services/${serviceId}`,
    serviceData
  );
};
