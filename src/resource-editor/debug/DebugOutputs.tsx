import React from 'react';

import { useContext } from './context';
import { DebugOutputsDt } from './DebugOutputsDt'
import { DebugOutputsFt } from './DebugOutputsFt'
import { DebugOutputsFl } from './DebugOutputsFl'


const DebugOutputs: React.FC<{
  expanded: boolean,
  setExpanded: (expanded: boolean) => void
}> = ({ expanded, setExpanded }) => {

  const context = useContext();
  const data = context.active;
  if (!data || !data.debug.output) {
    return null;
  }
  const model = data.model;
  let delegate = (<></>);
  if(model.type === "DT") {
    delegate = (<DebugOutputsDt expanded={expanded} setExpanded={setExpanded} />);
  } else if(model.type === "FLOW_TASK") {
    delegate = (<DebugOutputsFt expanded={expanded} setExpanded={setExpanded} />);
  } else if(model.type === "FLOW") {
    delegate = (<DebugOutputsFl />);
  }


  return delegate;
}

export { DebugOutputs };


