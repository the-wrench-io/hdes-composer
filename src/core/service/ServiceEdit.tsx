import React from 'react';
import { Box } from '@mui/material';

import CodeEditor from '../../code-editor';
import { Client } from '../context';


const ServiceEdit: React.FC<{service: Client.Entity<Client.AstService>}> = ({service}) => {

  console.log(service);
  const src = service.ast?.value;

  return (<Box height="100%">
    <CodeEditor mode="groovy" src={src ? src : "#--failed-to-parse"}/>
  </Box>);
}

export { ServiceEdit };
