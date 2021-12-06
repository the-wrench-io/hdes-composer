import React from 'react';

import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, useTheme, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { Client, Composer } from '../context';

import { alpha } from "@mui/material/styles";
import RowsEdit from './row-cell-editor';




const DecisionEdit: React.FC<{ decision: Client.Entity<Client.AstDecision> }> = ({ decision }) => {
  const { service, actions, session } = Composer.useComposer();


  const update = session.pages[decision.id];
  const commands = React.useMemo(() => update ? update.value : decision.source.commands, [decision, update]);
  const [ast, setAst] = React.useState<Client.AstDecision | undefined>();


  React.useEffect(() => {
    
    
    service.ast(decision.id, commands).then(data => {
      console.log("new commands");
      setAst(data.ast);
    });

  }, [commands ])


  if (!ast) {
    return <span>loading ...</span>
  }

  return (<Box>
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <RowsEdit key={decision.id} ast={ast} onChange={(newCommands) => actions.handlePageUpdate(decision.id, [...commands, ...newCommands])} />
    </Paper>
  </Box>);
}

export type { };
export { DecisionEdit };
