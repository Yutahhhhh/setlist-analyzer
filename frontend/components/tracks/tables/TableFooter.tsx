import { Box, Typography } from "@mui/material";

interface TableFooterProps {
  totalItemCount: number;
  page: number;
  per: number;
}

const TableFooter = ({ totalItemCount, page, per }: TableFooterProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
      <Typography variant="caption">
        総数: {totalItemCount} 件, {page}回読み込み, {per} 件ずつ表示
      </Typography>
    </Box>
  );
};

export default TableFooter;