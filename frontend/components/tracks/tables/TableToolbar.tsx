import {
  Dialog,
  DialogTitle,
  IconButton,
  AppBar,
  Toolbar,
  Box,
  DialogActions,
  Button,
  ToolbarProps,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { BaseHeaderCellStyle } from "@/components/tracks/tables/TableHeaders";
import SearchIcon from "@mui/icons-material/Search";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import LyricsModal from "@/components/tracks/LyricsModal";

const StyledToolbar = styled(Toolbar)<ToolbarProps>(() => ({
  paddingRight: "12px !important",
  paddingLeft: "12px !important",
  justifyContent: "space-between",
}));

interface MenuProps {
  title: string;
  fields: React.ReactNode;
  actionName: string;
  modalIcon: React.ReactNode;
  handleAction: () => void;
}

interface MenuModalProps extends MenuProps {
  children: React.ReactNode;
}

interface FromToolbarProps {
  fields: React.ReactNode;
  children: React.ReactNode;
}

interface ChoiceToolbarProps extends FromToolbarProps {
  handleSearch: () => void;
  currentSearchLabels: React.ReactNode;
}

interface RecommendToolbarProps extends FromToolbarProps {
  handleRecommend: () => void;
}

interface LyricToolbarProps {
  lyrics: string;
  children: React.ReactNode;
}

const MenuModal = ({
  fields,
  title,
  actionName,
  handleAction,
  modalIcon,
}: MenuProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const onClose = () => {
    setOpen(false);
  };
  const handleDialogAction = () => {
    onClose();
    handleAction();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>{title}</DialogTitle>
        <Box p={4}>{fields}</Box>
        <DialogActions>
          <Button variant="contained" onClick={handleDialogAction}>
            {actionName}
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton color="inherit" onClick={() => setOpen(true)}>
        {modalIcon}
      </IconButton>
    </>
  );
};

const TableToolbar = ({
  title,
  fields,
  modalIcon,
  actionName,
  handleAction,
  children,
}: MenuModalProps) => {
  return (
    <AppBar position="static" color="primary">
      <StyledToolbar sx={BaseHeaderCellStyle}>
        <MenuModal
          fields={fields}
          title={title}
          modalIcon={modalIcon}
          actionName={actionName}
          handleAction={handleAction}
        />
        {children}
      </StyledToolbar>
    </AppBar>
  );
}

const SelectToolbar = ({
  children,
  lyrics,
}: LyricToolbarProps) => {
  return (
    <AppBar position="static" color="primary">
      <StyledToolbar sx={BaseHeaderCellStyle}>
        {children}
        {lyrics && <LyricsModal lyrics={lyrics}></LyricsModal>}
      </StyledToolbar>
    </AppBar>
  );
};

const ChoiceToolbar = ({
  handleSearch,
  fields,
  children,
}: ChoiceToolbarProps) => {
  return (
    <TableToolbar
      title="検索"
      actionName="検索"
      modalIcon={<SearchIcon />}
      handleAction={handleSearch}
      fields={fields}
    >
      <Box mx={2}>{children}</Box>
    </TableToolbar>
  );
};

const RecommendToolbar = ({
  handleRecommend,
  fields,
  children
}: RecommendToolbarProps) => {
  return (
    <TableToolbar
      title="ウェイト設定"
      actionName="設定"
      modalIcon={<SettingsSuggestIcon />}
      handleAction={handleRecommend}
      fields={fields}
    >
      <Box
        m={2}
        sx={{ width: "100%", overflow: "hidden", whiteSpace: "normal" }}
      >
        {children}
      </Box>
    </TableToolbar>
  );
};

export {
  SelectToolbar,
  TableToolbar,
  ChoiceToolbar,
  RecommendToolbar,
}