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
  debugValues: string
} => {
  const entity = session.debug.selected ? session.getEntity(session.debug.selected) : undefined;
  const ast = entity ? entity?.ast : undefined;
  const debug: Composer.DebugSession | undefined = session.debug.selected ? session.debug.values[session.debug.selected] : undefined;

  const elements = ast ? ast.headers.acceptDefs : [];
  const data = {};
  for (const parameter of elements) {
    if (parameter.values !== undefined) {
      data[parameter.name] = parameter.values ? parameter.values : "";
    }
  }

  return { ast, debug, entity, debugValues: JSON.stringify(data) };
}


const DebugView: React.FC<{}> = ({ }) => {
  const { service, session, actions } = Composer.useComposer();
  const nav = Composer.useNav();
  const { ast, debug, entity, debugValues } = getData(session);
  const [option, setOption] = React.useState<DebugOptionType | undefined>();

  const selected = debug?.selected ? debug.selected : "";
  const json = debug?.json ? debug?.json : debugValues;
  const csv = debug?.csv ? debug.csv : "";
  const inputType = debug ? debug.inputType : "JSON";
  const response = debug?.debug;
  const error = debug?.error;

  const handleCsv = (csv: string) => {
    actions.handleDebugUpdate({ inputType: "CSV", csv, selected, debug: response, error, json })
  }
  const handleJson = (input: object) => {
    actions.handleDebugUpdate({ inputType: "JSON", csv, selected, debug: response, error, json: JSON.stringify(input) })
  }
  const handleSelectAsset = (selected: Client.Entity<Client.AstBody>) => {
    if (session.debug.selected && session.debug.selected !== selected.id) {
      const previous = session.debug.values[selected.id];
      if (previous) {
        setOption(undefined);
        actions.handleDebugUpdate(previous);
        return;
      }
    }

    actions.handleDebugUpdate({ inputType: "JSON", selected: selected.id })
    setOption("INPUT_FORM");
  }

  const handleExecute = () => {
    if (!selected) {
      return;
    }

    service.debug({
      id: selected,
      input: inputType === 'JSON' ? json : undefined,
      inputCSV: inputType === 'CSV' ? csv : undefined
    })
      .then(response => actions.handleDebugUpdate({ inputType, csv, selected, json, debug: response, error: undefined }))
      .catch(error => actions.handleDebugUpdate({ inputType, csv, selected, json, error, debug: undefined }))
  }

  const downloadCsv = () => {
    var content : string = debug?.debug?.bodyCsv ? debug?.debug?.bodyCsv : "";
    const lines = content.split('\n');
    const outputHeaders = lines[0].split(',');
    const outputLines = lines.slice(1, lines.length/2);
    const inputHeaders = lines[lines.length/2].split(';');
    const inputLines = lines.slice(lines.length/2+1, lines.length);
    const finalHeaders = inputHeaders.concat(outputHeaders);
    const finalLines = inputLines.map((inputLine, index) => {
      const outputLine = outputLines[index];
      return inputLine.replace(';',',').concat(',').concat(outputLine);
    });
    const finalContent = finalHeaders.join(',').concat('\n').concat(finalLines.join('\n'));
    var blob = new Blob([finalContent], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    var pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', 'results.csv');
    pom.click();
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
          {ast ?
            (<Burger.PrimaryButton label={`${ast?.bodyType} - ${ast?.name}`} onClick={() => setOption('SELECT_ASSET')} />) :
            (<Burger.PrimaryButton label="debug.toolbar.noAsset" onClick={() => setOption('SELECT_ASSET')} />)
          }
          <Burger.PrimaryButton disabled={selected ? false : true} label="debug.toolbar.openAsset" onClick={() => entity && nav.handleInTab({ article: entity })} sx={{ ml: 1 }} />
          <Burger.PrimaryButton label="debug.toolbar.options" onClick={() => setOption('DRAWER')} sx={{ ml: 1 }} />
          <Burger.PrimaryButton disabled={selected ? false : true} label="debug.toolbar.execute" onClick={() => handleExecute()} sx={{ ml: 1 }} />
          {inputType === 'CSV' && debug?.debug?.bodyCsv ? <Burger.PrimaryButton disabled={selected ? false : true} label="debug.toolbar.download" onClick={() => downloadCsv()} sx={{ ml: 1 }} /> : null}
        </DebugHeader>

        <TableBody>
          {json ? <DebugInput type={inputType} csv={csv} json={json} /> : null}
          {error ? <DebugError error={error} /> : null}
          {response ? <DebugOutput debug={response} selected={ast} /> : null}
        </TableBody>
      </Table>
    </TableContainer>
  </Box >);
}

export { DebugView };
