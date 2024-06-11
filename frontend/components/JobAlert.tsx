import JobStatus, { IJobStatus } from "@/models/jobStatus";
import { useJobStore } from "@/store/useJobStore";
import { Alert, AlertTitle, CircularProgress, Typography } from "@mui/material";
import useDeepCompareEffect from "use-deep-compare-effect";
import { useState } from "react";

interface JobAlertProps {
  job: JobStatus;
}

const JobAlert: React.FC<JobAlertProps> = ({ job }) => {
  const [watchedJobStatus, setWatchedJobStatus] = useState(job);
  const { updateByCable } = useJobStore();

  useDeepCompareEffect(() => {
    const setupCable = async () => {
      const { default: JobStatusCable } = await import(
        "@/utils/JobStatusCable"
      );
      const cable = new JobStatusCable(job.jobId, job.channelName);
      cable.connect({
        received: (data: IJobStatus) => {
          const jobStatus = new JobStatus(data);
          if (jobStatus.isFinished) cable.disconnect();

          setWatchedJobStatus(jobStatus);
          updateByCable(jobStatus);
        },
      });

      return () => cable.disconnect();
    };

    setupCable();
  }, [job.channelName, job.jobId, updateByCable]);
  
  switch (watchedJobStatus.status) {
    case "running":
      return (
        <Alert severity="info">
          <AlertTitle>{watchedJobStatus.currentStateString}</AlertTitle>
          <CircularProgress size={10} />
          <Typography variant="caption" ml={1}>
            {watchedJobStatus.currentTypeString}の
            {watchedJobStatus.progressMessage}
          </Typography>
        </Alert>
      );
    default:
      return null;
  }
};

export default JobAlert;