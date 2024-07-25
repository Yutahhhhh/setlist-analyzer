"use client";
import { Box, Grid, Chip, Tab, Tabs, Slider, Typography, TextField, FormControl } from "@mui/material";
import React, { useMemo, useState } from 'react';
import TrackTable from '@/components/tracks/TrackTable';
import Track, { RECOMMEND_WEIGHT_FORMS } from '@/models/tracks';
import { TrackSearchParams } from "@/types/common";
import {
  SelectToolbar,
  ChoiceToolbar,
  RecommendToolbar,
} from "@/components/tracks/tables/TableToolbar";
import BaseTrackSearchForm from "@/components/tracks/BaseTrackSearchForm";
import { useSelectTool } from "@/hooks/useSelectToolHook";

interface SelectToolProps {
  selectedTracks: Track[];
  onSelect: (selectTrack: Track, position?: number) => void;
  onRemove: (removeTrack: Track) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = ((props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
});

const SelectTool = ({
  selectedTracks,
  onSelect,
  onRemove,
}: SelectToolProps) => {
  const [tab, setTab] = useState(0);
  const {
    recommendPhrase,
    recommendWeight,
    formParams,
    searchParams,
    currentPage,
    totalItemCount,
    grantTrack,
    // get
    filteredRecommendTracks,
    filteredFromTracks,
    // Set
    setGrantTrack,
    setRecommendPhrase,
    setFormParams,
    setRecommendWeight,
    // Handlers
    handleScrollSearch,
    handleSearch,
    handleRecommend,
  } = useSelectTool({
    initialSearchParams: {
      page: 1,
      per: 10,
      filename: "",
      genres: "",
      extensions: "",
      tempoRange: [80, 128],
      hasLyricTrack: true,
    },
    initialRecommendWeight: { genre: 10, tempo: 9 },
    selectedTracks,
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  }

  const grantRecommandTarget = async (trackId: number) => {
    const target = selectedTracks.find((t) => t.id === trackId);
    setGrantTrack(target);
    await handleRecommend(trackId);
  }

  const currentSearchLabels = useMemo(() => {
    const filename =
      searchParams.filename.length > 5
        ? `${searchParams.filename.slice(0, 5)}...`
        : searchParams.filename;
    const tempoRange = searchParams.tempoRange?.join("-");
    return [filename, searchParams.genres, tempoRange, searchParams.extensions]
      .filter(Boolean)
      .map((label, i) => {
        return <Chip key={`${label}-${i}`} label={label} sx={{ m: 1 }} />;
      });
  }, [searchParams]);

  const RecommendSliders = useMemo(() => {
    return RECOMMEND_WEIGHT_FORMS.map(recs => {
      return (
        <Grid key={recs.key} container spacing={2}>
          <Grid item xs={3}>
            <Chip label={recs.label} />
          </Grid>
          <Grid item xs={9}>
            <Slider
              value={recommendWeight[recs.key] || 0}
              onChange={(_, value) => {
                setRecommendWeight({ ...recommendWeight, [recs.key]: value });
              }}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
            />
          </Grid>
        </Grid>
      );
    })
  }, [recommendWeight, setRecommendWeight])

  return (
    <>
      <Grid item xs={6} alignContent="end">
        <SelectToolbar lyrics={grantTrack?.lyrics || ""}>
          <Typography variant="body1">
            {selectedTracks.length}曲選択中
          </Typography>
        </SelectToolbar>
        <TrackTable
          tracks={selectedTracks}
          totalItemCount={selectedTracks.length}
          currentPage={1}
          per={10}
          page={1}
          tableType="toSelect"
          recommendTarget={grantTrack}
          handleClickRow={(selectTrack: Track) =>
            grantRecommandTarget(selectTrack.id)
          }
          handleCustomAction={(removeTrack) => onRemove(removeTrack)}
        />
      </Grid>
      <Grid item xs={6} alignContent="end">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="All" />
            <Tab label="Recommend" />
          </Tabs>
        </Box>
        <CustomTabPanel value={tab} index={0}>
          <ChoiceToolbar
            handleSearch={handleSearch}
            currentSearchLabels={currentSearchLabels}
            fields={
              <>
                <BaseTrackSearchForm
                  formParams={formParams}
                  onChange={(newParams: TrackSearchParams) => {
                    setFormParams(newParams);
                  }}
                />
              </>
            }
          >
            {currentSearchLabels}
          </ChoiceToolbar>
          <TrackTable
            tracks={filteredFromTracks}
            totalItemCount={totalItemCount}
            currentPage={currentPage}
            per={searchParams.per}
            page={searchParams.page}
            tableType="fromSelect"
            handleChangePage={(_, newPage) => {
              handleScrollSearch({ page: Number(newPage) });
            }}
            handleCustomAction={(selectTrack: Track) =>
              onSelect(
                selectTrack,
                selectedTracks.findIndex((t) => t.id === grantTrack?.id) + 1
              )
            }
          />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={1}>
          <RecommendToolbar
            handleRecommend={() => {
              if (grantTrack) handleRecommend(grantTrack.id);
            }}
            fields={
              <>
                {RecommendSliders}
                <Box my={4}>
                  <FormControl fullWidth>
                    <TextField
                      label="フレーズ"
                      value={recommendPhrase}
                      onChange={(e) => {
                        setRecommendPhrase(e.target.value);
                      }}
                    />
                  </FormControl>
                </Box>
              </>
            }
          >
            <Typography variant="caption" component="div">
              {Object.entries(recommendWeight)
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => (
                  <Box key={key} m={0.5} display="inline-block">
                    <Chip
                      label={`${
                        RECOMMEND_WEIGHT_FORMS.find((r) => r.key === key)?.label
                      }: ${value}`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                ))}
            </Typography>
            {recommendPhrase && (
              <Typography variant="caption" component="div">
                <Box m={0.5} display="inline-block">
                  <Chip label={`フレーズ: ${recommendPhrase}`} />
                </Box>
              </Typography>
            )}
          </RecommendToolbar>
          <TrackTable
            tracks={filteredRecommendTracks}
            totalItemCount={filteredRecommendTracks.length}
            currentPage={1}
            per={100}
            page={1}
            tableType="fromSelect"
            handleCustomAction={(selectTrack: Track) =>
              onSelect(
                selectTrack,
                selectedTracks.findIndex((t) => t.id === grantTrack?.id) + 1
              )
            }
          />
        </CustomTabPanel>
      </Grid>
    </>
  );
};

export default SelectTool;