import axios, { BASE_URL } from "./axios.global";

export const uploadImage = async (file: FormData) => {
  const response = await axios.post(`${BASE_URL}/api/image`, file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const getAllImages = async () => {
  const response = await axios.get(`${BASE_URL}/api/all-images`);
  return response;
};

export const getImageById = async (image_id: string) => {
  const response = await axios.get(`${BASE_URL}/api/${image_id}`);
  return response;
};
