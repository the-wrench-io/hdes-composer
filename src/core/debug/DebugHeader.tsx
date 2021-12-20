import React from 'react';

import { Box, TableCell, TableHead, TableRow } from '@mui/material';
import { FormattedMessage } from 'react-intl'

import { Client } from '../context';
import { DebugInputType } from './api';


const DebugHeader: React.FC<{
  type: DebugInputType, children: React.ReactNode,
  asset?: Client.Entity<Client.AstBody>
}> = ({ children, asset }) => {

  // <FormattedMessage id="debug.heade.noAsset" />
  const totalCols = 2;

  return (<TableHead sx={{ position: "sticky", top: 0 }}>
  
    <TableRow>
      <TableCell align="left" colSpan={totalCols} sx={{ fontWeight: "bold", borderBottom: "unset", pl: 0 }}>
        <Box display="flex" alignItems="center">
          <Box>{children}</Box>
          <Box sx={{ ml: 1 }}>
            {asset ? asset.ast?.name : <FormattedMessage id="debug.header.noAsset" />}
          </Box>
        </Box>
      </TableCell>
    </TableRow>

    
  </TableHead>);
}

export type { };
export { DebugHeader };
