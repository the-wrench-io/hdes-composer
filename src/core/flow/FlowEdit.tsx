import React from 'react';
import { Box } from '@mui/material';

import CodeEditor from '../../code-editor';
import { Client, Composer } from '../context';
import Graph from './graph';


const SticyGraph: React.FC<{ flow: Client.Entity<Client.AstFlow>, site: Client.Site }> = ({ flow, site }) => {
  return (<Box sx={{ top: "64px", right: "30px", position: "absolute", zIndex: "100000000000" }}>
    <Graph flow={flow} site={site}
      onClick={() => console.log("single")}
      onDoubleClick={() => console.log("double")} />
  </Box>);
}

const FlowEdit: React.FC<{ flow: Client.Entity<Client.AstFlow> }> = ({ flow }) => {
  const { session, actions } = Composer.useComposer();
  const { site } = session;

  const handleChange = (value: string | undefined) => {
    actions.handlePageUpdate(flow.id, [{ type: "SET_BODY", value: value }])
  }
  const src = flow.ast?.src.value;

  return (<Box height="100%">
    {flow.ast ? <SticyGraph flow={flow} site={site} /> : undefined}
    <CodeEditor id={flow.id} mode="yaml" src={src ? src : "#--failed-to-parse"} onChange={handleChange} />
  </Box>);
}

export { FlowEdit };
