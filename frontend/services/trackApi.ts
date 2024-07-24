import { PageTrackList, TrackListRequestParams, TrackRecommendRequestParams } from "@/interfaces/tracks/TrackList";
import JobStatus, { IJobStatus } from "@/models/jobStatus";
import { ITrack } from "@/models/tracks";
import { axiosWithAuth } from "@/services/baseAxiosInstance";
import { AudioSearchParams } from "@/types/common";

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

export const getRecommendTracks = async (params: TrackRecommendRequestParams): Promise<ITrack[]> => {
  const axiosInstance = axiosWithAuth();
  try {
    const response = await axiosInstance.get<ITrack[]>(`${CONTROLLER_PATH}/recommend`, { params });
    return response.data;
  } catch (error) {
    console.error('Failed to get recommend tracks:', error);
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
}: AudioSearchParams): Promise<JobStatus> => {
  const axiosInstance = axiosWithAuth();
  try {
    const response = await axiosInstance.post<IJobStatus>(`${CONTROLLER_PATH}/analyze`, {
      analyze: { 
        filename,
        extensions,
        isAllTracks,
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

export const startAudioAnalyzeGenre = async (ids: number[]): Promise<JobStatus> => {
  const axiosInstance = axiosWithAuth();
  try {
    const response = await axiosInstance.post<IJobStatus>(`${CONTROLLER_PATH}/analyze_genre`, { 
      genres: {
        ids: ids,
        analyze_type: 'ids',
      }
    });
    return new JobStatus(response.data);
  } catch (error) {
    console.error('Failed to fetch audio directory:', error);
    throw error;
  }
}

export const startAudioAnalyzeGenreBySearch = async (params: TrackListRequestParams): Promise<JobStatus> => {
  const axiosInstance = axiosWithAuth();
  try {
    const response = await axiosInstance.post<IJobStatus>(`${CONTROLLER_PATH}/analyze_genre`, { 
      genres: {
        filename: params.filename,
        extensions: params.extensions,
        genres: params.genres,
      },
      analyze_type: 'search',
    });
    return new JobStatus(response.data);
  } catch (error) {
    console.error('Failed to fetch audio directory:', error);
    throw error;
  }
}

export const deleteTracks = async (ids: number[]): Promise<void> => {
  const axiosInstance = axiosWithAuth();
  try {
    await axiosInstance.delete(`${CONTROLLER_PATH}/destroy_multiple`, { params: { ids } });
  } catch (error) {
    console.error('Failed to delete audio:', error);
    throw error;
  }
}