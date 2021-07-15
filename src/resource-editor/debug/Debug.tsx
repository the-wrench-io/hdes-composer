import React from 'react';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Theme, Box, Paper } from '@material-ui/core';

import { DebugOptions } from './DebugOptions';
import { DebugInputs } from './DebugInputs';
import { DebugOutputs } from './DebugOutputs';
import { DebugNav } from './DebugNav';
import { DebugErrors } from './DebugErrors';
import { DebugToolbar } from './DebugToolbar';
import { DebugProvider } from './context';



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      overflow: 'auto',
      '& .MuiTextField-root': {
        padding: theme.spacing(1)
      },
    },
    toolbar: {
      flexGrow: 1,
      alignSelf: "center",
      padding: theme.spacing(1)
    },
  }),
);

interface DebugProps {
};

const Debug: React.FC<DebugProps> = () => {
  const classes = useStyles();
  const [inputs, setInputs] = React.useState<boolean>(false);
  const [outputs, setOutputs] = React.useState<boolean>(true);

  const events = {
    setInputs: (value: boolean) => setInputs(value)
  };

  return (
    <DebugProvider>
      <Paper className={classes.root}>
        <DebugNav />
        <Box display="flex" component="form" noValidate autoComplete="off">
          <Box width="50%"><DebugOptions events={events} /></Box>
          <Box className={classes.toolbar}><DebugToolbar events={events} /></Box>
        </Box>
        <DebugInputs expanded={inputs} setExpanded={setInputs} />
        <DebugOutputs expanded={outputs} setExpanded={setOutputs} />
        <DebugErrors />
      </Paper>
    </DebugProvider>);
}

export type { DebugProps };
export { Debug };
