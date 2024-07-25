import { axiosWithAuth, axiosAudio } from "@/services/baseAxiosInstance";
import { PageTrackList } from "@/interfaces/tracks";
import { AudioSearchParams } from "@/types/common";

const CONTROLLER_PATH = '/audios';

export const findAudioUrl = async (path: string): Promise<string> => {
  const axiosAudioInstance = axiosAudio();
  try {
    const response = await axiosAudioInstance.get(`${CONTROLLER_PATH}/find_audio`, {
      responseType: 'blob',
      params: {
        path
      }
    });
    const blob = new Blob([response.data], { type: "audio/mpeg" });
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Failed to fetch audio:', error);
    throw error;
  }
};

export const downloadTracks = async (files: string[]): Promise<string> => {
  const axiosInstance = axiosAudio();
  try {
    const response = await axiosInstance.get(`${CONTROLLER_PATH}/download`, {
      responseType: 'blob',
      params: { files }
    });

    return URL.createObjectURL(new Blob([response.data]));
  } catch (error) {
    console.error('Failed to download tracks:', error);
    throw error;
  }
}

export const getAudios = async ({
  filename,
  extensions,
  isAllTracks
}: AudioSearchParams): Promise<PageTrackList> => {
  const axiosInstance = axiosWithAuth();
  try {
    const response = await axiosInstance.get<PageTrackList>(CONTROLLER_PATH, {
      params: { 
        filename,
        extensions,
        isAllTracks
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch audio directory:', error);
    throw error;
  }
};