import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, TextField } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { FormattedMessage } from 'react-intl';

import API from './DebugAPI';
import { Hdes } from '../deps';
import Resource from '../';


function Grid<T = any>(props: { elements: T[], render: (element: T, index: number, style: Object) => React.ReactElement }): React.ReactElement[] {
  const rows: React.ReactElement[] = [];
  let index = 1;
  let row: React.ReactElement[] = [];

  for (const input of props.elements) {
    const style = { width: "33.33%" };
    const field = props.render(input, index, style);
    row.push(field);

    if (row.length === 3 || index === props.elements.length) {
      rows.push((<div key={index}>{row}</div>));
      row = [];
    }
    index++;
  }
  return rows;
}

const Inputs: React.FC<{ 
  data?: API.DebugData, 
  expanded: boolean,
  setExpanded: (expanded: boolean) => void
  onChange: (parameter: Hdes.ModelAPI.DataType, value: string) => void 
}> = ({ data, onChange, expanded, setExpanded}) => {
  const resource = Resource.useContext();

  if (!data) {
    return null;
  }
  const model = resource.session.getModel(data.model)
  const inputs = model.params.filter(p => p.direction === "IN");
  const getValue = (parameter: Hdes.ModelAPI.DataType) => {
    const init = data?.entity[parameter.name];
    if (init === undefined) {
      return parameter.values ? parameter.values : "";
    }
    return init;
  }


  return (<Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography><FormattedMessage id={"debug.asset.execute.inputs"} /></Typography>
    </AccordionSummary>
    <AccordionDetails>
      {
        Grid({
          elements: inputs,
          render: (p, index, style) => (<TextField key={index} style={style}
            onChange={({ target }) => onChange(p, target.value)}
            required={p.required} label={p.name}
            value={getValue(p)} />)
        })
      }
    </AccordionDetails>
  </Accordion>);
}

export { Inputs };


