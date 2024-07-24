import React, { CSSProperties, ReactNode } from "react";
import { TableCell, TableRow, useTheme } from "@mui/material";

const BaseHeaderCellStyle: CSSProperties = { backgroundColor: "#1e1e1e" };

const BaseHeader = () => (
  <TableRow sx={BaseHeaderCellStyle}>
    <TableCell align="center" sx={BaseHeaderCellStyle} width="10%">
      Cover
    </TableCell>
    <TableCell align="center" sx={BaseHeaderCellStyle} width="auto">
      Title
    </TableCell>
  </TableRow>
);

const MultiSelectHeader = () => {
  return (
    <TableRow sx={BaseHeaderCellStyle}>
      <TableCell align="center" sx={BaseHeaderCellStyle} width="10%">
        Cover
      </TableCell>
      <TableCell align="center" sx={BaseHeaderCellStyle} width="auto">
        Title
      </TableCell>
      <TableCell align="center" sx={BaseHeaderCellStyle} width="20%">
        Lirics
      </TableCell>
      <TableCell align="center" sx={BaseHeaderCellStyle} width="10%">
        Custom
      </TableCell>
    </TableRow>
  );
}

const SelectHeader = () => {
  const theme = useTheme();
  const headerCellStyle = {
    padding: theme.spacing(0.5),
    fontSize: theme.typography.caption.fontSize,
    backgroundColor: "#1e1e1e",
    color: theme.palette.common.white,
  };
  return (
    <TableRow sx={BaseHeaderCellStyle}>
      <TableCell align="center" sx={headerCellStyle} width="10%">
        Custom
      </TableCell>
      <TableCell align="center" sx={headerCellStyle} width="10%">
        Cover
      </TableCell>
      <TableCell align="center" sx={headerCellStyle} width="auto">
        Title
      </TableCell>
    </TableRow>
  );
}

export { MultiSelectHeader, SelectHeader, BaseHeader, BaseHeaderCellStyle };
