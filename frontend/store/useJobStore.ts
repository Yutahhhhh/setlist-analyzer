import { create } from 'zustand';
import JobStatus from '@/models/jobStatus';

interface JobStoreState {
  allJobs: JobStatus[];
  setAllJobs: (jobs: JobStatus[]) => void;
  unshiftJob: (job: JobStatus) => void;
  updateByCable: (job: JobStatus) => void;
  audioGenreJob: JobStatus | null;
  audioAnalyzeLyricsJob: JobStatus | null;
  setAudioGenreJob: (job: JobStatus) => void;
  setAudioAnalyzeLyricsJob: (job: JobStatus) => void;
}

export const useJobStore = create<JobStoreState>((set, get) => ({
  allJobs: [],
  setAllJobs: (jobs) => set({ allJobs: jobs }),
  unshiftJob: (job) => set({ allJobs: [job, ...get().allJobs] }),
  updateByCable: (job) => set((state) => {
    const updatedJobs = state.allJobs.map((j) => j.jobId === job.jobId ? job : j);
    return { allJobs: updatedJobs };
  }),
  audioGenreJob: null,
  audioAnalyzeLyricsJob: null,
  setAudioGenreJob: (audioGenreJob) => set({ audioGenreJob }),
  setAudioAnalyzeLyricsJob: (audioAnalyzeLyricsJob) => set({ audioAnalyzeLyricsJob })
}));