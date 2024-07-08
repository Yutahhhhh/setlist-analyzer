import { PageTrackList, TrackListRequestParams } from "@/interfaces/tracks/TrackList";
import JobStatus, { IJobStatus } from "@/models/jobStatus";
import { axiosWithAuth } from "@/services/baseAxiosInstance";

const CONTROLLER_PATH = '/tracks';

export const getTracks = async (params: TrackListRequestParams): Promise<PageTrackList> => {
  const axiosInstance = axiosWithAuth();
  try {
    const response = await axiosInstance.get<PageTrackList>(CONTROLLER_PATH, { params });
    return response.data;
  } catch (error) {
    console.error('Failed to get tracks:', error);
    throw error;
  }
}

export const getGenres = async (): Promise<string[]> => {
  const axiosInstance = axiosWithAuth();
  try {
    const response = await axiosInstance.get<{ genres: string[] }>(`${CONTROLLER_PATH}/genres`);
    return response.data.genres;
  } catch (error) {
    console.error('Failed to get genres:', error);
    throw error;
  }
}

export const startAudioAnalysis = async ({
  filename,
  extensions,
  isAllTracks
}: TrackListRequestParams): Promise<JobStatus> => {
  const axiosInstance = axiosWithAuth();
  try {
    const response = await axiosInstance.post<IJobStatus>(`${CONTROLLER_PATH}/analyze`, {
      analyze: { 
        filename,
        extensions,
        is_all_tracks: isAllTracks,
      },
    });
    return new JobStatus(response.data);
  } catch (error) {
    console.error('Failed to fetch audio directory:', error);
    throw error;
  }
};

export const startAudioAnalyzeLyrics = async (ids: number[]): Promise<JobStatus> => {
  const axiosInstance = axiosWithAuth();
  try {
    const response = await axiosInstance.post<IJobStatus>(`${CONTROLLER_PATH}/analyze_lyrics`, { 
      lyrics: {
        ids: ids,
        analyze_type: 'ids',
        search_params: {},
      }
    });
    return new JobStatus(response.data);
  } catch (error) {
    console.error('Failed to fetch audio directory:', error);
    throw error;
  }
}

export const startAudioAnalyzeLyricsBySearch = async (params: TrackListRequestParams): Promise<JobStatus> => {
  const axiosInstance = axiosWithAuth();
  try {
    const response = await axiosInstance.post<IJobStatus>(`${CONTROLLER_PATH}/analyze_lyrics`, { 
      lyrics: {
        ids: [],
        search_params: { 
          filename: params.filename,
          extensions: params.extensions,
          genres: params.genres,
        },
        analyze_type: 'search',
      }
    });
    return new JobStatus(response.data);
  } catch (error) {
    console.error('Failed to fetch audio directory:', error);
    throw error;
  }
}

export const destroyAudios = async (ids: number[]): Promise<void> => {
  const axiosInstance = axiosWithAuth();
  try {
    await axiosInstance.delete(`${CONTROLLER_PATH}`, { data: { ids } });
  } catch (error) {
    console.error('Failed to delete audio:', error);
    throw error;
  }
}