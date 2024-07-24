"use client";
import { useSetLists } from "@/hooks/useSetList";
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

export default function SetList() {
  const router = useRouter();
  const { setLists, isLoading, error, handleDeleteSetlist } = useSetLists();

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
          <Grid xs={4} item key={setList.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {setList.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  ジャンル: {setList.genreName}
                </Typography>
                <Typography variant="body2">評価: {setList.rating}</Typography>
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
                <Button color="error" size="small" onClick={() => {
                  handleDeleteSetlist(setList.id);
                }}>
                  削除
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
