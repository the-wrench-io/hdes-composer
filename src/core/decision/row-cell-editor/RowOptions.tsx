import React from 'react';

import { Box, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';

import { SxProps } from '@mui/system';

import EditIcon from '@mui/icons-material/Edit';
import DoubleArrowRoundedIcon from '@mui/icons-material/DoubleArrowRounded';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import UploadIcon from '@mui/icons-material/Upload';

import { FormattedMessage } from 'react-intl';
import fileDownload from 'js-file-download'

import { MetaEditor } from './MetaEditor';
import { RowsColumns } from './RowsColumns';
import { UploadCSV } from './UploadCSV';
import { Client } from '../../context';


interface RowOptionsProps {
  decision: Client.AstDecision,
  onChange: (commands: Client.AstCommand[]) => void;
}

const sectionSx: SxProps = {
  width: "300px",
};

const itemSx: SxProps = {
  color: "explorerItem.main",
}


const Option: React.FC<{
  onClick: () => void;
  label: string;
  icon: React.ReactElement;
}> = ({ icon, onClick, label }) => {
  return (<ListItem button onClick={onClick}>
    <ListItemIcon sx={itemSx}>{icon}</ListItemIcon>
    <ListItemText sx={itemSx}>
      <Box component="span" sx={itemSx}>
        <FormattedMessage id={label} />
      </Box>
    </ListItemText>
  </ListItem>);
}


const RowOptions: React.FC<RowOptionsProps> = ({ decision, onChange }) => {
  const [edit, setEdit] = React.useState<"META" | "ROWS-COLUMNS" | "CSV_UPLOAD">();

  const saveCsv = () => {
    const accepts: Client.TypeDef[] = [...decision.headers.acceptDefs].sort((a, b) => a.order - b.order);
    const returns: Client.TypeDef[] = [...decision.headers.returnDefs].sort((a, b) => a.order - b.order);
    const rows = decision.rows.sort((a, b) => a.order - b.order);
    const headers: Client.TypeDef[] = [...accepts, ...returns];

    const line0 = headers.map(h => h.name).join(";");
    const lines = rows.map(row => {
      const cells: Record<string, Client.AstDecisionCell> = {};
      row.cells.forEach(e => cells[e.header] = e);
      return headers
        .map(header => cells[header.id])
        .map(c => `${c.value ? c.value : ''}`)
        .join(";")

    }).join("\r\n");
    fileDownload(line0 + "\r\n" + lines, decision.name + '.csv')
  }

  return (<Box display="flex" bgcolor="explorer.main">

    {edit === "META" ? <MetaEditor decision={decision} onChange={onChange} onClose={() => setEdit(undefined)}/> : null}
    {edit === "ROWS-COLUMNS" ? <RowsColumns decision={decision} onChange={onChange} onClose={() => setEdit(undefined)}/>: null}
    {edit === "CSV_UPLOAD" ? <UploadCSV decision={decision} onChange={onChange} onClose={() => setEdit(undefined)}/>: null}


    <Box sx={sectionSx}>
      <List>
        <Option label='decisions.toolbar.add.input.column'
          onClick={() => onChange([{ type: 'ADD_HEADER_IN', id: "in-" + decision.headers.acceptDefs.length + 1 }])}
          icon={<DoubleArrowRoundedIcon sx={{ transform: "rotate(-180deg)" }} />} />
        <Option label='decisions.toolbar.add.output.column'
          onClick={() => onChange([{ type: 'ADD_HEADER_OUT', id: "out-" + decision.headers.returnDefs.length + 1 }])}
          icon={<DoubleArrowRoundedIcon />} />
        <Option label='decisions.toolbar.add.row'
          onClick={() => onChange([{ type: 'ADD_ROW', id: "" }])}
          icon={<DoubleArrowRoundedIcon sx={{ transform: "rotate(90deg)" }} />} />
      </List>
    </Box>

    <Divider orientation="vertical" flexItem color="explorerItem.contrastColor" />

    <Box sx={sectionSx}>
      <List>
        <Option label='dt.toolbar.csv.download'
          onClick={saveCsv}
          icon={<FileDownloadDoneIcon />} />
        <Option label='dt.toolbar.csv.upload'
          onClick={() => setEdit("CSV_UPLOAD")}
          icon={<UploadIcon />} />
      </List>
    </Box>

    <Divider orientation="vertical" flexItem color="explorerItem.contrastColor" />

    <Box sx={sectionSx}>
      <List>
        <Option label="decisions.toolbar.hitpolicy.description"
          onClick={() => setEdit("META")}
          icon={<EditIcon />} />
        <Option label="decisions.toolbar.organize.rows.columns"
          onClick={() => setEdit("ROWS-COLUMNS")}
          icon={<>
            <CompareArrowsRoundedIcon sx={{ transform: "rotate(90deg)" }} />
            <CompareArrowsRoundedIcon />
          </>} />
      </List>
    </Box>
  </Box>);
};

export type { RowOptionsProps };
export { RowOptions };


