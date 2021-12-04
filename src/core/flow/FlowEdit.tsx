import React from 'react';
import { Box } from '@mui/material';

import CodeEditor from '../../code-editor';
import { Client } from '../context';


const FlowEdit: React.FC<{flow: Client.Entity<Client.AstFlow>}> = ({flow}) => {

  console.log(flow);
  const src = flow.ast?.src.value;

  return (<Box height="100%">
    <CodeEditor mode="yaml" src={src ? src : "#--failed-to-parse"}/>
  </Box>);
}

export { FlowEdit };
