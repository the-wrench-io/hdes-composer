import React from 'react';

import { Box, Table, TableCell, TableBody, TableHead, TableRow, IconButton, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { FormattedMessage } from 'react-intl'
import CodeEditor from '../../code-editor';
import { DebugInputType } from './api';

const InputSectionJson: React.FC<{ json: string, csv: string, type: DebugInputType }> = (props) => {

  if (props.type === "CSV") {
    return (<CodeEditor id="debug-input" mode="json" src={props.csv} onChange={(value) => { console.log(value); }} />);
  }

  let entity: object | undefined;
  try {
    entity = JSON.parse(props.json);
  } catch (e) {
    console.error(e);
  }

  if (!entity) {
    return (<CodeEditor id="debug-input" mode="json" src={props.json} onChange={(value) => { console.log(value); }} />);
  }

  return (<Table size="small">
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: "bold" }}><FormattedMessage id="debug.inputs.fieldName" /></TableCell>
        <TableCell sx={{ fontWeight: "bold" }}><FormattedMessage id="debug.inputs.fieldValue" /></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {Object.entries(entity).map(([key, value]) => (
        <TableRow key={key}>
          <TableCell component="th" scope="row">{key}</TableCell>
          <TableCell>{JSON.stringify(value)}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>);
}


const DebugInput: React.FC<{
  type: DebugInputType,
  csv: string,
  json: string
}> = ({ type, csv, json }) => {

  const [open, setOpen] = React.useState(false);

  return (<>
    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
      <TableCell>
        <IconButton size="small" onClick={() => setOpen(!open)}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </TableCell>
      <TableCell component="th" scope="row">
        <FormattedMessage id="debug.inputs.format" values={{ type }} />
      </TableCell>
    </TableRow>

    <TableRow sx={open ? undefined : { visibility: "hidden" }}>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <InputSectionJson json={json} csv={csv} type={type} />
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  </>
  );
}

export type { };
export { DebugInput };
