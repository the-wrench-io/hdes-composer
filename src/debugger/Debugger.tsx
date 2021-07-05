import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles, createStyles } from '@material-ui/styles';

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
    },
  }),
);

interface DebuggerProps {
};

const Debugger: React.FC<DebuggerProps> = () => {
  const classes = useStyles();
  return (<div className={classes.root}>tatdatta</div>);
}

export type {DebuggerProps};
export {Debugger};
