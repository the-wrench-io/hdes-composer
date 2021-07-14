import React from 'react';


import { createStyles, makeStyles } from '@material-ui/styles';
import { Theme, Button, Box, Tooltip, Paper, ButtonGroup } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import CloseIcon from '@material-ui/icons/Close';
import TaskAltIcon from '@material-ui/icons/TaskAlt';
import InputIcon from '@material-ui/icons/Input';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

import Resource from '../';
import { Hdes } from '../deps';
import { useContext, Session } from './context';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({

  }),
);

const DebugToolbar: React.FC<{
  events: {
    toggleInputs: () => void;
  }
}> = ({ events }) => {

  const classes = useStyles();
  const context = useContext();
  const model = context.active;
  
  console.log(model)
  
  const handleExecute = () => model && context.actions.handleExecute({
    id: model.model.id,
    type: model.model.type,
    input: JSON.stringify(model.debug.entity ? model.debug.entity : {})
  });

  const handleDefault = () => model && context.actions.handleSetModelEntityDefaults(model.model);

  return (
    <ButtonGroup size="large" variant="text">
      <Tooltip title={<FormattedMessage id='debug.asset.select.execute' />}>
        <Button disabled={!model} onClick={handleExecute}><TaskAltIcon /></Button>
      </Tooltip>
      <Tooltip title={<FormattedMessage id='debug.asset.select.inputs' />}>
        <Button disabled={!model} onClick={() => model && events.toggleInputs}><InputIcon /></Button>
      </Tooltip>
      <Tooltip title={<FormattedMessage id='debug.asset.select.clear' />}>
        <Button disabled={!model} onClick={handleDefault}><CloseIcon /></Button>
      </Tooltip>
    </ButtonGroup>
  );
}

export { DebugToolbar };
