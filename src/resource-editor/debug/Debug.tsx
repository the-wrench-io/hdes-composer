import React from 'react';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Theme, Autocomplete, TextField, Button, Box, Tooltip, Breadcrumbs, Link, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import CloseIcon from '@material-ui/icons/Close';
import TaskAltIcon from '@material-ui/icons/TaskAlt';

import Resource from '../';
import { Hdes } from '../deps';
import { Inputs } from './Inputs';
import { Nav } from './Nav';
import API from './DebugAPI';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiTextField-root': {
        padding: theme.spacing(1)
      }
    },
    select: {

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
  const [model, setModel] = React.useState<Hdes.ModelAPI.Model>();
  const [context, setContext] = React.useState<API.DebugContext>(API.initContext());

  React.useEffect(() => {
    if (!model || context.getModel(model.id)) {
      return;
    }
    setContext(context.withModel(model.id));
  }, [model, setContext, context]);

  const handleClear = () => {
    if (!model) {
      return;
    }
    setContext(context.withoutModelEntity(model.id));
  }
  const handleInputChange = (param: Hdes.ModelAPI.DataType, value: string) => {
    if (!model) {
      return;
    }
    setContext(context.withModelEntity({ modelId: model.id, entity: param.name, value }));
  }

  const handleExecute = () => {
    if(!model) {
      return;
    }
    const input = context.getModel(model.id)?.entity;
    resource.service.debug.getDebug({
      id: model.id, 
      type: model.type, 
      input: JSON.stringify(input ? input : {}) })
    .then(debug => console.log(debug))
    .catch(errors => console.error(errors) );
  }


  const options: Hdes.ModelAPI.Model[] = [...resource.session.models.DT, ...resource.session.models.FLOW, ...resource.session.models.FLOW_TASK];
  return (
    <Box component="form" noValidate autoComplete="off" className={classes.root}>
      <Nav context={context} setActive={setModel} active={model} />
      
      <Box display="flex">
        <Box width="30%">
          <Autocomplete fullWidth
            onChange={(_event, entity) => setModel(entity as any)}
            options={options.sort((a, b) => {
              const type = b.type.localeCompare(a.type);
              if (type === 0) {
                return -b.name.localeCompare(a.name);
              }
              return type;
            })}
            groupBy={(option) => option.type}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label={<FormattedMessage id="debug.asset.select.label" />} variant="filled" />}
          />
        </Box>
        <Box className={classes.select} flexGrow={1} alignSelf="center">
          <div>
            <Tooltip title={<FormattedMessage id='debug.asset.execute' />}>
              <Button className={classes.select} onClick={handleExecute} color="secondary"><TaskAltIcon /></Button>
            </Tooltip>

            <Tooltip title={<FormattedMessage id='debug.asset.select.clear.input' />}>
              <Button className={classes.select} onClick={handleClear} color="secondary"><CloseIcon /></Button>
            </Tooltip>
          </div>
        </Box>
      </Box>

      {model ? <Inputs data={context.getModel(model.id)} onChange={handleInputChange} /> : null}
    </Box>);
}

export type { DebugProps };
export { Debug };
