"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Typography,
  IconButton,
  Slider,
  Box,
  Grid,
} from "@mui/material";
import Image from "next/image";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOff from "@mui/icons-material/VolumeOff";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import Close from "@mui/icons-material/Close";
import { useTrackStore } from "@/store/useTrackStore";
import { findAudioUrl } from "@/services/audioApi";
import Track from "@/models/tracks";

const TrackControlBar: React.FC = () => {
  const {
    isPlaying,
    currentTrack,
    volume,
    tracks,

    setTrack,
    togglePlay,
    setVolume,
  } = useTrackStore();
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack?.url || "";
      audioRef.current.load();
    }
  }, [audioRef, currentTrack?.url]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, audioRef]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlayPause = () => {
    togglePlay(!isPlaying);
  };

  const handleTimeChange = (_: Event, newValue: number | number[]) => {
    const newTime = newValue as number;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  const handleLoadedData = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      };
    }
  };

  const changeTrack = async (direction: "next" | "prev") => {
    togglePlay(false);
    const currentIndex = tracks.findIndex(
      (track: Track) => track.path === currentTrack?.path
    );

    const newIndex = calculateNewIndex(currentIndex, direction, tracks.length);
    const newTrack = tracks[newIndex];

    try {
      const url = await findAudioUrl(newTrack.path);
      setTrack(new Track({ ...newTrack, url }));
      togglePlay(true);
    } catch (e) {
      console.error("Error switching tracks:", e);
    }
  };

  const calculateNewIndex = (
    currentIndex: number,
    direction: "next" | "prev",
    totalItems: number
  ): number => {
    let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    // リストの端に達した場合、ループする
    if (newIndex < 0) {
      newIndex = totalItems - 1;
    } else if (newIndex >= totalItems) {
      newIndex = 0;
    }

    return newIndex;
  };

  const handleClose = () => {
    setTrack(null);
    togglePlay(false);
  };

  if (!currentTrack) return null;

  const formatDuration = (value: number) => {
    const minute = Math.floor(value / 60);
    const secondLeft = Math.floor(value % 60);
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  };

  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{
        top: "auto",
        bottom: 0,
        alignItems: "center",
        pt: 1,
        zIndex: 1400,
        width: "100%",
      }}
    >
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        px={4}
        py={2}
      >
        <Grid
          item
          xs={3}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {currentTrack.coverImageUrl && (
            <Image
              src={currentTrack.coverImageUrl}
              alt="Cover"
              width={48}
              height={48}
            />
          )}
          <Box
            sx={{
              marginLeft: 1,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <Typography
              variant="body2"
              noWrap
              sx={{
                width: "100%",
              }}
            >
              {currentTrack.name || currentTrack.title}
            </Typography>
            <Typography variant="caption">{currentTrack.artist}</Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%" }}
          >
            <Box display="flex" justifyContent="center" alignItems="center">
              <IconButton color="inherit" onClick={() => changeTrack("prev")}>
                <SkipPreviousIcon />
              </IconButton>
              <IconButton color="inherit" onClick={handlePlayPause}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton color="inherit" onClick={() => changeTrack("next")}>
                <SkipNextIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                mt: 1,
              }}
            >
              <Typography variant="body2" color="white" sx={{ minWidth: 40 }}>
                {formatDuration(currentTime)}
              </Typography>
              <Slider
                size="small"
                value={currentTime}
                min={0}
                step={1}
                max={audioRef.current?.duration || 100}
                onChange={handleTimeChange}
                sx={{ mx: 1, flexGrow: 1, color: "white" }}
              />
              <Typography variant="body2" color="white" sx={{ minWidth: 50 }}>
                {audioRef.current
                  ? formatDuration(audioRef.current.duration)
                  : "0:00"}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <IconButton
              color="inherit"
              onClick={() => setVolume(volume ? 0 : 30)}
              sx={{ ml: "auto" }}
            >
              {volume ? <VolumeUp /> : <VolumeOff />}
            </IconButton>
            <Slider
              aria-label="Volume"
              value={volume}
              onChange={handleVolumeChange}
              sx={{ width: 150, color: "white", mx: 2 }}
            />
          </Box>
        </Grid>
        <Box>
          <IconButton color="inherit" onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </Grid>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onLoadedData={handleLoadedData}
        onEnded={() => togglePlay(false)}
      />
    </AppBar>
  );
};

export default TrackControlBar;
