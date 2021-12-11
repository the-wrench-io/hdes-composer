import React from 'react';

import { Box, TableCell, Typography } from '@mui/material';

import { Client } from '../../context';


const DecisionTableCell: React.FC<{
  row: Client.AstDecisionRow,
  header: Client.TypeDef,
  cell: Client.AstDecisionCell,
  onClick: () => void
}> = ({ header, cell, onClick }) => {

  if (header.direction === "IN") {
    return (<TableCell key={cell.header} onClick={() => onClick()} sx={{ cursor: "pointer" }}>
      <Typography noWrap>
        {cell?.value ? cell.value : <Box sx={{ fontWeight: "bold" }} component="span">*</Box>}
      </Typography>
    </TableCell>);
  }

  return (<TableCell key={cell.header} onClick={() => onClick()} sx={{ cursor: "pointer" }}>
    <Typography noWrap>{cell?.value}</Typography >
  </TableCell>);
}
export { DecisionTableCell };
