"use client";
import { Grid, Slider, Typography, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React from "react";
import SelectTool from "@/components/setlists/SelectTool";
import SetList, { ISetList } from "@/models/setlists";
import { useGenreStore } from "@/store/useGenreStore";
interface SetListBaseFormProps {
  setList: SetList;
  errorMessages?: Record<string, string>;
  handleSubmit: (setList: SetList) => void;
  handleChange: (field: keyof ISetList, value: any) => void;
}

const SetListBaseForm = ({
  setList,
  errorMessages,
  handleSubmit,
  handleChange
}: SetListBaseFormProps) => {
  const { allGenres } = useGenreStore();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="名前"
          fullWidth
          margin="normal"
          value={setList.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={!!errorMessages?.name}
          helperText={errorMessages?.name}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        {!!allGenres.length && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="genre-name-label">ジャンル名</InputLabel>
            <Select
              labelId="genre-name-label"
              value={setList.genreName}
              onChange={(e) => handleChange("genreName", e.target.value)}
              label="ジャンル名"
            >
              {allGenres.map((genre: string) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth margin="normal">
          <Typography gutterBottom>評価（1〜5）</Typography>
          <Slider
            value={setList.rating}
            step={1}
            valueLabelDisplay="auto"
            min={1}
            max={5}
            marks={[1, 2, 3, 4, 5].map((value) => ({
              value,
              label: String(value),
            }))}
            onChange={(_, value) => handleChange("rating", value)}
          />
        </FormControl>
      </Grid>
      <SelectTool
        selectedTracks={setList.tracks}
        onSelect={(track, position) => {
          const newTracks = [...setList.tracks];
          newTracks.splice(position || newTracks.length, 0, track);
          handleChange("tracks", newTracks);
        }}
        onRemove={(track) => {
          handleChange(
            "tracks",
            setList.tracks.filter((t) => t.id !== track.id)
          );
        }}
      />
      <Grid item xs={12} my={6}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          fullWidth
          onClick={() => handleSubmit(setList)}
        >
          完了
        </Button>
      </Grid>
    </Grid>
  );
};

export default SetListBaseForm;
