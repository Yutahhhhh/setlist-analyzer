import { axiosWithAuth, axiosAudio } from "@/services/baseAxiosInstance";
import { PageTrackList, TrackListRequestParams } from "@/interfaces/tracks";

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

export const getAudios = async ({
  page,
  per,
  filename,
  extensions,
  isAllTracks
}: TrackListRequestParams): Promise<PageTrackList> => {
  const axiosInstance = axiosWithAuth();
  try {
    const response = await axiosInstance.get<PageTrackList>(CONTROLLER_PATH, {
      params: { 
        page,
        per,
        filename,
        extensions,
        is_all_tracks: isAllTracks,
      },
    });
    console.info('Fetched audio directory:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch audio directory:', error);
    throw error;
  }
};