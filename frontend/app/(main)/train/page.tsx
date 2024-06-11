"use client";
import React, { useMemo } from "react";
import {
  Container, Typography, List, ListItem, ListItemText, ListItemIcon,
  Divider, CircularProgress, Chip,
  Button,
  Stack
} from '@mui/material';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { postTrainGenre } from "@/services/genreTrainApi";
import { useJobStore } from "@/store/useJobStore";

export default function Train() {
  const { allJobs, setAudioGenreJob, unshiftJob } = useJobStore();
  const genreJob = useMemo(() => {
    return allJobs.find((job) => job.jobType === "audio_genre_train");
  }, [allJobs]);

  const models = [
    { name: "ジャンル学習モデル", job: genreJob },
  ];

  const handleTrainGenre = async (retrain?: boolean) => {
    if (!confirm('ジャンル学習モデルを訓練しますか？')) {
      return;
    }
    
    try {
      const jobStatus = await postTrainGenre(!!retrain);
      setAudioGenreJob(jobStatus);
      unshiftJob(jobStatus);
    } catch (err) {
      console.error('Failed to post train genre:', err);
    }
  }

  const StatusBtn: React.FC = () => {
    switch (genreJob?.status) {
      case 'running':
        return <CircularProgress size={24} />;
      case undefined:
        return <Button startIcon={<ModelTrainingIcon />} onClick={() => handleTrainGenre()}>訓練</Button>;
      default:
        return <Button startIcon={<ModelTrainingIcon />} onClick={() => handleTrainGenre(true)}>再訓練</Button>;
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        学習モデル一覧
      </Typography>
      <List>
        {models.map((model, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemIcon>
                <MusicNoteIcon />
              </ListItemIcon>
              <ListItemText
                primary={model.name}
                secondary={`ステータス: ${
                  model.job ? model.job.currentStateString : "未実行"
                }`}
              />
              <StatusBtn />
            </ListItem>
            
            {model.job && (
              <Stack 
                direction="row"
                spacing={1} 
                flexWrap="wrap"
              >
                {model.job.trainData.map((v, index) => (
                  <Chip 
                    key={index} 
                    label={v}
                    size="small"
                  />
                ))}
              </Stack>
            )}
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
}
