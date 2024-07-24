import SetList, { ISetList, NewSetListRequestParams, EditSetlistRequestProps } from "@/models/setlists";
import { axiosWithAuth } from "@/services/baseAxiosInstance";

const CONTROLLER_PATH = '/setlists';

export const getSetList = async (id: number): Promise<SetList> => {
  const axiosInstance = axiosWithAuth();
  try {
    const response = await axiosInstance.get<ISetList>(`${CONTROLLER_PATH}/${id}`);
    return new SetList(response.data);
  } catch (error) {
    console.error('Failed to get setlist:', error);
    throw error;
  }
}

export const getSetLists = async (): Promise<SetList[]> => {
  const axiosInstance = axiosWithAuth();
  try {
    const response = await axiosInstance.get<ISetList[]>(CONTROLLER_PATH);
    return response.data?.map((s) => new SetList(s)) || [];
  } catch (error) {
    console.error('Failed to get setlists:', error);
    throw error;
  }
}

export const createSetList = async (setlist: NewSetListRequestParams): Promise<void> => {
  const axiosInstance = axiosWithAuth();
  try {
    await axiosInstance.post(CONTROLLER_PATH, { setlist });
  } catch (error) {
    console.error('Failed to create setlist:', error);
    throw error;
  }
}

export const updateSetList = async (setlist: EditSetlistRequestProps): Promise<void> => {
  const axiosInstance = axiosWithAuth();
  try {
    await axiosInstance.put(`${CONTROLLER_PATH}/${setlist.id}`, { setlist });
  } catch (error) {
    console.error('Failed to update setlist:', error);
    throw error;
  }
}

export const deleteSetList = async (id: number): Promise<void> => {
  const axiosInstance = axiosWithAuth();
  try {
    await axiosInstance.delete(`${CONTROLLER_PATH}/${id}`);
  } catch (error) {
    console.error('Failed to delete setlist:', error);
    throw error;
  }
}