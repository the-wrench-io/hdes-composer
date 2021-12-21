import React from 'react';

import { Box, Table, TableCell, TableBody, TableHead, TableRow, IconButton, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { FormattedMessage } from 'react-intl'
import { Client, Composer } from '../context';
import CodeEditor from '../../code-editor';
import { DebugInputType } from './api';

const InputSectionJson: React.FC<{ json: string, csv: string, type: DebugInputType }> = (props) => {


  return (<></>);
}


const DebugOutput: React.FC<{
  selected?: Client.Entity<Client.AstBody>;
  debug?: Client.DebugResponse;
}> = ({ selected, debug }) => {

  const [open, setOpen] = React.useState(false);

  return (<></>
  );
}

export type { };
export { DebugOutput };
