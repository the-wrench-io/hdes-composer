import React from 'react';
import {
  Box, List, Drawer, ListItem, ListItemIcon, ListItemText, Divider,
  TableContainer, Table, TableBody
} from '@mui/material';
import { SxProps } from '@mui/system';


import { FormattedMessage } from 'react-intl';

import Burger from '@the-wrench-io/react-burger';
import { Client, Composer } from '../context';
import { DebugInputType, DebugOptionType } from './api';
import { DebugDrawer } from './DebugDrawer';
import { DebugHeader } from './DebugHeader';
import { SelectAsset } from './SelectAsset';
import { InputCSV } from './InputCSV';
import { InputJSON } from './InputJSON';
import { InputFORM } from './InputFORM';


const DebugView: React.FC<{}> = ({ }) => {
  const { session, actions, service } = Composer.useComposer();
  const { site } = session;
  const [option, setOption] = React.useState<DebugOptionType | undefined>();
  const [inputType, setInputType] = React.useState<DebugInputType>("JSON");
  const [csv, setCsv] = React.useState<string>("");
  const [json, setJson] = React.useState<string>("{}");
  const [selected, setSelected] = React.useState<Client.Entity<Client.AstBody>>();


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

  return (<Box sx={{ width: '100%', overflow: 'hidden', padding: 1 }}>

    <DebugDrawer open={option === "DRAWER"} onClose={() => setOption(undefined)} onSelect={setOption} />

    {option === 'SELECT_ASSET' ? <SelectAsset onClose={() => setOption(undefined)} selected={selected?.id} onSelect={handleSelectAsset} /> : null}
    {option === 'INPUT_JSON' ? <InputJSON onClose={() => setOption(undefined)} onSelect={handleJson} value={json} /> : null}
    {option === 'INPUT_FORM' ? <InputFORM onClose={() => setOption(undefined)} selected={selected?.id} onSelect={handleJson} value={json} /> : null}
    {option === 'INPUT_CSV' ? <InputCSV onClose={() => setOption(undefined)} selected={selected?.id} onSelect={handleCsv} value={csv} /> : null}


    <TableContainer sx={{ height: "calc(100vh - 150px)" }}>
      <Table stickyHeader size="small">

        <DebugHeader type={inputType} asset={selected}>
          <Burger.PrimaryButton label="debug.toolbar.options" onClick={() => setOption('DRAWER')} />
        </DebugHeader>

        <TableBody>
          {}
        </TableBody>
      </Table>
    </TableContainer>


  </Box >);
}

export { DebugView };
