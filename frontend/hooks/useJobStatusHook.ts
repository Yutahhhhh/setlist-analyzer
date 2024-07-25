import useDeepCompareEffect from "use-deep-compare-effect";
import { getAllJobs } from '@/services/jobStatusApi';
import { useJobStore } from '@/store/useJobStore';

export const useJobStatus = () => {
  const { setAllJobs } = useJobStore();

  useDeepCompareEffect(() => {
    const loadJobStatuses = async () => {
      try {
        const res = await getAllJobs();
        setAllJobs(res);
      } catch (err) {
        console.error('Failed to fetch job statuses:', err);
      }
    };

    loadJobStatuses();
  }, [setAllJobs]);
};
