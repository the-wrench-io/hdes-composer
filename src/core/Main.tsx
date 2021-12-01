import React from 'react';
import { Box } from '@mui/material';

import Burger from '@the-wrench-io/react-burger';

import Activities from './activities';
import { Composer } from './context';


const root = { height: `100%`, padding: 1, backgroundColor: "mainContent.main" };

const Main: React.FC<{}> = () => {
  const layout = Burger.useTabs();
  const site = Composer.useSite();
  const tabs = layout.session.tabs;
  const active = tabs.length ? tabs[layout.session.history.open] : undefined;

  //composers which are NOT linked directly with an article

  return React.useMemo(() => {
    if (site.contentType === "NO_CONNECTION") {
      return (<Box>{site.contentType}</Box>);
    }
    if (!active) {
      return null;
    }
    if (active.id === 'activities') {
      return (<Box sx={root}><Activities /></Box>);
    } else if (active.id === 'releases') {
      return (<Box sx={root}>releases</Box>);
    } else if (active.id === 'decision') {
      return (<Box sx={root}>decision</Box>);
    } else if (active.id === 'flow') {
      return (<Box sx={root}>flow</Box>);
    } else if (active.id === 'service') {
      return (<Box sx={root}>service</Box>);
    } else if (active.id === 'graph') {
      return (<Box sx={root}>graph</Box>);
    } else if (active.id === 'templates') {
      return (<Box sx={root}>templates</Box>);
    }
  
    throw new Error("unknown view: " + JSON.stringify(active, null, 2));

  }, [active, site]);
}
export { Main }


