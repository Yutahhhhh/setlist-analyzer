import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react";
import MicIcon from "@mui/icons-material/Mic";

interface LyricsModalProps {
  lyrics: string;
}

const LyricsModal = ({ lyrics }: LyricsModalProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>歌詞</DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            component="p"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {lyrics}
          </Typography>
        </DialogContent>
      </Dialog>
      <Button onClick={() => setOpen(true)}>
        <MicIcon />
      </Button>
    </>
  );
};

export default LyricsModal;
