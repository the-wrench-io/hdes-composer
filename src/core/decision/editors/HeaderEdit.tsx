import React from 'react';

import { Button, Box, Grid, ListItemText } from '@mui/material';
import Burger from '@the-wrench-io/react-burger';
import { Client } from '../../context';


interface HeaderEditProps {
  dt: Client.AstDecision,
  header: Client.TypeDef;
  onClose: () => void;
  onChange: (commands: Client.AstCommand[]) => void
};

/**
          case 'name': return {type: 'SET_HEADER_REF', id: id, value: change.get('name')}
          case 'ref': return {type: 'SET_HEADER_EXTERNAL_REF', id: id, value: change.get('ref')}
          case 'value': return {type: 'SET_HEADER_TYPE', id: id, value: change.get('value')}
          case 'script': return {type: 'SET_HEADER_SCRIPT', id: id, value: change.get('script')}
          case 'direction': return {type: 'SET_HEADER_DIRECTION', id: id, value: change.get('direction')}
          case 'expression': return {type: 'SET_HEADER_EXPRESSION', id: id, value: change.get('expression')} }
 */

const addCommand = (command: Client.AstCommand, commands: Client.AstCommand[]) => {
  const result: Client.AstCommand[] = [];
  for (const previous of commands) {
    if (command.type === previous.type) {
      
    } else {
      result.push(previous);
    }
  }
  result.push(command);
  return result;
}

const HeaderEdit: React.FC<HeaderEditProps> = ({ dt, header, onClose, onChange }) => {
  const [commands, setCommands] = React.useState<Client.AstCommand[]>([]);
  const [exp, setExp] = React.useState<string>('');
  const [name, setName] = React.useState<string>(header.name);
  const [script, setScript] = React.useState<string>('');
  const [valueType, setValueType] = React.useState<string>(header.valueType);
  const expressions = dt.headerExpressions[header.valueType] ;
  
  const editor = (
    <Box component="form" noValidate autoComplete="off">
      <Grid container spacing={2}>

        {/** name and type */}
        <Grid item xs={6}>
          <Burger.TextField label="dt.header.name"
            value={name}
            onChange={(value: string) => {
              setCommands(addCommand({ type: 'SET_HEADER_REF', id: header.id, value }, commands));
              setName(value);
            }} />
        </Grid>
        <Grid item xs={6}>
          <Burger.Select label="dt.header.dataType"
            selected={valueType}
            onChange={(value) => {
              setCommands(addCommand({ type: 'SET_HEADER_TYPE', id: header.id, value }, commands));
              setValueType(value);
            }}
            empty={{ id: '', label: 'dt.header.dataType' }}
            items={dt.headerTypes.map((type) => ({
              id: type,
              value: (<ListItemText primary={type} />)
            }))}
          />
        </Grid>

        <Grid item xs={6}>
          {header.direction === 'OUT' ? null : (
            <Burger.Select label="dt.header.expression"
              selected={exp}
              onChange={(value) => {
                setCommands(addCommand({ type: 'SET_HEADER_EXPRESSION', id: header.id, value }, commands));
                setExp(value);
              }}
              empty={{ id: '', label: 'dt.header.expression' }}
              items={(expressions ? expressions : []).map((type) => ({
                id: type,
                value: (<ListItemText primary={type} />)
              }))} />)}

          {header.direction === 'IN' ? null : (
            <Burger.Select label="dt.header.script"
              selected={script}
              onChange={(value) => {
                setCommands(addCommand({ type: 'SET_HEADER_SCRIPT', id: header.id, value }, commands));
                setScript(value);
              }}
              empty={{ id: '', label: 'dt.header.script' }}
              items={(expressions ? expressions : []).map((type) => ({
                id: type,
                value: (<ListItemText primary={type} />)
              }))} />)}
        </Grid>
      </Grid>
    </Box >);


  return (<Burger.Dialog open={true}
    onClose={onClose}
    children={editor}
    backgroundColor="uiElements.main"
    title='decisions.header.dialog.title'
    titleArgs={{
      name: header.name
    }}
    actions={
      <Burger.SecondaryButton label="dt.header.delete" onClick={() => {
        onChange([{ type: 'DELETE_HEADER', id: header.id }]);
        onClose();
      }} />
    }
    submit={{
      title: "buttons.apply",
      disabled: false,
      onClick: () => {
        onChange(commands);
        onClose();
      }
    }}
  />);
}

export type { HeaderEditProps };
export { HeaderEdit };
