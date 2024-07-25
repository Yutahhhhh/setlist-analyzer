"use client";
import TrackTable from "@/components/tracks/TrackTable";
import {
  Container,
  CircularProgress,
  Typography,
  Box,
  Button,
  ButtonGroup,
  FormControlLabel,
  Switch,
  Grid,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useTrackStore } from "@/store/useTrackStore";
import { useTrack } from "@/hooks/useTrackHook";
import { TrackSearchParams } from "@/types/common";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { buildURL } from "@/utils/RouterUtil";
import {
  startAudioAnalyzeLyrics,
  startAudioAnalyzeLyricsBySearch,
  startAudioAnalyzeGenre,
  startAudioAnalyzeGenreBySearch,
  deleteTracks,
  getTracks,
} from "@/services/trackApi";
import { useJobStore } from "@/store/useJobStore";
import Track from "@/models/tracks";
import BaseTrackSearchForm from "@/components/tracks/BaseTrackSearchForm";
import { useTrackTableStore } from "@/store/useTrackTableStore";

export default function Home() {
  const router = useRouter();
  const params = useSearchParams();
  const { 
    unshiftJob, 
    setAudioAnalyzeLyricsJob, 
    setAudioAnalyzeGenreJob,
    audioAnalyzeLyricsJob,
    audioAnalyzeGenreJob,
  } = useJobStore();
  const [searchParams, setSearchParams] = useState<TrackSearchParams>({
    page: 1,
    per: 10,
    filename: (params.get("filename") || "") as string,
    genres: (params.get("genres")
      ? params.getAll("genres").join(",")
      : "") as string,
    extensions: (params.get("extensions")
      ? params.getAll("extensions").join(",")
      : "") as string,
    hasLyricTrack: params.get("hasLyricTrack") === "true",
    tempoRange: (params.get("tempoRange")
      ? params.get("tempoRange")?.split(",").map(Number)
      : [0, 300]) as number[],
  });
  const [formParams, setFormParams] = useState<TrackSearchParams>(searchParams);
  const { currentPage, totalItemCount, isLoading, error } =
    useTrack(searchParams);
  const {
    tracks,
    addTracks,
    setTracks,
  } = useTrackStore();
  const { selectedIds, setSelectedIds } = useTrackTableStore();

  const canPushBtn = useMemo(() => {
    return !audioAnalyzeLyricsJob && selectedIds.length
  }, [audioAnalyzeLyricsJob, selectedIds]);

  const handleScrollSearch = useCallback(
    async (page: number, currentSearchParams: TrackSearchParams) => {
      const pagenates = {
        page: page || 1,
        per: currentSearchParams.per,
      };
      const requestParams = { ...currentSearchParams, ...pagenates };
      try {
        const res = await getTracks(requestParams);
        addTracks(res.tracks.map((t) => new Track(t)));
        setSearchParams(requestParams);
      } catch (error) {
        console.error("Failed to fetch audio directory:", error);
        throw error;
      }
    },
    [addTracks, setSearchParams]
  );

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

  const handleSearch = () => {
    router.push(
      buildURL("/", {
        filename: formParams.filename,
        genres: formParams.genres,
        extensions: formParams.extensions,
        hasLyricTrack: formParams.hasLyricTrack,
        tempoRange: formParams.tempoRange,
      })
    );
    setSearchParams({ ...formParams, page: 1, per: 10 });
    resetSelectedTracks();
  };

  const handleAnalyzeLyrics = async () => {
    try {
      if (!confirm("選択中の曲の歌詞を解析しますか？")) return;
      const jobStatus = await startAudioAnalyzeLyrics(selectedIds);
      unshiftJob(jobStatus);
      setAudioAnalyzeLyricsJob(jobStatus);
      resetSelectedTracks();
    } catch (error) {
      console.error("Failed to fetch audio directory:", error);
      throw error;
    }
  };

  const handleAnalyzeLyricsBySearch = async () => {
    try {
      if (!confirm("検索条件で歌詞を解析しますか？")) return;
      const jobStatus = await startAudioAnalyzeLyricsBySearch(searchParams);
      unshiftJob(jobStatus);
      setAudioAnalyzeLyricsJob(jobStatus);
      resetSelectedTracks();
    } catch (error) {
      console.error("Failed to fetch audio directory:", error);
      throw error;
    }
  };

  const handleAnalyzeGenreBySearch = async () => {
    try {
      if (!confirm("検索条件でジャンルを解析しますか？")) return;
      const jobStatus = await startAudioAnalyzeGenreBySearch(searchParams);
      unshiftJob(jobStatus);
      setAudioAnalyzeGenreJob(jobStatus);
      resetSelectedTracks();
    } catch (error) {
      console.error("Failed to fetch audio directory:", error);
      throw error;
    }
  };

  const handleAnalyzeGenre = async () => {
    try {
      if (!confirm("選択中の曲のジャンルを解析しますか？")) return;
      const jobStatus = await startAudioAnalyzeGenre(selectedIds);
      unshiftJob(jobStatus);
      setAudioAnalyzeGenreJob(jobStatus);
      resetSelectedTracks();
    } catch (error) {
      console.error("Failed to fetch audio directory:", error);
      throw error;
    }
  }

  const handleDeleteTracks = async () => {
    try {
      if (!confirm("選択中の曲を削除しますか？")) return;
      await deleteTracks(selectedIds);
      resetSelectedTracks();
    } catch (error) {
      console.error("Failed to fetch audio directory:", error);
      throw error;
    }
  };

  const resetSelectedTracks = () => {
    setSelectedIds([]);
    setTracks(
      tracks.filter((track) => !selectedIds.includes(track.id))
    );
  }

  return (
    <Container>
      <Box sx={{ my: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <BaseTrackSearchForm
          formParams={formParams}
          onChange={(newParams: TrackSearchParams) => {
            setFormParams(newParams);
          }}
          custom={
            <>
              <Grid item xs={6}>
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
              </Grid>
              <Grid item xs={6} display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={() => handleSearch()}>
                  検索
                </Button>
              </Grid>

              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="end"
                alignContent="center"
              >
                <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                  選択中の{selectedIds.length}
                  曲から
                </Typography>
                <ButtonGroup
                  variant="contained"
                  aria-label="Basic button group"
                >
                  <Button
                    onClick={handleAnalyzeGenre}
                    disabled={!canPushBtn}
                    startIcon={
                      !!audioAnalyzeGenreJob ? (
                        <CircularProgress size={24} />
                      ) : null
                    }
                  >
                    ジャンル解析
                  </Button>
                  <Button
                    onClick={handleAnalyzeLyrics}
                    disabled={!canPushBtn}
                    startIcon={
                      !!audioAnalyzeLyricsJob ? (
                        <CircularProgress size={24} />
                      ) : null
                    }
                  >
                    歌詞解析
                  </Button>
                  <Button
                    onClick={handleDeleteTracks}
                    disabled={!canPushBtn}
                    startIcon={
                      !!audioAnalyzeLyricsJob ? (
                        <CircularProgress size={24} />
                      ) : null
                    }
                  >
                    削除
                  </Button>
                </ButtonGroup>
              </Grid>

              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="end"
                alignContent="center"
              >
                <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                  検索条件から
                </Typography>
                <ButtonGroup
                  variant="contained"
                  aria-label="Basic button group"
                >
                  <Button
                    onClick={handleAnalyzeGenreBySearch}
                    disabled={!!audioAnalyzeGenreJob}
                    startIcon={
                      !!audioAnalyzeGenreJob ? (
                        <CircularProgress size={24} />
                      ) : null
                    }
                  >
                    ジャンル解析
                  </Button>
                  <Button
                    onClick={handleAnalyzeLyricsBySearch}
                    disabled={!!audioAnalyzeLyricsJob}
                    startIcon={
                      !!audioAnalyzeLyricsJob ? (
                        <CircularProgress size={24} />
                      ) : null
                    }
                  >
                    歌詞解析
                  </Button>
                </ButtonGroup>
              </Grid>
            </>
          }
        />
      </Box>

      <TrackTable
        tracks={tracks}
        totalItemCount={totalItemCount}
        currentPage={currentPage}
        per={searchParams.per}
        page={searchParams.page}
        tableType="multiSelect"
        handleChangePage={async (_, newPage) => {
          await handleScrollSearch(Number(newPage), searchParams);
        }}
      />
    </Container>
  );
}
