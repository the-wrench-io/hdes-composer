import React from 'react';
import { Box } from '@mui/material';

import CodeEditor from '../../code-editor';
import { Client, Composer } from '../context';


const ServiceEdit: React.FC<{service: Client.Entity<Client.AstService>}> = ({service}) => {
  const { actions } = Composer.useComposer();

  const handleChange = (value: string | undefined) => {
    actions.handlePageUpdate(service.id, [{ type: "SET_BODY", value: value }])
  }
  
  const src = service.ast?.value;

  return (<Box height="calc(100vh - 64px)">
    <CodeEditor id={service.id} mode="groovy" src={src ? src : "#--failed-to-parse"} onChange={handleChange} />
  </Box>);
}

export { ServiceEdit };
