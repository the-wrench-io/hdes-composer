import React from 'react';

import { createStyles, makeStyles } from '@mui/styles';
import { Typography, IconButton, TableCell, TableRow, Theme } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import TabUnselectedOutlinedIcon from '@mui/icons-material/TabUnselectedOutlined';

import { Hdes } from '../deps';
import DateFormat from '../date-format';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    enabled: {
      color: theme.palette.secondary.main
    },
    disabled: {
    },
  }),
);

interface CreateTableProps {
  children: Hdes.ModelAPI.Model[];
  openPopover: boolean;
  pinned: boolean;
  onOpen: (id: string) => void;
  onMouseClick: (event: any, id: string) => void;
  onMouseLeave: () => void;
  onMouseEnter: (event: any, id: string) => void;
};

const CreateTable: React.FC<CreateTableProps> = ({ children, onMouseEnter, onMouseLeave, onOpen, openPopover, onMouseClick, pinned }) => {
  const classes = useStyles();
   
  const rows = children.map((row) => (
    <TableRow key={row.id}>
      <TableCell aria-owns={openPopover ? 'mouse-over-popover' : undefined} onMouseEnter={(event) => onMouseEnter(event, row.id)} onMouseLeave={onMouseLeave}>
        <Typography aria-haspopup="true">
          <IconButton about="open in tab" size="small" onClick={(event) => onMouseClick(event, row.id)} color="inherit">
            <VisibilityOutlinedIcon fontSize='small' className={pinned ? classes.enabled : classes.disabled}/>
          </IconButton>
        </Typography>
      </TableCell>
      <TableCell>
        <IconButton about="open in tab" size="small" onClick={() => onOpen(row.id)} color="inherit"><TabUnselectedOutlinedIcon /></IconButton>
      </TableCell>
      <TableCell>
        <Typography>
          {row.name}
        </Typography>
      </TableCell>
      <TableCell align='right'>
        <div><DateFormat>{row.created}</DateFormat></div>
        <div><DateFormat>{row.modified}</DateFormat></div>
      </TableCell>
    </TableRow>));

  return (<>{rows}</>);
}

export default CreateTable;