import React from 'react';

import { Button, Tooltip, ButtonGroup } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import CloseIcon from '@mui/icons-material/Close';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import InputIcon from '@mui/icons-material/Input';

import Explorer from '../explorer';
import { useContext } from './context';
import { Layout } from '../deps';


const DebugToolbar: React.FC<{}> = () => {

  const layout = Layout.useContext();
  const context = useContext();
  const model = context.active;
  
  const handleExecute = () => model && context.actions.handleExecute({
    id: model.model.id,
    type: model.model.type,
    input: JSON.stringify(model.debug.entity ? model.debug.entity : {})
  });

  const handleDefault = () => model && context.actions.handleSetModelEntityDefaults(model.model);
  const handleOpen = () => model && Explorer.openTab(model.model, layout.actions);

  return (
    <ButtonGroup size="large" variant="text">
      <Tooltip title={<FormattedMessage id='debug.asset.select.execute' />}>
        <Button disabled={!model} onClick={handleExecute}><TaskAltIcon /></Button>
      </Tooltip>
      <Tooltip title={<FormattedMessage id='debug.asset.select.open' />}>
        <Button disabled={!model} onClick={handleOpen}><InputIcon /></Button>
      </Tooltip>
      <Tooltip title={<FormattedMessage id='debug.asset.select.clear' />}>
        <Button disabled={!model} onClick={handleDefault}><CloseIcon /></Button>
      </Tooltip>
    </ButtonGroup>
  );
}

export { DebugToolbar };
