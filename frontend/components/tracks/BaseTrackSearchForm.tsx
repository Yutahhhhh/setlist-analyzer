"use client";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Grid,
  Slider,
  Typography,
} from "@mui/material";
import { TrackSearchParams } from "@/types/common";
import { FILE_EXTENTIONS } from "@/constants/common";
import { useGenreStore } from "@/store/useGenreStore";
import React from "react";

interface TrackSearchFormParams {
  formParams: TrackSearchParams;
  onChange: (values: TrackSearchParams) => void;
  custom?: React.ReactNode;
}

const BaseTrackSearchForm = ({
  formParams,
  onChange,
  custom,
}: TrackSearchFormParams) => {
  const { allGenres } = useGenreStore();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <TextField
            label="ファイル名"
            variant="outlined"
            value={formParams.filename}
            onChange={(e) => {
              onChange({ ...formParams, filename: e.target.value });
            }}
          />
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel id="genre-label">ジャンル</InputLabel>
          <Select
            labelId="genre-label"
            multiple
            value={formParams.genres?.split(",").filter(Boolean)}
            onChange={(e) => {
              onChange({
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
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel id="file-extension-label">拡張子</InputLabel>
          <Select
            labelId="file-extension-label"
            multiple
            value={formParams.extensions.split(",").filter(Boolean)}
            onChange={(e) => {
              const extensions = e.target.value as string[];
              onChange({
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
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <Typography id="tempo-range-label">テンポ</Typography>
          <Slider
            value={formParams.tempoRange}
            step={1}
            max={300}
            valueLabelDisplay="auto"
            onChange={(_e: Event, newValue: number | number[]) => {
              onChange({
                ...formParams,
                tempoRange: newValue as number[],
              });
            }}
            disableSwap
          />
        </FormControl>
      </Grid>
      {custom}
    </Grid>
  );
}

export default BaseTrackSearchForm