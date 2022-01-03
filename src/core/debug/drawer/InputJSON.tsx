import React from 'react'

import { TextareaAutosize, Box, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl'

import Burger from '@the-wrench-io/react-burger';


interface InputJSONProps {
  value: string;

  onClose: () => void;
  onSelect: (json: object) => void;
}

const InputJSON: React.FC<InputJSONProps> = ({ onSelect, onClose, value }) => {
  const [json, setJson] = React.useState<string>(JSON.stringify(JSON.parse(value), null, 2));
  
  return (<Burger.Dialog title="debug.input.json" open={true} onClose={onClose}
    backgroundColor="uiElements.main"
    submit={{
      title: "buttons.apply",
      disabled: false,
      onClick: () => {
        try {
          onSelect(JSON.parse(json));
          onClose();
        } catch (e) {
          console.error(e);
        }
      }
    }}>

    <Box>
      <Box>
        <Box><Typography variant="h4" fontWeight="bold"><FormattedMessage id={"debug.input.jsonTitle"} /></Typography></Box>
      </Box>

      <TextareaAutosize minRows={10}
        style={{ width: '100%', height: '100%' }}
        value={json}
        onChange={({ target }) => setJson(target.value)}
      />

    </Box>
  </Burger.Dialog>);
}

export type { InputJSONProps };
export { InputJSON };
