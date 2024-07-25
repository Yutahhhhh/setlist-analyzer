"use client";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { ISetList } from "@/models/setlists";
import { useSetList } from "@/hooks/useSetlistHook";
import SetListBaseForm from "@/components/setlists/BaseForm";

export default function NewSetlist() {
  const { setList, setSetList, errorMessages, handleCreateSetList } =
    useSetList();

  if (!setList) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  const handleChange = (field: keyof ISetList, value: any) => {
    setSetList((prev) => {
      return prev!.updateField(field, value);
    });
  };

  return (
    <Container>
      <Box component="form" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          新しいセットリストを作成
        </Typography>
        <SetListBaseForm
          setList={setList}
          handleChange={handleChange}
          errorMessages={errorMessages}
          handleSubmit={handleCreateSetList}
        />
      </Box>
    </Container>
  );
}
