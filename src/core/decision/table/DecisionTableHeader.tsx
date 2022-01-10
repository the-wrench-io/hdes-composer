import React from 'react';

import { Box, TableCell, TableHead, TableRow } from '@mui/material';
import { FormattedMessage } from 'react-intl'

import { Client } from '../../context';


const DecisionTableHeader: React.FC<{
  ast: Client.AstDecision,
  headers: Client.TypeDef[],
  children: React.ReactNode,
  onClick: (header: Client.TypeDef) => void
}> = ({ ast, headers, children, onClick }) => {
  const totalCols = ast.headers.returnDefs.length + ast.headers.acceptDefs.length + 1;

  return (<TableHead sx={{ position: "sticky", top: 0 }}>
      <TableRow>
        <TableCell align="left" colSpan={totalCols} sx={{ fontWeight: "bold", borderBottom: "unset", pl: 0 }}>
          <Box display="flex" alignItems="center">
            <Box>{children}</Box>
            <Box sx={{ ml: 1 }}>
              {ast.name} - <FormattedMessage id="decisions.table.hitpolicy" />: {ast.hitPolicy}
            </Box>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell align="center" colSpan={ast.headers.acceptDefs.length + 1}
          sx={{ fontWeight: "bold", backgroundColor: "page.main", color: "primary.contrastText" }}>
          <FormattedMessage id="decisions.table.inputs.title" />
        </TableCell>
        <TableCell align="center" colSpan={ast.headers.returnDefs.length}
          sx={{ fontWeight: "bold", backgroundColor: "uiElements.main", color: "primary.contrastText" }}>
          <FormattedMessage id="decisions.table.outputs.title" />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell align="left" sx={{ fontWeight: "bold", width: "30px", backgroundColor: "page.main", color: "primary.contrastText" }}>#</TableCell>
        {headers.map((accept) => (
          <TableCell key={accept.id} align="left" 
            onClick={() => onClick(accept)}
            sx={{
              fontWeight: "bold", minWidth: "50px", maxWidth: "200px",
              backgroundColor: accept.direction === "OUT" ? "uiElements.main" : "page.main",
              color: "primary.contrastText"
            }}>
            {accept.name}
          </TableCell>))}
      </TableRow>
    </TableHead>);
}

export type { };
export { DecisionTableHeader };
