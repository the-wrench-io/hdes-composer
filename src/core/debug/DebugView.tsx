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

import { DebugHeader } from './DebugHeader';
import { DebugInput } from './DebugInput';
import { DebugOutput } from './DebugOutput';


const DebugView: React.FC<{}> = ({ }) => {
  const { service } = Composer.useComposer();
  const [option, setOption] = React.useState<DebugOptionType | undefined>();
  const [inputType, setInputType] = React.useState<DebugInputType>("JSON");
  const [csv, setCsv] = React.useState<string>("");
  const [json, setJson] = React.useState<string>("{}");
  const [selected, setSelected] = React.useState<Client.Entity<Client.AstBody>>();
  const [debug, setDebug] = React.useState<Client.DebugResponse>();

  const handleCsv = (csv: string) => {
    setCsv(csv);
    setInputType("CSV");
  }

  const handleJson = (input: object) => {
    setJson(JSON.stringify(input));
    setInputType("JSON");
  }
  
  const handleSelectAsset = (selected: Client.Entity<Client.AstBody>) => {
    setSelected(selected)
    setOption("INPUT_FORM")
  }
  
  const handleExecute = () => {
    if(!selected) {
      return;
    }
    setDebug(undefined);
    service.debug({ 
      id: selected.id, 
      input: inputType === 'JSON' ? json : undefined,
      inputCSV: inputType === 'CSV' ? csv : undefined 
    }).then(setDebug)
  }

  return (<Box sx={{ width: '100%', overflow: 'hidden', padding: 1 }}>

    <DebugDrawer selected={selected?.id} open={option === "DRAWER"} onClose={() => setOption(undefined)} onSelect={setOption} />

    {option === 'SELECT_ASSET' ? <SelectAsset onClose={() => setOption(undefined)} selected={selected?.id} onSelect={handleSelectAsset} /> : null}
    {option === 'INPUT_JSON' ? <InputJSON onClose={() => setOption(undefined)} onSelect={handleJson} value={json} /> : null}
    {option === 'INPUT_FORM' ? <InputFORM onClose={() => setOption(undefined)} selected={selected?.id} onSelect={handleJson} value={json} /> : null}
    {option === 'INPUT_CSV' ? <InputCSV onClose={() => setOption(undefined)} selected={selected?.id} onSelect={handleCsv} value={csv} /> : null}


    <TableContainer sx={{ height: "calc(100vh - 150px)" }}>
      <Table stickyHeader size="small">
        <DebugHeader type={inputType} asset={selected}>
          <Burger.PrimaryButton label="debug.toolbar.options" onClick={() => setOption('DRAWER')} />
          <Burger.PrimaryButton disabled={selected ? false : true} label="debug.toolbar.execute" onClick={() => handleExecute()} sx={{ml: 2}}/>
        </DebugHeader>

        <TableBody>
          <DebugInput type={inputType} csv={csv} json={json}/>
          <DebugOutput debug={debug} selected={selected} />
        </TableBody>
      </Table>
    </TableContainer>


  </Box >);
}

export { DebugView };
