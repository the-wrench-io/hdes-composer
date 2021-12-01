import React from 'react';
import { Grid, Box } from '@mui/material';

import CodeEditor from '../../code-editor';
import { Client } from '../context';


const FlowEdit: React.FC<{flow: Client.Entity<Client.AstFlow>}> = ({flow}) => {

  console.log(flow);

  return (<Box>
    <Grid container spacing={0}>
      <Grid item xs={6}>
        <CodeEditor mode="fl" onCommands={() => {}} />
      </Grid>
      <Grid item xs={6}>
      </Grid>
    </Grid>
  </Box>);
}

export { FlowEdit };
