import SetList, { ISetList } from "@/models/setlists";
import { axiosWithAuth } from "@/services/baseAxiosInstance";

const CONTROLLER_PATH = '/setlists';

export const getSetlists = async (): Promise<SetList[]> => {
  const axiosInstance = axiosWithAuth();
  try {
    const response = await axiosInstance.get<ISetList[]>(CONTROLLER_PATH);
    return response.data.map((s) => new SetList(s));
  } catch (error) {
    console.error('Failed to get setlists:', error);
    throw error;
  }
}