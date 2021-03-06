import React from 'react'

import { Box, Typography, Grid, ListItemText } from '@mui/material';
import { FormattedMessage } from 'react-intl'

import Burger from '@the-wrench-io/react-burger';
import { Client, Composer } from '../../context';


const GridItem: React.FC<{
  value: string;
  typeDef: Client.TypeDef;
  onChange: (newValue: string, typeDef: Client.TypeDef) => void;
}> = ({ typeDef, onChange, value }) => {

  if (typeDef.valueType === 'BOOLEAN') {
    return (<Burger.Select label={typeDef.name}
      selected={value}
      onChange={(newValue) => onChange(newValue, typeDef)}
      empty={{ id: '', label: 'noValue' }}
      items={[{ text: "true" }, { text: "false" }].map((type) => ({
        id: type.text,
        value: (<ListItemText primary={type.text} />)
      }))}
    />);
  }

  return (<Burger.TextField
    onChange={(newValue) => onChange(newValue, typeDef)}
    required={typeDef.required}
    label={typeDef.name}
    value={value} />
  )
}



interface InputFORMProps {
  value: string;
  selected?: Client.EntityId;

  onClose: () => void;
  onSelect: (json: object) => void;
}

const parseInput = (json: string) => {
  try {
    return JSON.parse(json);
  } catch(e) {
    console.error(e);
    return {};
  }
}

const InputFORM: React.FC<InputFORMProps> = ({ onSelect, onClose, value, selected }) => {
  const { decisions, flows, services } = Composer.useSite();
  const [json, setJson] = React.useState<object>(parseInput(value));

  const asset: Client.Entity<Client.AstBody> | undefined = React.useMemo(() => {
    if (!selected) {
      return undefined;
    }
    if (decisions[selected]) {
      return decisions[selected];
    }
    if (flows[selected]) {
      return flows[selected];
    }
    if (services[selected]) {
      return services[selected];
    }
  }, [selected, flows, services, decisions]);


  const handleChange = (newValue: string, typeDef: Client.TypeDef) => {
    const newObject = {};
    newObject[typeDef.name] = newValue;
    setJson(Object.assign({}, json, newObject))
  }

  const getValue = (parameter: Client.TypeDef) => {
    const init = json[parameter.name];
    if (init === undefined) {
      return parameter.values ? parameter.values : "";
    }
    return init;
  }

  const elements = asset?.ast ? asset.ast.headers.acceptDefs : [];

  return (<Burger.Dialog title="debug.input.form" open={true} onClose={onClose}
    backgroundColor="uiElements.main"
    submit={{
      title: "buttons.apply",
      disabled: false,
      onClick: () => {
        onSelect(json);
        onClose();
      }
    }}>

    <Box>
      <Box><Typography variant="h4" fontWeight="bold"><FormattedMessage id={"debug.input.formTitle"} /></Typography></Box>
      {!selected ? (<Box><Typography variant="h4" fontWeight="bold"><FormattedMessage id={"debug.input.noAsset"} /></Typography></Box>) : null}
      {!selected ? null : (
        <Grid container spacing={2}>
          {elements.map((typeDef, index) => (
            <Grid item xs={4} key={index}>
              <GridItem typeDef={typeDef} value={getValue(typeDef)} onChange={handleChange} />
            </Grid>)
          )}
        </Grid>
      )}

    </Box>
  </Burger.Dialog>);
}

export type { InputFORMProps };
export { InputFORM };
