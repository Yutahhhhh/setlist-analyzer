"use client";
import TrackTable from "@/components/tracks/TrackTable";
import { useAudio } from "@/hooks/useTrack";
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
import { useState } from "react";
import { useTrackStore } from "@/store/useTrackStore";
import { FILE_EXTENTIONS } from "@/constants/common";
import { useJobStore } from "@/store/useJobStore";
import { startAudioAnalysis } from "@/services/trackApi";
import { useRouter, useSearchParams } from "next/navigation";
import { TrackSearchParams } from "@/types/common";
import { buildURL } from "@/utils/RouterUtil";

export default function UnAnalyzed() {
  const router = useRouter();
  const { unshiftJob } = useJobStore();
  const params = useSearchParams();
  const [searchParams, setSearchParams] = useState<TrackSearchParams>({
    page: (params.get("page") || 1) as number,
    per: (params.get("per") || 10) as number,
    filename: (params.get("filename") || "") as string,
    extensions: (params.get("extensions")
      ? params.getAll("extensions").join(",")
      : "") as string,
    isAllTracks: params.get("isAllTracks") === "true",
  });
  const [formParams, setFormParams] = useState<TrackSearchParams>(searchParams);
  const { currentPage, totalItemCount, isLoading, error } =
    useAudio(searchParams);
  const tracks = useTrackStore((state) => state.tracks);

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
        <Typography color="error">エラー: {error.message}</Typography>
      </Container>
    );
  }

  const handleAnalyze = async () => {
    try {
      if (!confirm("検索条件で登録しますか？")) return;
      const jobStatus = await startAudioAnalysis({
        page: 1,
        per: formParams.per,
        filename: formParams.filename,
        extensions: formParams.extensions,
        isAllTracks: formParams.isAllTracks,
      });
      unshiftJob(jobStatus);
    } catch (error) {
      console.error("Failed to fetch audio directory:", error);
      throw error;
    }
  };

  const handleSearch = (params?: { page?: number; per?: number, arrExts?: string[] }) => {
    const requestParams: TrackSearchParams = {
      page: params?.page || 1,
      per: params?.per || formParams.per,
      filename: formParams.filename,
      extensions: !!params?.arrExts
        ? params.arrExts.join(",")
        : formParams.extensions,
      isAllTracks: formParams.isAllTracks,
    };
    const url = buildURL('/list', requestParams);
    router.push(url);
    setSearchParams(requestParams);
  };

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
              checked={formParams.isAllTracks as boolean}
              onChange={(e) => {
                setFormParams({ ...formParams, isAllTracks: e.target.checked });
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
        per={formParams.per as number}
        page={formParams.page as number}
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
