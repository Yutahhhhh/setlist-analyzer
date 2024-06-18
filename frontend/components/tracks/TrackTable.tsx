"use client";
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  IconButton,
  Typography,
  Box,
  Checkbox
} from "@mui/material";
import Image from "next/image";
import { PageTrackList, ITrack } from "@/interfaces/tracks";
import { useTrackStore } from "@/store/useTrackStore";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { findAudioUrl } from "@/services/audioApi";
import Track from "@/models/tracks";

interface TrackTableProps extends PageTrackList {
  per: number;
  page: number;
  tracks: Track[];
  showSelect?: boolean;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleChangeRowsPerPage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const TrackTable: React.FC<TrackTableProps> = ({
  tracks,
  totalItemCount,
  per,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
  showSelect = false,
}) => {
  const { currentTrack, setTrack, isPlaying, togglePlay, setChecked } =
    useTrackStore();
  const columnCount = showSelect ? 3 : 2; // チェックボックスが表示される場合は3列、そうでない場合は2列

  const handlePlayPause = async (track: ITrack) => {
    if (currentTrack && currentTrack.path === track.path) {
      setTrack(null);
      togglePlay(false);
    } else {
      try {
        const url = await findAudioUrl(track.path);
        setTrack(new Track({ ...track, url }));
        togglePlay(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableBody>
          {tracks.map((track, index) => (
            <TableRow key={index}>
              {showSelect && (
                <TableCell
                  align="center"
                  style={{ width: 48 }}
                >
                  <Checkbox
                    checked={track.isChecked}
                    onChange={(e) => setChecked(track, e.target.checked)}
                  />
                </TableCell>
              )}
              <TableCell align="center" style={{ width: 48 }}>
                <Box
                  width={48}
                  height={48}
                  position="relative"
                  display="inline-block"
                >
                  {track.coverImageUrl && (
                    <Image
                      src={track.coverImageUrl}
                      alt="Cover"
                      width={48}
                      height={48}
                    />
                  )}
                  <IconButton
                    onClick={() => handlePlayPause(track)}
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
                    {isPlaying && currentTrack?.path === track.path ? (
                      <PauseIcon />
                    ) : (
                      <PlayArrowIcon />
                    )}
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell component="th" scope="row">
                <>
                  <Typography variant="body2">{track.topCell}</Typography>
                  <Typography variant="caption">{track.artist}</Typography>
                </>
                <Typography variant="caption">{track.underCell}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10, 15, 25]}
              colSpan={columnCount}
              count={totalItemCount}
              rowsPerPage={per}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default TrackTable;
