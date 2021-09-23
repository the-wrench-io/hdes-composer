import React from 'react';

import { createStyles, makeStyles } from '@mui/material/styles';
import { Theme } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import { Layout } from '../deps';
import Resource from '../';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
     
    }
  }),
);


const SaveButton: React.FC<{}> = () => {
  const classes = useStyles();
  const resource = Resource.useContext();
  const layout = Layout.useContext();
  
  const tabs = layout.session.tabs;
  const active = tabs[layout.session.history.open];
  
  if(!active) {
    return (<SaveIcon />);
  }
  
  const editor = resource.session.editor.getContent(active.id);
  if(!editor || editor.saved === true) {
    return (<SaveIcon />);
  }
  
  const errors = editor.errors;
  if(errors.length > 0) {
    return (<SaveIcon color="error" className={classes.root}/>);
  }
  
  return (
    <SaveIcon color="secondary" className={classes.root}/>
  );
}
export { SaveButton };


