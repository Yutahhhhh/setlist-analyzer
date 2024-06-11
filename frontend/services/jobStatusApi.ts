import JobStatus, { IJobStatus } from "@/models/jobStatus";
import { axiosWithAuth } from "@/services/baseAxiosInstance";

const CONTROLLER_PATH = '/job_statuses';

export const getAllJobs = async (): Promise<JobStatus[]> => {
  const axiosInstance = axiosWithAuth();
  try {
    const response = await axiosInstance.get<IJobStatus[]>(CONTROLLER_PATH);
    return response.data.map((j) => new JobStatus(j));
  } catch (error) {
    throw error;
  }
}