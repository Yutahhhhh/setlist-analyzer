import React, { CSSProperties, useCallback } from "react";
import {
  TableCell,
  Typography,
  IconButton,
  Box,
  Checkbox,
  Button,
} from "@mui/material";
import Image from "next/image";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import LyricsModal from "@/components/tracks/LyricsModal";
import Track from "@/models/tracks";
import theme from "@/plugins/theme";
import { useTrackTableStore } from "@/store/useTrackTableStore";

interface CommonProps {
  track: Track;
  isPlaying: boolean;
  togglePlayPause: () => void;
}

interface ItemContentProps extends CommonProps {
  cellStyle?: CSSProperties;
  lyricDom?: React.ReactNode;
}

interface MultiSelectProps extends CommonProps {
}

interface SelectProps extends CommonProps {
  handleCustomAction: (track: Track) => void;
}

const singleCellStyle = {
  padding: theme.spacing(0.5),
  fontSize: theme.typography.caption.fontSize,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const BaseItemContent = ({
  track,
  isPlaying,
  togglePlayPause,
  cellStyle = {},
  lyricDom = null,
}: ItemContentProps) => (
  <>
    <TableCell align="center" sx={cellStyle}>
      <Box width={48} height={48} position="relative" display="inline-block">
        {track.coverImageUrl && (
          <Image src={track.coverImageUrl} alt="Cover" width={48} height={48} />
        )}
        <IconButton
          onClick={togglePlayPause}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            color: "white",
            backgroundColor: "transparent",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
          }}
        >
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
      </Box>
    </TableCell>
    <TableCell sx={cellStyle}>
      <>
        <Typography variant="body2">{track.topCell}</Typography>
        <Typography variant="caption">{track.artist}</Typography>
      </>
      <Typography variant="caption">{track.underCell}</Typography>
    </TableCell>
    {lyricDom}
  </>
);

const MultiSelectItemContent = (props: MultiSelectProps) => {
  const { selectedIds, onCheck } = useTrackTableStore((state) => ({
    selectedIds: state.selectedIds,
    onCheck: state.onCheck,
  }));

  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheck(props.track.id, e.target.checked);
    },
    [onCheck, props.track.id]
  );

  return (
    <>
      <BaseItemContent
        {...props}
        lyricDom={
          <TableCell align="center">
            {props.track.hasLyrics ? (
              <LyricsModal lyrics={props.track.lyrics} />
            ) : (
              "歌詞なし"
            )}
          </TableCell>
        }
      />
      <TableCell align="center">
        <Checkbox
          checked={selectedIds.includes(props.track.id)}
          onChange={handleCheck}
        />
      </TableCell>
    </>
  );
};

const FromSelectItemContent = (props: SelectProps) => (
  <>
    <TableCell align="center" sx={singleCellStyle}>
      <Button onClick={() => props.handleCustomAction(props.track)}>
        追加
      </Button>
    </TableCell>
    <BaseItemContent {...props} cellStyle={singleCellStyle} />
  </>
);

const ToSelectItemContent = (props: SelectProps) => (
  <>
    <TableCell align="center" sx={singleCellStyle}>
      <Button
        onClick={(event) => {
          event.stopPropagation();
          props.handleCustomAction(props.track);
        }}
        color="error"
      >
        削除
      </Button>
    </TableCell>
    <BaseItemContent {...props} cellStyle={singleCellStyle} />
  </>
);

export { MultiSelectItemContent, FromSelectItemContent, ToSelectItemContent, BaseItemContent };
  function useCollback(arg0: (e: React.ChangeEvent<HTMLInputElement>) => void, arg1: number[]) {
    throw new Error("Function not implemented.");
  }

