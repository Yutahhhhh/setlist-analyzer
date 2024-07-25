"use client";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { ISetList } from "@/models/setlists";
import { useSetList } from "@/hooks/useSetlistHook";
import SetListBaseForm from "@/components/setlists/BaseForm";

export default function EditSetlist() {
  const params = useParams<{ id: string }>();
  const {
    setList,
    setSetList,
    isLoading,
    error,
    errorMessages,
    handleUpdateSetList,
  } = useSetList(Number(params.id));

  if (error) {
    return (
      <Container>
        <Typography color="error">エラー: {error.message}</Typography>
      </Container>
    );
  }

  if (isLoading || !setList) {
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
          セットリストを編集
        </Typography>
        <SetListBaseForm
          setList={setList}
          handleChange={handleChange}
          errorMessages={errorMessages}
          handleSubmit={handleUpdateSetList}
        />
      </Box>
    </Container>
  );
}