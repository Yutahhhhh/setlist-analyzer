import { axiosWithAuth } from "@/services/baseAxiosInstance";
import JobStatus, { IJobStatus } from "@/models/jobStatus";

const CONTROLLER_PATH = '/genre_trains';

export const postTrainGenre = async (retrain: boolean): Promise<JobStatus> => {
  const axiosInstance = axiosWithAuth();
  try {
    const response = await axiosInstance.post<IJobStatus>(CONTROLLER_PATH, { retrain });
    return new JobStatus(response.data);
  } catch (error) {
    throw error;
  }
}