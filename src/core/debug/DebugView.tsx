import React from 'react';
import { Box, TableContainer, Table, TableBody } from '@mui/material';

import Burger from '@the-wrench-io/react-burger';
import { Client, Composer } from '../context';
import { DebugInputType, DebugOptionType } from './api';

import { DebugDrawer } from './drawer/DebugDrawer';
import { SelectAsset } from './drawer/SelectAsset';
import { InputCSV } from './drawer/InputCSV';
import { InputJSON } from './drawer/InputJSON';
import { InputFORM } from './drawer/InputFORM';

import { DebugError } from './DebugError';
import { DebugHeader } from './DebugHeader';
import { DebugInput } from './DebugInput';
import { DebugOutput } from './outputs/DebugOutput';


const DebugView: React.FC<{}> = ({ }) => {
  const { service } = Composer.useComposer();
  const nav = Composer.useNav();
  const [option, setOption] = React.useState<DebugOptionType | undefined>();
  const [inputType, setInputType] = React.useState<DebugInputType>("JSON");
  const [csv, setCsv] = React.useState<string>("");
  const [json, setJson] = React.useState<string>();
  const [selected, setSelected] = React.useState<Client.Entity<Client.AstBody>>();
  const [debug, setDebug] = React.useState<Client.DebugResponse>();
  const [error, setError] = React.useState<Client.StoreError>();
  
  const ast = selected?.ast;

  const handleCsv = (csv: string) => {
    setCsv(csv);
    setInputType("CSV");
  }

  const handleJson = (input: object) => {
    setJson(JSON.stringify(input));
    setInputType("JSON");
  }
  
  const handleSelectAsset = (selected: Client.Entity<Client.AstBody>) => {
    const elements = selected?.ast ? selected.ast.headers.acceptDefs : [];
    const data = {};
    for(const parameter of elements) {
      if (parameter.values !== undefined) {
        data[parameter.name] = parameter.values ? parameter.values : "";
      }
    }
    setSelected(selected);      
    setJson(JSON.stringify(data));
    setOption("INPUT_FORM");
  }
  
  const handleExecute = () => {
    if(!selected) {
      return;
    }
    setDebug(undefined);
    setError(undefined);
    service.debug({ 
      id: selected.id, 
      input: inputType === 'JSON' ? json : undefined,
      inputCSV: inputType === 'CSV' ? csv : undefined 
    }).then(setDebug).catch(setError)
  }

  return (<Box sx={{ width: '100%', overflow: 'hidden', padding: 1 }}>

    <DebugDrawer selected={selected?.id} open={option === "DRAWER"} onClose={() => setOption(undefined)} onSelect={setOption} />

    {option === 'SELECT_ASSET' ? <SelectAsset onClose={() => setOption(undefined)} selected={selected?.id} onSelect={handleSelectAsset} /> : null}
    {option === 'INPUT_JSON' && json ? <InputJSON onClose={() => setOption(undefined)} onSelect={handleJson} value={json} /> : null}
    {option === 'INPUT_FORM' && json ? <InputFORM onClose={() => setOption(undefined)} selected={selected?.id} onSelect={handleJson} value={json} /> : null}
    {option === 'INPUT_CSV' ? <InputCSV onClose={() => setOption(undefined)} selected={selected?.id} onSelect={handleCsv} value={csv} /> : null}


    <TableContainer sx={{ height: "calc(100vh - 150px)" }}>
      <Table stickyHeader size="small">
        <DebugHeader>
          { ast ? 
            (<Burger.PrimaryButton label={`${ast.bodyType} - ${ast.name}`} onClick={() => setOption('SELECT_ASSET')} />) : 
            (<Burger.PrimaryButton label="debug.toolbar.noAsset" onClick={() => setOption('SELECT_ASSET')} />) 
          }
          <Burger.PrimaryButton disabled={selected ? false : true} label="debug.toolbar.openAsset" onClick={() => selected && nav.handleInTab({ article: selected })} sx={{ml: 1}}/>
          <Burger.PrimaryButton label="debug.toolbar.options" onClick={() => setOption('DRAWER')} sx={{ml: 1}}/>
          <Burger.PrimaryButton disabled={selected ? false : true} label="debug.toolbar.execute" onClick={() => handleExecute()} sx={{ml: 1}}/>
        </DebugHeader>

        <TableBody>
          {json ? <DebugInput type={inputType} csv={csv} json={json}/> : null}
          {error ? <DebugError error={error} /> : null}
          <DebugOutput debug={debug} selected={selected} />
        </TableBody>
      </Table>
    </TableContainer>


  </Box >);
}

export { DebugView };
