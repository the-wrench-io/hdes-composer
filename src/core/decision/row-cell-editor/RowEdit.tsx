import React from 'react';

import { Box, TableCell, TableRow, useTheme, Typography } from '@mui/material';

import { Client } from '../../context';

import { alpha } from "@mui/material/styles";
import { CellEdit } from './CellEdit';


interface EditMode {
  rule?: { cell: Client.AstDecisionCell },
  header?: { header: Client.TypeDef },
}

const RowEdit: React.FC<{
  decision: Client.AstDecision,
  row: Client.AstDecisionRow,
  headers: Client.TypeDef[],
  onChange: (commands: Client.AstCommand[]) => void
}> = ({ decision, row, headers, onChange }) => {

  const [edit, setEdit] = React.useState<EditMode | undefined>();
  
  const theme = useTheme();
  const bgColor = alpha(theme.palette.warning.main, 0.1);

  const cells: Record<string, Client.AstDecisionCell> = {};
  row.cells.forEach(e => cells[e.header] = e);


  return (<TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
    <TableCell align="left" sx={{
      fontWeight: "bold",
      fontStyle: "italic"
    }}>{row.order}
      {edit?.rule ? <CellEdit dt={decision} cell={edit?.rule.cell} onClose={() => setEdit(undefined)} onChange={(command) => onChange([command])} /> : null}
    </TableCell>

    {headers.map(header => {
      const cell = cells[header.id];
      if (header.direction === "IN") {
        return (<TableCell key={cell.header} sx={{ backgroundColor: cell?.value ? undefined : bgColor }} onClick={() => setEdit({ rule: { cell } })}>
          <Typography noWrap>
            {cell?.value ? cell.value : <Box sx={{ fontWeight: "bold" }} component="span">*</Box>}
          </Typography>
        </TableCell>);
      }

      return (<TableCell key={cell.header} sx={{ backgroundColor: cell?.value ? undefined : bgColor }} onClick={() => setEdit({ rule: { cell } })}>
        <Typography noWrap>
          {cell?.value}
        </Typography>
      </TableCell>);
    })}
  </TableRow>);
}
export type { };
export { RowEdit };
