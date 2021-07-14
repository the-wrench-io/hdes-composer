import React from 'react';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Theme, Box, Paper } from '@material-ui/core';

import Resource from '../';
import { Hdes } from '../deps';

import { DebugOptions } from './DebugOptions';
import { DebugInputs } from './DebugInputs';
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
  const resource = Resource.useContext();
  const [inputs, setInputs] = React.useState<boolean>(false);


  return (
    <DebugProvider>
      <Paper className={classes.root}>
        <DebugNav />
        <Box display="flex" component="form" noValidate autoComplete="off">
          <Box width="50%"><DebugOptions /></Box>
          <Box className={classes.toolbar}><DebugToolbar events={{toggleInputs: () => setInputs(!inputs)}} /></Box>
        </Box>
        <DebugInputs expanded={inputs} setExpanded={setInputs} />
        <DebugErrors />
      </Paper>
    </DebugProvider>);
}

export type { DebugProps };
export { Debug };
