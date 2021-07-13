import React from 'react';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Theme, Button, Box, Tooltip, Paper } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import CloseIcon from '@material-ui/icons/Close';
import TaskAltIcon from '@material-ui/icons/TaskAlt';

import Resource from '../';
import { Hdes } from '../deps';

import { DebugOptions } from './DebugOptions';
import { Inputs } from './Inputs';
import { Nav } from './Nav';
import { DebugErrors } from './DebugErrors';
import API from './DebugAPI';



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      overflow: 'auto'
    },
    select: {
      '& .MuiTextField-root': {
        padding: theme.spacing(1)
      },
    },
    button: {
      height: '100%'
    },
  }),
);

interface DebugProps {
};

const Debug: React.FC<DebugProps> = () => {
  const classes = useStyles();
  const resource = Resource.useContext();
  const service = resource.service;
  const [model, setModel] = React.useState<Hdes.ModelAPI.Model>();
  const [inputs, setInputs] = React.useState<boolean>(false);
  const [context, setContext] = React.useState<API.DebugContext>(React.useMemo(() => API.initContext(service), [service]));

  React.useEffect(() => {
    if (!model || context.getModel(model.id)) {
      return;
    }

    setContext(context.withModel(model));
  }, [model, setContext, context]);

  const handleExecute = () => {
    if (!model) {
      return;
    }
    const input = context.getModel(model.id)?.entity;
    resource.service.debug.getDebug({
      id: model.id,
      type: model.type,
      input: JSON.stringify(input ? input : {})
    }).then(debug => console.log(debug))
      .catch(errors => setContext(context.withModelErrors({ modelId: model.id, errors })));
  }

  const getDebugData = () => {
    const debugData = model ? context.getModel(model.id) : undefined;
    if (!debugData || !model) {
      return null;
    }

    return (<>
      <Inputs data={debugData} expanded={inputs} setExpanded={setInputs}
        onChange={(param, value) => setContext(context.withModelEntity({ modelId: model.id, entity: param.name, value }))} />
      <DebugErrors children={debugData} />
    </>);
  }

  return (
    <Paper className={classes.root}>
      <Nav context={context} setActive={setModel} active={model} />

      <Box display="flex" component="form" noValidate autoComplete="off" className={classes.select}>
        <Box width="50%"><DebugOptions onChange={setModel} /></Box>
        <Box className={classes.select} flexGrow={1} alignSelf="center">
          <div>
            <Tooltip title={<FormattedMessage id='debug.asset.select.execute' />}>
              <Button className={classes.select} disabled={!model} onClick={handleExecute} color="secondary"><TaskAltIcon /></Button>
            </Tooltip>
            <Tooltip title={<FormattedMessage id='debug.asset.select.clear' />}>
              <Button className={classes.select} disabled={!model} onClick={() => model && setContext(context.withoutModelEntity(model.id))} color="secondary"><CloseIcon /></Button>
            </Tooltip>
          </div>
        </Box>
      </Box>

      { getDebugData()}
    </Paper>);
}

export type { DebugProps };
export { Debug };
