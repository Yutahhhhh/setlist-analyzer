import axios, { AxiosInstance } from 'axios';

export const axiosWithAuth = (): AxiosInstance => {
  const axiosAuthInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/api',
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true,
  });

  axiosAuthInstance.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        window.location.href = '/signin';
      }
      return Promise.reject(error);
    }
  );

  return axiosAuthInstance;
};

export const axiosAudio = (): AxiosInstance => {
  const axiosAudioInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      'Content-Type': 'audio/mpeg',
    }
  });

  return axiosAudioInstance;
}