import React from 'react';

import { Client } from '../../context';
import { DebugOutputsDt } from './DebugOutputsDt';
import { DebugOutputsFl } from './DebugOutputsFl';

const DebugOutput: React.FC<{
  selected?: Client.Entity<Client.AstBody>;
  debug?: Client.DebugResponse;
}> = ({ selected, debug }) => {


  if(!selected || !debug) {
    return null;
  }

  const bodyType = selected.ast?.bodyType;

  console.log(debug);

  let delegate = (<></>);
  if (bodyType === "DT") {
    delegate = (<DebugOutputsDt debug={debug.body as Client.DecisionResult}/>);
  } else if (bodyType === "FLOW_TASK") {
    //delegate = (<DebugOutputsFt />);
  } else if (bodyType === "FLOW") {
    delegate = (<DebugOutputsFl debug={debug.body as Client.FlowResult}/>);
  }


  return delegate;
}

export type { };
export { DebugOutput };
