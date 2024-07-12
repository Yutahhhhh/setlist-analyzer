"use client";
import { useSetlist } from "@/hooks/useSetlist";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function SetList() {
  const router = useRouter();
  const { setlists, isLoading, error } = useSetlist();

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
    router.push("/setlist/new");
  };

  console.log(setlists);
  return (
    <Container>
      <Box m={2} display="flex" justifyContent="end" alignContent="center">
        <Button
          onClick={handleNewSetlist}
        >
          追加
        </Button>
      </Box>
    </Container>
  );
}
