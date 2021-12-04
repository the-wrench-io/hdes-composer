import React from 'react';

import {
  Box, Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useTheme,
  Typography
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { Client } from '../context';

import { styled, darken, alpha } from "@mui/material/styles";
import { SxProps } from '@mui/system';



//import { Hdes } from './deps';
//import { VirtTable, VirtTableProps } from './virt/VirtTable'
//import { DecisionTableToolbar } from './DecisionTableToolbar';
//import CellEditor from './edit/cell-editor';
//import HeaderEditor from './edit/HeaderEditor';

const DecisionRow: React.FC<{
  decision: Client.Entity<Client.AstDecision>,
  row: Client.AstDecisionRow,
  headers: Client.TypeDef[]
}> = ({ decision, row, headers }) => {

  const theme = useTheme();
  const bgColor = alpha(theme.palette.warning.main, 0.1);

  const cells: Record<string, Client.AstDecisionCell> = {};
  row.cells.forEach(e => cells[e.header] = e);

  return (<TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
    <TableCell align="left" sx={{
      fontWeight: "bold", 
      fontStyle: "italic"}}>{row.order}</TableCell>
    
    {headers.map(header => {
      const cell = cells[header.id];

      if (header.direction === "IN") {
        return (<TableCell sx={{ backgroundColor: cell?.value ? undefined : bgColor }}>
          <Typography noWrap>
            {cell?.value ? cell.value : <Box sx={{ fontWeight: "bold" }} component="span">*</Box>}
          </Typography>
        </TableCell>);
      }

      return (<TableCell sx={{ backgroundColor: cell?.value ? undefined : bgColor }}>
        <Typography noWrap>
          {cell?.value}
        </Typography>
      </TableCell>);
    })}
  </TableRow>);
}

const DecisionHeader: React.FC<{
  decision: Client.Entity<Client.AstDecision>,
  accepts: Client.TypeDef[],
  returns: Client.TypeDef[]
}> = ({ decision, accepts, returns }) => {

  const theme = useTheme();
  const bgColor1 = alpha(theme.palette.uiElements.main, 0.1);
  const ast: Client.AstDecision = decision.ast as any;
  return (<TableHead>
    <TableRow>
      <TableCell align="center" colSpan={ast.headers.acceptDefs.length+1} sx={{ fontWeight: "bold" }}><FormattedMessage id="decisions.table.inputs.title" /></TableCell>
      <TableCell align="center" colSpan={ast.headers.returnDefs.length} sx={{ fontWeight: "bold", background: bgColor1 }}><FormattedMessage id="decisions.table.outputs.title" /></TableCell>
    </TableRow>

    <TableRow>
      <TableCell align="left" sx={{ fontWeight: "bold", width: "30px"}}>#</TableCell>
      {accepts.map((accept) => (
        <TableCell key={accept.id} align="left" sx={{ fontWeight: "bold", minWidth: "50px", maxWidth: "200px"}}>
          {accept.name}
        </TableCell>
      ))}

      {returns.sort((a, b) => b.order - a.order).map((accept) => (
        <TableCell key={accept.id} align="left" sx={{ fontWeight: "bold", minWidth: "50px", maxWidth: "200px" }}>
          {accept.name}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>);
}


const DecisionEdit: React.FC<{ decision: Client.Entity<Client.AstDecision> }> = ({ decision }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const { ast } = decision;
  const accepts: Client.TypeDef[] = ast ? [...ast.headers.acceptDefs].sort((a, b) => a.order - b.order) : [];
  const returns: Client.TypeDef[] = ast ? [...ast.headers.returnDefs].sort((a, b) => a.order - b.order) : [];
  const rows = React.useMemo(() => decision.ast ? decision.ast.rows.sort((a, b) => a.order - b.order) : [], [decision]);

  const headers: Client.TypeDef[] = [...accepts, ...returns];

  return (<Box>
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader size="small">
          <DecisionHeader decision={decision} accepts={accepts} returns={returns} />
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => <DecisionRow headers={headers} decision={decision} row={row} />)}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[50, 100, 200]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  </Box>);
}

export type { };
export { DecisionEdit };
