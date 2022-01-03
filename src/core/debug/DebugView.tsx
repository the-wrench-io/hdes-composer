import React from 'react';
import { Box, TableContainer, Table, TableBody } from '@mui/material';

import Burger from '@the-wrench-io/react-burger';
import { Client, Composer } from '../context';

import { DebugDrawer } from './drawer/DebugDrawer';
import { SelectAsset } from './drawer/SelectAsset';
import { InputCSV } from './drawer/InputCSV';
import { InputJSON } from './drawer/InputJSON';
import { InputFORM } from './drawer/InputFORM';

import { DebugError } from './DebugError';
import { DebugHeader } from './DebugHeader';
import { DebugInput } from './DebugInput';
import { DebugOutput } from './outputs/DebugOutput';
import { DebugOptionType } from './api';


const getData = (session: Composer.Session): {
  ast?: Client.AstBody;
  entity?: Client.Entity<Client.AstBody>
  debug?: Composer.DebugSession;
} => {
  const entity = session.debug.selected ? session.getEntity(session.debug.selected) : undefined;
  const ast = entity ? entity?.ast : undefined;
  const debug: Composer.DebugSession | undefined = session.debug.selected ? session.debug.values[session.debug.selected] : undefined;  
  return { ast, debug, entity };
}


const DebugView: React.FC<{}> = ({ }) => {
  const { service, session, actions } = Composer.useComposer();
  const nav = Composer.useNav();
  const { ast, debug, entity } = getData(session);
  const [option, setOption] = React.useState<DebugOptionType | undefined>();
    
  const selected = debug?.selected ? debug.selected : "";
  const json = debug?.json;
  const csv = debug?.csv ? debug.csv : "";
  const inputType = debug ? debug.inputType : "JSON";
  const response = debug?.debug;
  const error = debug?.error;
  
  
  /*
  const [option, setOption] = React.useState<DebugOptionType | undefined>();
  const [inputType, setInputType] = React.useState<DebugInputType>("JSON");
  const [csv, setCsv] = React.useState<string>("");
  const [json, setJson] = React.useState<string>();
  const [selected, setSelected] = React.useState<Client.Entity<Client.AstBody>>();
  const [debug, setDebug] = React.useState<Client.DebugResponse>();
  const [error, setError] = React.useState<Client.StoreError>();*/
  

  const handleCsv = (csv: string) => {
    actions.handleDebugUpdate({ inputType: "CSV", csv, selected, debug: response, error, json })
  }
  const handleJson = (input: object) => {
    actions.handleDebugUpdate({ inputType: "JSON", csv, selected, debug: response, error, json: JSON.stringify(input) })
  }
  const handleSelectAsset = (selected: Client.Entity<Client.AstBody>) => {
    if(session.debug.selected && session.debug.selected !== selected.id) {
      const previous = session.debug.values[selected.id];
      if(previous) {
        setOption(undefined);
        actions.handleDebugUpdate(previous);
        return;        
      }
    }
    
    const elements = selected?.ast ? selected.ast.headers.acceptDefs : [];
    const data = {};
    for(const parameter of elements) {
      if (parameter.values !== undefined) {
        data[parameter.name] = parameter.values ? parameter.values : "";
      }
    }
    actions.handleDebugUpdate({ inputType: "JSON", csv, selected: selected.id, debug: response, error, json: JSON.stringify(data) })
    setOption("INPUT_FORM");
  }
  
  const handleExecute = () => {
    if(!selected) {
      return;
    }

    service.debug({ 
      id: selected, 
      input: inputType === 'JSON' ? json : undefined,
      inputCSV: inputType === 'CSV' ? csv : undefined })
    .then(response => actions.handleDebugUpdate({ inputType, csv, selected, json, debug: response, error: undefined }))
    .catch(error => actions.handleDebugUpdate({ inputType, csv, selected, json, error, debug: undefined }))
  }

  return (<Box sx={{ width: '100%', overflow: 'hidden', padding: 1 }}>

    <DebugDrawer selected={selected} open={option === "DRAWER"} onClose={() => setOption(undefined)} onSelect={setOption} />

    {option === 'SELECT_ASSET' ? <SelectAsset onClose={() => setOption(undefined)} selected={selected} onSelect={handleSelectAsset} /> : null}
    {option === 'INPUT_JSON' && json ? <InputJSON onClose={() => setOption(undefined)} onSelect={handleJson} value={json} /> : null}
    {option === 'INPUT_FORM' && json ? <InputFORM onClose={() => setOption(undefined)} selected={selected} onSelect={handleJson} value={json} /> : null}
    {option === 'INPUT_CSV' ? <InputCSV onClose={() => setOption(undefined)} selected={selected} onSelect={handleCsv} value={csv} /> : null}


    <TableContainer sx={{ height: "calc(100vh - 150px)" }}>
      <Table stickyHeader size="small">
        <DebugHeader>
          { ast ? 
            (<Burger.PrimaryButton label={`${ast?.bodyType} - ${ast?.name}`} onClick={() => setOption('SELECT_ASSET')} />) : 
            (<Burger.PrimaryButton label="debug.toolbar.noAsset" onClick={() => setOption('SELECT_ASSET')} />) 
          }
          <Burger.PrimaryButton disabled={selected ? false : true} label="debug.toolbar.openAsset" onClick={() => entity && nav.handleInTab({ article: entity })} sx={{ml: 1}}/>
          <Burger.PrimaryButton label="debug.toolbar.options" onClick={() => setOption('DRAWER')} sx={{ml: 1}}/>
          <Burger.PrimaryButton disabled={selected ? false : true} label="debug.toolbar.execute" onClick={() => handleExecute()} sx={{ml: 1}}/>
        </DebugHeader>

        <TableBody>
          {json ? <DebugInput type={inputType} csv={csv} json={json}/> : null}
          {error ? <DebugError error={error} /> : null}
          {response ? <DebugOutput debug={response} selected={ast} /> : null}
        </TableBody>
      </Table>
    </TableContainer>
  </Box >);
}

export { DebugView };
