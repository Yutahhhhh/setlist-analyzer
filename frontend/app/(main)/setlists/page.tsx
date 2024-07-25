"use client";
import TrackTable from "@/components/tracks/TrackTable";
import { useSetLists } from "@/hooks/useSetlistHook";
import SetList from "@/models/setlists";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function SetListPage() {
  const router = useRouter();
  const {
    setLists,
    isLoading,
    error,
    handleDeleteSetlist,
    handleDownloadSetlist,
  } = useSetLists();

  if (isLoading) {
      <Container>
        <CircularProgress />
      </Container>;
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">エラー: {error.message}</Typography>
      </Container>
    );
  }

  const handleNewSetlist = () => {
    router.push("/setlists/new");
  };

  return (
    <Container>
      <Box m={2} display="flex" justifyContent="end" alignContent="center">
        <Button onClick={handleNewSetlist}>追加</Button>
      </Box>

      <Grid container spacing={2}>
        {setLists.map((setList) => (
          <Grid xs={12} item key={setList.id}>
            <Card>
              <CardContent>
                <Box>
                  <Typography variant="h5" component="div">
                    {setList.name}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    ジャンル: {setList.genreName}
                  </Typography>
                  <Typography variant="body2">
                    評価: {setList.rating}
                  </Typography>
                </Box>
                <Box mt={2}>
                  <TrackTable
                    tracks={setList.sortedTracks}
                    totalItemCount={setList.tracks.length}
                    currentPage={1}
                    per={100}
                    page={1}
                    tableType="show"
                    tableHeight={300}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  color="success"
                  size="small"
                  onClick={() => {
                    router.push(`/setlists/${setList.id}/edit`);
                  }}
                >
                  編集
                </Button>
                <Button
                  color="error"
                  size="small"
                  onClick={() => {
                    handleDeleteSetlist(setList.id);
                  }}
                >
                  削除
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    handleDownloadSetlist(setList);
                  }}
                >
                  ダウンロード
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
