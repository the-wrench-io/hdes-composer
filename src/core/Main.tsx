import React from 'react';
import { Box } from '@mui/material';
import { SxProps } from '@mui/system';

import Burger from '@the-wrench-io/react-burger';

import Activities from './activities';
import { Composer } from './context';
import { FlowEdit } from './flow';
import { DecisionEdit } from './decision';
import { ServiceEdit } from './service';

const root: SxProps = { height: `100%`, backgroundColor: "mainContent.main" };

const Main: React.FC<{}> = () => {
  const layout = Burger.useTabs();
  const { site, session } = Composer.useComposer();
  const tabs = layout.session.tabs;
  const active = tabs.length ? tabs[layout.session.history.open] : undefined;
  const entity = active ? session.getEntity(active.id) : undefined;

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
    } else if (active.id === 'graph') {
      return (<Box sx={root}>graph</Box>);
    } else if (active.id === 'templates') {
      return (<Box sx={root}>templates</Box>);
    }

    if (entity) {
      if (entity.source.bodyType === 'DT') {
        return (<Box sx={root}><DecisionEdit decision={entity} /></Box>);
      } else if (entity.source.bodyType === 'FLOW') {
        return (<Box sx={root}><FlowEdit flow={entity}/></Box>);
      } else if (entity.source.bodyType === 'FLOW_TASK') {
        return (<Box sx={root}><ServiceEdit service={entity}/></Box>);
      }
    }
    throw new Error("unknown view: " + JSON.stringify(active, null, 2));

  }, [active, site, entity]);
}
export { Main }


