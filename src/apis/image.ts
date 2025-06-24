import type { MetaData } from "../pages/ImageDetailsPage";
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

export const saveAllMetaDataByImageId = async (image_Id: string, metaData: MetaData[]) => {
  const response = await axios.put(`${BASE_URL}/api/metaData/${image_Id}`, {
    metaData: metaData,
  });
  return response;
};

export const getMetaDataByImageId = async (image_Id: string) => {
  const response = await axios.get(`${BASE_URL}/api/metadata/${image_Id}`);
  return response;
};

export const updateImagePathByImageId = async (image_id: string, path: string) => {
  const response = await axios.post(`${BASE_URL}/api/images-path/${image_id}`, {
    path: path,
  });
  return response;
};

export const getImagePath = async (image_id: string) => {
  const response = await axios.get(`${BASE_URL}/api/path/${image_id}`);
  return response;
};
