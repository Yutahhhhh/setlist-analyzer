import React, { useRef, useState } from "react";
import { Box, IconButton, Slider, Stack, Typography, styled, useTheme } from "@mui/material";
import { PlayArrowRounded, PauseRounded, FastForwardRounded, FastRewindRounded, VolumeDownRounded, VolumeUpRounded } from "@mui/icons-material";
import { AudioInfo } from "@/interfaces/audios";
import useDeepCompareEffect from "use-deep-compare-effect";
import Image from "next/image";

const WallPaper = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  borderRadius: 16,
  overflow: "hidden",
  background: "linear-gradient(rgb(255, 38, 142) 0%, rgb(255, 105, 79) 100%)",
  transition: "all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s",
  "&::before": {
    content: '""',
    width: "140%",
    height: "140%",
    position: "absolute",
    top: "-40%",
    right: "-50%",
    background:
      "radial-gradient(at center center, rgb(62, 79, 249) 0%, rgba(62, 79, 249, 0) 64%)",
  },
  "&::after": {
    content: '""',
    width: "140%",
    height: "140%",
    position: "absolute",
    bottom: "-50%",
    left: "-30%",
    background:
      "radial-gradient(at center center, rgb(247, 237, 225) 0%, rgba(247, 237, 225, 0) 70%)",
    transform: "rotate(30deg)",
  },
});

const Widget = styled("div")(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: 343,
  maxWidth: "100%",
  margin: "auto",
  position: "relative",
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.4)",
  backdropFilter: "blur(40px)",
}));

const CoverImage = styled("div")({
  width: 100,
  height: 100,
  objectFit: "cover",
  overflow: "hidden",
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: "rgba(0,0,0,0.08)",
  "& > img": {
    width: "100%",
  },
});

const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});


interface AudioPlayerProps {
  audioInfo: AudioInfo;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioInfo }) => {
  const [paused, setPaused] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const theme = useTheme();

  const mainIconColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const lightIconColor =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.4)"
      : "rgba(0,0,0,0.4)";

  useDeepCompareEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioInfo.url;
      audioRef.current.load();

      const setAudioDuration = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      };

      audioRef.current.addEventListener("loadedmetadata", setAudioDuration);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener(
            "loadedmetadata",
            setAudioDuration
          );
        }
      };
    }
  }, [audioInfo]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (paused) {
        audioRef.current.play();
        setPaused(false);
      } else {
        audioRef.current.pause();
        setPaused(true);
      }
    }
  };

  useDeepCompareEffect(() => {
    const updatePosition = () => {
      if (audioRef.current) {
        setPosition(audioRef.current.currentTime);
      }
    };

    const interval = setInterval(updatePosition, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [paused]);

  function formatDuration(value: number) {
    const minute = Math.floor(value / 60);
    const secondLeft = Math.floor(value % 60);
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <audio ref={audioRef} style={{ display: "none" }} />
      <Widget>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CoverImage>
            <Image
              src={
                audioInfo.coverImageUrl ||
                "https://mui.com/static/images/sliders/chilling-sunday.jpg"
              }
              alt="Cover"
              width={100}
              height={100}
            />
          </CoverImage>
          <Box sx={{ ml: 1.5, minWidth: 0 }}>
            <Stack direction="column" spacing={0.5}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
                noWrap
              >
                {audioInfo.artist || "Unknown Artist"}
              </Typography>
              <Typography>
                <b>{audioInfo.name || "Unknown Title"}</b>
              </Typography>
              <Typography letterSpacing={-0.25}>
                {audioInfo.album || "Unknown Album"}
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Slider
          aria-label="time-indicator"
          size="small"
          value={position}
          min={0}
          step={1}
          max={duration}
          onChange={(_, value) => setPosition(value as number)}
          onMouseUp={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = position;
            }
          }}
          sx={{
            color: theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
            height: 4,
            "& .MuiSlider-thumb": {
              width: 8,
              height: 8,
              transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
              "&::before": {
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
              },
              "&:hover, &.Mui-focusVisible": {
                boxShadow: `0px 0px 0px 8px ${
                  theme.palette.mode === "dark"
                    ? "rgb(255 255 255 / 16%)"
                    : "rgb(0 0 0 / 16%)"
                }`,
              },
              "&.Mui-active": {
                width: 20,
                height: 20,
              },
            },
            "& .MuiSlider-rail": {
              opacity: 0.28,
            },
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: -2,
          }}
        >
          <TinyText>{formatDuration(position)}</TinyText>
          <TinyText>-{formatDuration(duration - position)}</TinyText>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: -1,
          }}
        >
          <IconButton aria-label="previous song">
            <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
          <IconButton
            aria-label={paused ? "play" : "pause"}
            onClick={togglePlayPause}
          >
            {paused ? (
              <PlayArrowRounded
                sx={{ fontSize: "3rem" }}
                htmlColor={mainIconColor}
              />
            ) : (
              <PauseRounded
                sx={{ fontSize: "3rem" }}
                htmlColor={mainIconColor}
              />
            )}
          </IconButton>
          <IconButton aria-label="next song">
            <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
        </Box>
        <Stack
          spacing={2}
          direction="row"
          sx={{ mb: 1, px: 1 }}
          alignItems="center"
        >
          <VolumeDownRounded htmlColor={lightIconColor} />
          <Slider
            aria-label="Volume"
            defaultValue={30}
            onChange={(_event, newValue) => {
              if (audioRef.current) {
                audioRef.current.volume = (newValue as number) / 100;
              }
            }}
            sx={{
              color:
                theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
              "& .MuiSlider-track": {
                border: "none",
              },
              "& .MuiSlider-thumb": {
                width: 24,
                height: 24,
                backgroundColor: "#fff",
                "&::before": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                },
                "&:hover, &.Mui-focusVisible, &.Mui-active": {
                  boxShadow: "none",
                },
              },
            }}
          />
          <VolumeUpRounded htmlColor={lightIconColor} />
        </Stack>
      </Widget>
      <WallPaper />
    </Box>
  );
};

export default AudioPlayer;
