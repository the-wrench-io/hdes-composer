import React from 'react';
import { Box, Typography } from '@mui/material';
import TreeView from "@mui/lab/TreeView";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";


import { Composer } from '../../context';
import FlowItem from './FlowItem';


const findMainId = (values: string[]) => {
  const result = values.filter(id => !id.endsWith("-nested"));
  if (result.length) {
    return result[0];
  }
  return undefined;
}


const FlowExplorer: React.FC<{}> = () => {
  const { session } = Composer.useComposer();
  const [expanded, setExpanded] = React.useState<string[]>([]);


  return (
    <Box>
      <Typography align="left"
        sx={{
          fontVariant: 'all-petite-caps',
          fontWeight: 'bold',
          color: 'explorerItem.main',
          ml: 1, mr: 1, mb: 1,
          borderBottom: '1px solid',
        }}>
      </Typography>

      <TreeView expanded={expanded}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
        onNodeToggle={(_event: React.SyntheticEvent, nodeIds: string[]) => {
          const active = findMainId(expanded);
          const newId = findMainId(nodeIds.filter(n => n !== active));
          if (active !== newId && active && newId) {
            nodeIds.splice(nodeIds.indexOf(active), 1);
          }
          setExpanded(nodeIds);
        }}>
        { Object.values(session.site.flows)
          .map(flow => (<FlowItem key={flow.id} flowId={flow.id} />))
        }
      </TreeView>
    </Box>
  );
}

export { FlowExplorer }

