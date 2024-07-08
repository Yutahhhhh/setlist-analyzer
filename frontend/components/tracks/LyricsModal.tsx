import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react";

interface LyricsModalProps {
  lyrics: string;
}

const LyricsModal: React.FC<LyricsModalProps> = ({ lyrics }: LyricsModalProps) => {
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
      <Button onClick={() => setOpen(true)}>歌詞を表示</Button>
    </>
  );
};

export default LyricsModal;
