"use client";
import { useRouter } from "next/navigation";
import TrackTable from "@/components/tracks/TrackTable";
import {
  Container,
  CircularProgress,
  Typography,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTrackStore } from "@/store/useTrackStore";
import { FILE_EXTENTIONS } from "@/constants/common";
import { useJobStore } from "@/store/useJobStore";
import { startAudioAnalysis } from "@/services/trackApi";
import { getAudios } from "@/services/audioApi";
import { AudioSearchParams } from "@/types/common";
import Track from "@/models/tracks";
import { useTrackTableStore } from "@/store/useTrackTableStore";

export default function List() {
  const router = useRouter();
  const { unshiftJob } = useJobStore();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItemCount, setTotalItemCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchParams, setSearchParams] = useState<AudioSearchParams>({
    filename: "",
    extensions: "",
    isAllTracks: false,
  });;
  const { tracks, setTracks } = useTrackStore();

  useEffect(() => {
    setTracks([]);
  }, [router, setTracks]);

  if (isLoading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">エラー: {error?.message}</Typography>
      </Container>
    );
  }

  const handleAnalyze = async () => {
    try {
      if (!confirm("検索条件で登録しますか？")) return;
      setIsLoading(true);
      const jobStatus = await startAudioAnalysis({
        filename: searchParams.filename,
        extensions: searchParams.extensions,
        isAllTracks: searchParams.isAllTracks,
      });
      unshiftJob(jobStatus);
    } catch (error) {
      console.error("Failed to fetch audio directory:", error);
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const { tracks, currentPage, totalItemCount } = await getAudios(searchParams)
      setTracks(tracks.map((t) => new Track(t)));
      setCurrentPage(currentPage);
      setTotalItemCount(totalItemCount);
    } catch (error) {
      console.error("Failed to fetch audio directory:", error);
      setError(error as Error);
      throw error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ my: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="ファイル名"
          variant="outlined"
          value={searchParams.filename}
          onChange={(e) => {
            setSearchParams({ ...searchParams, filename: e.target.value });
          }}
          sx={{ minWidth: 220 }}
        />
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel id="file-extension-label">拡張子</InputLabel>
          <Select
            labelId="file-extension-label"
            multiple
            value={searchParams.extensions.split(",").filter(Boolean)}
            onChange={(e) => {
              const extensions = e.target.value as string[];
              setSearchParams({
                ...searchParams,
                extensions: extensions.join(",") || "",
              });
            }}
            input={<OutlinedInput id="select-multiple-chip" label="拡張子" />}
            renderValue={(selected: string[]) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {FILE_EXTENTIONS.map((ext) => (
              <MenuItem key={ext} value={ext}>
                {ext}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={searchParams.isAllTracks as boolean}
              onChange={(e) => {
                setSearchParams({
                  ...searchParams,
                  isAllTracks: e.target.checked,
                });
              }}
            />
          }
          label="登録済みデータを含める"
        />
        <Button variant="contained" onClick={() => handleSearch()}>
          検索
        </Button>
        <Button variant="contained" onClick={handleAnalyze}>
          検索条件で登録
        </Button>
      </Box>
      <TrackTable
        tracks={tracks}
        totalItemCount={totalItemCount}
        currentPage={currentPage}
        per={totalItemCount}
        page={1}
        tableHeight={600}
      />
    </Container>
  );
}
