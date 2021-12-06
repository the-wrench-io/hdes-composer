import React from 'react';

import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, useTheme } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { Client } from '../../context';

import { alpha } from "@mui/material/styles";
import { RowEdit } from './RowEdit';


const DecisionHeader: React.FC<{
  decision: Client.AstDecision,
  headers: Client.TypeDef[]
}> = ({ decision, headers }) => {

  const theme = useTheme();
  const bgColor1 = alpha(theme.palette.uiElements.main, 0.1);
  return (<TableHead>
    <TableRow>
      <TableCell align="center" colSpan={decision.headers.acceptDefs.length + 1} sx={{ fontWeight: "bold" }}><FormattedMessage id="decisions.table.inputs.title" /></TableCell>
      <TableCell align="center" colSpan={decision.headers.returnDefs.length} sx={{ fontWeight: "bold", background: bgColor1 }}><FormattedMessage id="decisions.table.outputs.title" /></TableCell>
    </TableRow>

    <TableRow>
      <TableCell align="left" sx={{ fontWeight: "bold", width: "30px" }}>#</TableCell>
      {headers.map((accept) => (<TableCell key={accept.id} align="left" sx={{ fontWeight: "bold", minWidth: "50px", maxWidth: "200px" }}>{accept.name}</TableCell>))}
    </TableRow>
  </TableHead>);
}


const RowsEdit: React.FC<{ ast: Client.AstDecision, onChange: (newCommands: Client.AstCommand[]) => void }> = ({ ast, onChange }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const accepts: Client.TypeDef[] = ast ? [...ast.headers.acceptDefs].sort((a, b) => a.order - b.order) : [];
  const returns: Client.TypeDef[] = ast ? [...ast.headers.returnDefs].sort((a, b) => a.order - b.order) : [];
  const rows = React.useMemo(() => ast ? ast.rows.sort((a, b) => a.order - b.order) : [], [ast]);
  const headers: Client.TypeDef[] = [...accepts, ...returns];

  if (!ast) {
    return <span>syntax error</span>
  }

  return (<>
      <TableContainer>
        <Table stickyHeader size="small">
          <DecisionHeader decision={ast} headers={headers} />
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => <RowEdit
                headers={headers} decision={ast} row={row} key={row.id}
                onChange={(newCommands) => onChange(newCommands)} />)}
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
        onRowsPerPageChange={handleChangeRowsPerPage} />
  </>);
}

export type { };
export { RowsEdit };
