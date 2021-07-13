import React from 'react';
import { AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, Divider, Accordion } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { FormattedMessage } from 'react-intl';

import API from './DebugAPI';



const DebugErrors: React.FC<{ children?: API.DebugData }> = ({ children }) => {
  const errors = children?.errors?.errors;
  if (!errors) {
    return null;
  }

  return (<Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography><FormattedMessage id={"debug.asset.execute.errors"} /></Typography>
    </AccordionSummary>
    <AccordionDetails >
      <List disablePadding dense>
        {errors.map((error) => (<>
          <ListItem>
            <ListItemText
              primary={` — ${error.id}`}
              secondary={<Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.error">{error.value}</Typography>}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </>))}
      </List>
    </AccordionDetails>
  </Accordion>);
}

export { DebugErrors };
