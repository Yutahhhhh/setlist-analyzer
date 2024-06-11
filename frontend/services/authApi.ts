import { axiosWithAuth } from "@/services/baseAxiosInstance";

const CONTROLLER_PATH = '/auth';

export const createSession = async (): Promise<void> => {
  const axiosInstance = axiosWithAuth();
  try {
    await axiosInstance.post(`${CONTROLLER_PATH}/sign_in`);
  } catch (error) {
    throw error;
  }
};