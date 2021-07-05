import React from 'react';

import { createStyles, makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import Resource from '../';


const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    changes: {
      paddingLeft: '3px'
    },
    errors: {
      paddingRight: '5px'
    }
  }),
);

const Tab: React.FC<{id: string}> = ({id}) => {
  const classes = useStyles();
  const resource = Resource.useContext();  

  const name = resource.session.getModel(id).name;
  const editor = resource.session.getEditor(id);
  const saved = editor?.saved;

  if(saved === false && editor) {
    const errors = editor.errors.length > 0;
    return (<>
      <span className={classes.changes}>*</span>
      <span>{name}</span>
      {errors ? <span className={classes.errors}><ErrorOutlineIcon color="error"/> </span>: null}
    </>);  
  }
  return (<>{name}</>);
}

export default Tab;
