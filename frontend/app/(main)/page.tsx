"use client";
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
  ButtonGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useState } from "react";
import { useTrackStore } from "@/store/useTrackStore";
import { useTrack } from "@/hooks/useTrack";
import { FILE_EXTENTIONS } from "@/constants/common";
import { TrackSearchParams } from "@/types/common";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { buildURL } from "@/utils/RouterUtil";
import {
  startAudioAnalyzeLyrics,
  startAudioAnalyzeLyricsBySearch, 
  destroyAudios,
} from "@/services/trackApi";
import { useJobStore } from "@/store/useJobStore";
import { useGenreStore } from "@/store/useGenreStore";

export default function Home() {
  const router = useRouter();
  const params = useSearchParams();
  const { allGenres } = useGenreStore();
  const { unshiftJob, setAudioAnalyzeLyricsJob, audioAnalyzeLyricsJob } = useJobStore();
  const [searchParams, setSearchParams] = useState<TrackSearchParams>({
    page: (params.get("page") || 1) as number,
    per: (params.get("per") || 10) as number,
    filename: (params.get("filename") || "") as string,
    genres: (params.get("genres")
      ? params.getAll("genres").join(",")
      : "") as string,
    extensions: (params.get("extensions")
      ? params.getAll("extensions").join(",")
      : "") as string,
    hasLyricTrack: params.get("hasLyricTrack") === "true",
  });
  const [formParams, setFormParams] = useState<TrackSearchParams>(searchParams);
  const { 
    currentPage, 
    totalItemCount, 
    isLoading: isTrackLoading, 
    error: trackError 
  } = useTrack(searchParams);
  const tracks = useTrackStore((state) => state.tracks);
  const isJobRunning = !!audioAnalyzeLyricsJob;

  if (isTrackLoading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (trackError) {
    return (
      <Container>
        <Typography color="error">
          エラー: {trackError?.message}
        </Typography>
      </Container>
    );
  }

  const handleSearch = (params?: {
    page?: number;
    per?: number;
    arrExts?: string[];
  }) => {
    const requestParams: TrackSearchParams = {
      page: params?.page || 1,
      per: params?.per || formParams.per,
      filename: formParams.filename,
      genres: !!params?.arrExts
        ? params.arrExts.join(",")
        : formParams.genres,
      extensions: !!params?.arrExts
        ? params.arrExts.join(",")
        : formParams.extensions,
      hasLyricTrack: formParams.hasLyricTrack,
    };
    router.push(buildURL("/", requestParams));
    setSearchParams(requestParams);
  };

  const handleAnalyzeLyrics = async () => {
    try {
      if (!confirm("選択中の曲の歌詞を解析しますか？")) return;
      const jobStatus = await startAudioAnalyzeLyrics(
        tracks.filter((track) => track.isChecked).map((track) => track.id)
      );
      unshiftJob(jobStatus);
      setAudioAnalyzeLyricsJob(jobStatus);
    } catch (error) {
      console.error("Failed to fetch audio directory:", error);
      throw error;
    }
  }

  const handleAnalyzeLyricsBySearch = async () => {
    try {
      if (!confirm("検索条件で歌詞を解析しますか？")) return;
      const jobStatus = await startAudioAnalyzeLyricsBySearch(searchParams);
      unshiftJob(jobStatus);
      setAudioAnalyzeLyricsJob(jobStatus);
    } catch (error) {
      console.error("Failed to fetch audio directory:", error);
      throw error;
    }
  }

  const handleDeleteTracks = async () => {
    try {
      if (!confirm("選択中の曲を削除しますか？")) return;
      await destroyAudios(
        tracks.filter((track) => track.isChecked).map((track) => track.id)
      );
    } catch (error) {
      console.error("Failed to fetch audio directory:", error);
      throw error;
    }
  }

  return (
    <Container>
      <Box sx={{ my: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="ファイル名"
          variant="outlined"
          value={formParams.filename}
          onChange={(e) => {
            setFormParams({ ...formParams, filename: e.target.value });
          }}
          sx={{ minWidth: 220 }}
        />
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel id="genre-label">ジャンル</InputLabel>
          <Select
            labelId="genre-label"
            multiple
            value={formParams.genres?.split(",").filter(Boolean)}
            onChange={(e) => {
              setFormParams({
                ...formParams,
                genres: (e.target.value as string[]).join(",") || "",
              });
            }}
            input={<OutlinedInput id="select-multiple-chip" label="ジャンル" />}
            renderValue={(selected: string[]) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {allGenres.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel id="file-extension-label">拡張子</InputLabel>
          <Select
            labelId="file-extension-label"
            multiple
            value={formParams.extensions.split(",").filter(Boolean)}
            onChange={(e) => {
              const extensions = e.target.value as string[];
              setFormParams({
                ...formParams,
                extensions: extensions.join(",") || "",
              });
            }}
            input={<OutlinedInput id="select-multiple-chip" label="拡張子" />}
            renderValue={(selected) => (
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
              checked={formParams.hasLyricTrack as boolean}
              onChange={(e) => {
                setFormParams({
                  ...formParams,
                  hasLyricTrack: e.target.checked,
                });
              }}
            />
          }
          label="歌詞解析済みデータを含める"
        />
        <Button variant="contained" onClick={() => handleSearch()}>
          検索
        </Button>
      </Box>

      <Box m={2} display="flex" justifyContent="end" alignContent="center">
        <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
          選択中の{tracks.filter((track) => track.isChecked).length}曲から
        </Typography>
        <ButtonGroup variant="contained" aria-label="Basic button group">
          <Button
            onClick={handleAnalyzeLyrics}
            disabled={isJobRunning}
            startIcon={isJobRunning ? <CircularProgress size={24} /> : null}
          >
            歌詞解析
          </Button>
          <Button
            onClick={handleDeleteTracks}
            disabled={isJobRunning}
            startIcon={isJobRunning ? <CircularProgress size={24} /> : null}
          >
            削除
          </Button>
        </ButtonGroup>
      </Box>

      <Box m={2} display="flex" justifyContent="end" alignContent="center">
        <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
          検索条件から
        </Typography>
        <ButtonGroup variant="contained" aria-label="Basic button group">
          <Button
            onClick={handleAnalyzeLyricsBySearch}
            disabled={isJobRunning}
            startIcon={isJobRunning ? <CircularProgress size={24} /> : null}
          >
            歌詞解析
          </Button>
        </ButtonGroup>
      </Box>

      <TrackTable
        tracks={tracks}
        totalItemCount={totalItemCount}
        currentPage={currentPage}
        per={searchParams.per as number}
        page={searchParams.page as number}
        showSelect
        handleChangePage={(_, newPage) => {
          handleSearch({ page: Number(newPage) });
        }}
        handleChangeRowsPerPage={(event) => {
          handleSearch({ per: Number(event.target.value) });
        }}
      />
    </Container>
  );
}
