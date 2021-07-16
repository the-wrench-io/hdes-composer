import React from 'react';
import {  } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import { Hdes } from '../deps';
import { useContext, Session } from './context';

const DebugOutputsFl: React.FC<{}> = () => {
  const context = useContext();
  const active: Session.Active  = context.active as Session.Active;

  return (
    <>FL</>
  );
}

export { DebugOutputsFl };


