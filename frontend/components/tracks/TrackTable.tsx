"use client";
import {
  TableContainer,
  Paper,
  TableRow,
  TableHead,
  Table,
  TableCell,
  Typography,
  Box,
} from "@mui/material";

import { TableComponents, TableVirtuoso } from "react-virtuoso";
import { PageTrackList, ITrack } from "@/interfaces/tracks";
import { useTrackStore } from "@/store/useTrackStore";
import { findAudioUrl } from "@/services/audioApi";
import Track from "@/models/tracks";
import { forwardRef } from "react";
import {
  MultiSelectItemContent,
  FromSelectItemContent,
  ToSelectItemContent,
  BaseItemContent,
} from "@/components/tracks/tables/ItemContent";
import {
  MultiSelectHeader, SelectHeader, BaseHeader
} from "@/components/tracks/tables/TableHeaders";
import TableFooter from "@/components/tracks/tables/TableFooter";
import { useTrackTableStore } from "@/store/useTrackTableStore";

const Scroller = forwardRef<HTMLDivElement, any>((props, ref) => (
  <TableContainer component={Paper} {...props} ref={ref} />
));
Scroller.displayName = "Scroller";

interface TrackTableProps extends PageTrackList {
  per: number;
  page: number;
  tracks: Track[];
  tableType?: "nomal" | "multiSelect" | "fromSelect" | "toSelect";
  small?: boolean;
  recommendTarget?: Track | null;
  handleChangePage?: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleCustomAction?: (track: Track) => void;
  handleClickRow?: (track: Track) => void;
  tableHeight?: number;
}

const TrackTable = ({
  tracks,
  totalItemCount,
  per,
  page,
  handleChangePage = () => {},
  handleCustomAction = () => {},
  handleClickRow = () => {},
  tableType = "nomal",
  recommendTarget,
  tableHeight = 500,
}: TrackTableProps) => {
  const { currentTrack, setTrack, isPlaying, togglePlay } = useTrackStore();

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
    <Paper style={{ height: tableHeight, width: "100%" }}>
      <TableVirtuoso
        data={tracks}
        fixedHeaderContent={() => {
          switch (tableType) {
            case "multiSelect":
              return <MultiSelectHeader />;
            case "fromSelect":
              return <SelectHeader />;
            case "toSelect":
              return <SelectHeader />;
            default:
              return <BaseHeader />;
          }
        }}
        components={
          {
            Scroller,
            Table: (props) => (
              <Table
                {...props}
                sx={{ borderCollapse: "separate", width: "100%" }}
              />
            ),
            TableHead,
            TableRow: (props) => {
              return (
                <>
                  <TableRow
                    {...props}
                    onClick={() => handleClickRow(props.item)}
                    sx={{
                      cursor: "pointer",
                      color:
                        props.item.id === recommendTarget?.id
                          ? "grey"
                          : "inherit",
                    }}
                  />
                  {props.item.uniqPhrases.map((tp) => (
                    <TableRow key={tp.id}>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={3}
                      >
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="caption">
                            {tp.startTime}~{tp.endTime}: {tp.phrase}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              );
            },
          } as TableComponents<Track>
        }
        itemContent={(_index, track) => {
          switch (tableType) {
            case "multiSelect":
              return (
                <MultiSelectItemContent
                  track={track}
                  isPlaying={currentTrack?.path === track.path && isPlaying}
                  togglePlayPause={() => handlePlayPause(track)}
                />
              );
            case "fromSelect":
              return (
                <FromSelectItemContent
                  track={track}
                  isPlaying={currentTrack?.path === track.path && isPlaying}
                  togglePlayPause={() => handlePlayPause(track)}
                  handleCustomAction={handleCustomAction}
                />
              );
            case "toSelect":
              return (
                <ToSelectItemContent
                  track={track}
                  isPlaying={currentTrack?.path === track.path && isPlaying}
                  togglePlayPause={() => handlePlayPause(track)}
                  handleCustomAction={handleCustomAction}
                />
              );
            default:
              return (
                <BaseItemContent
                  track={track}
                  isPlaying={currentTrack?.path === track.path && isPlaying}
                  togglePlayPause={() => handlePlayPause(track)}
                />
              );
          }
        }}
        endReached={() => handleChangePage(null, page + 1)}
      />
      {["nomal", "multiSelect"].includes(tableType) && (
        <TableFooter totalItemCount={totalItemCount} per={per} page={page} />
      )}
    </Paper>
  );
};

export default TrackTable;
