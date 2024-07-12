"use client";
import { useGenreStore } from "@/store/useGenreStore";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Slider,
  Grid,
} from "@mui/material";
import { useState } from "react";

export default function NewSetlist() {
  const { allGenres } = useGenreStore();
  const [genreName, setGenreName] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [rating, setRating] = useState<number>(3);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ genreName, name, rating });
  };

  return (
    <Container>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          新しいセットリストを作成
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="名前"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="genre-name-label">ジャンル名</InputLabel>
              <Select
                labelId="genre-name-label"
                value={genreName}
                onChange={(e) => setGenreName(e.target.value)}
                label="ジャンル名"
              >
                <MenuItem value="">
                  <em>未選択</em>
                </MenuItem>
                {allGenres.map((genre: string) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <Typography gutterBottom>評価（1〜5）</Typography>
              <Slider
                value={rating}
                step={1}
                valueLabelDisplay="auto"
                min={1}
                max={5}
                marks={[1, 2, 3, 4, 5].map((value) => ({
                  value,
                  label: String(value),
                }))}
                onChange={(_, value) => setRating(value as number)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              fullWidth
            >
              作成
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
