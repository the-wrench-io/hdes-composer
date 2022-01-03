import React from 'react';

import { Box, TableCell, TableRow, IconButton, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { FormattedMessage } from 'react-intl';

import { Client } from '../../context';

import CodeEditor from '../../../code-editor';
import { toYaml } from './utils'

const DebugStep: React.FC<{ debug: Client.FlowResultLog }> = ({ debug }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (<>
    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} key={`${debug.id}-summary`}>
      <TableCell>
        <IconButton size="small" onClick={() => setExpanded(!expanded)}>
          {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </TableCell>
      <TableCell component="th" scope="row">
        <FormattedMessage id="debug.asset.execute.outputs.flow.step" values={{ name: debug.stepId, status: debug.status}}/>
      </TableCell>
    </TableRow>

    <TableRow key={`${debug.id}-details`} sx={expanded ? undefined : { visibility: "hidden" }}>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <CodeEditor id="debug-input" mode="yaml" src={toYaml(debug)} onChange={(value) => { console.log(value); }} />
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  </>);
}

const DebugOutputsFl: React.FC<{ debug: Client.FlowResult }> = ({ debug }) => {
  return (<>{debug.logs.map(e => <DebugStep debug={e} />)}</>);
}

export { DebugOutputsFl };


/*
import {
  Accordion, AccordionSummary, AccordionDetails, Typography, useTheme, Theme,
  List, ListItem, ListItemText, Divider, Grid
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Hdes, CodeEditor } from '../deps';
import { useContext, Session } from './context';


const Task: React.FC<{
  task: Hdes.DebugAPI.FlTask, errors?: { msg: string, stackTrace: string }
}> = ({ task, errors }) => {

  const [expand, setExpand] = React.useState(false);
  const theme = useTheme();
  const data = task.variables[task.modelId];

  let content = (<></>);
  if (task.status === "OPEN" && errors) {
    content = (<List disablePadding dense>
        {[{id: "msg", value: errors.msg}, {id: "stackTrace", value: errors.stackTrace}].map((error) => (<>
          <ListItem>
            <ListItemText
              primary={` — ${error.id}`}
              secondary={<Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.error">{error.value}</Typography>}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </>))}
      </List>);
  } else {
    content = (<Grid container spacing={3}>
      <Grid item xs={6}>
        <CodeEditor.Provider mode="json" theme={theme.palette.mode === 'dark' ? 'dark' : 'light'} value={JSON.stringify(task.inputs, null, 2)} onCommands={() => { }} />
      </Grid>
      <Grid item xs={6}>
        <CodeEditor.Provider mode="json" theme={theme.palette.mode === 'dark' ? 'dark' : 'light'} value={JSON.stringify(data, null, 2)} onCommands={() => { }} />
      </Grid>
    </Grid>);
  }

  return (<Accordion expanded={expand} onChange={() => setExpand(!expand)}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography color={task.status === "OPEN" ? "error" : "primary"}>{`${task.id} - ${task.modelId} - ${task.status}`}</Typography>
    </AccordionSummary>
    <AccordionDetails>{content}</AccordionDetails>
  </Accordion>
  )
}

const DebugOutputsFl: React.FC<{}> = () => {
  const context = useContext();
  const active: Session.Active = context.active as Session.Active;
  const debug: Hdes.DebugAPI.FlDebug = active.debug.output.service;
  const errors = debug.result._errors;

  return (<>
    {debug.debug.context.tasks
      .filter(task => !task.modelId.endsWith("-MERGE"))
      .filter(task => task.modelId !== "end")
      .map((task, index) => (<Task key={index} task={task} errors={errors}/>))}
  </>);
}

export { DebugOutputsFl };

*/
