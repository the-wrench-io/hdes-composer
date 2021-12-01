import React from 'react';
import { Typography, Box } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import Burger from '@the-wrench-io/react-burger';

import FlowComposer from '../flow';
import DecisionComposer from '../decision';
import ServiceComposer from '../service';
import TypeComposer from '../type';
import ReleaseComposer from '../release';
import MigrationComposer from '../migration';
import TemplateComposer from '../template';

import { ActivityItem, ActivityData } from './ActivityItem';


const createCards: (tabs: Burger.TabsActions) => ActivityData[] = (tabs) => ([
  {
    composer: (handleClose) => (<FlowComposer onClose={handleClose} />),
    onView: () => tabs.handleTabAdd({ id: 'flows', label: "Flows" }),
    title: "activities.flows.title",
    desc: "activities.flows.desc",
    type: "flows",
    buttonCreate: "buttons.create",
  },
  {
    composer: (handleClose) => (<DecisionComposer onClose={handleClose} />),
    onView: () => tabs.handleTabAdd({ id: 'decisions', label: "Decisions" }),
    title: "activities.decisions.title",
    desc: "activities.decisions.desc",
    type: "decisions",
    buttonCreate: "buttons.create",
    buttonViewAll: undefined
  },
  {
    composer: (handleClose) => (<ServiceComposer onClose={handleClose} />),
    onView: () => tabs.handleTabAdd({ id: 'services', label: "Services" }),
    title: "activities.services.title",
    desc: "activities.services.desc",
    type: "services",
    buttonCreate: "buttons.create",
    buttonViewAll: undefined
  },
  {
    composer: (handleClose) => (<TypeComposer onClose={handleClose} />),
    onView: () => tabs.handleTabAdd({ id: 'types', label: "Types" }),
    title: "activities.types.title",
    desc: "activities.types.desc",
    type: "types",
    buttonCreate: "buttons.create",
    buttonViewAll: "activities.types.view",
  },
  {
    composer: (handleClose) => (<ReleaseComposer onClose={handleClose} />),
    onView: () => tabs.handleTabAdd({ id: 'releases', label: "Releases" }),
    onTertiary: () => tabs.handleTabAdd({ id: 'graph', label: "Release Graph" }),
    title: "activities.releases.title",
    desc: "activities.releases.desc",
    type: "releases",
    buttonCreate: "buttons.create",
    buttonViewAll: "activities.releases.view",
    buttonTertiary: "activities.releases.graph"
  },
  {
    composer: (handleClose) => <TemplateComposer onClose={handleClose} />,
    onView: () => tabs.handleTabAdd({ id: 'templates', label: "Templates" }),
    title: "activities.templates.title",
    desc: "activities.templates.desc",
    type: "templates",
    buttonCreate: "buttons.create",
    buttonViewAll: "activities.templates.view"
  },
  {
    composer: (handleClose) => <MigrationComposer onClose={handleClose} />,
    onView: undefined,
    title: "activities.migration.title",
    desc: "activities.migration.desc",
    type: "migration",
    buttonCreate: "buttons.create",
    buttonViewAll: undefined
  },
]);

//card view for all CREATE views
const Activities: React.FC<{}> = () => {
  const { actions } = Burger.useTabs();
  const [open, setOpen] = React.useState<number>();
  const handleClose = () => setOpen(undefined);
  const cards = React.useMemo(() => createCards(actions), [actions]);

  return (
    <>
      <Typography variant="h3" fontWeight="bold" sx={{ p: 1, m: 1 }}>
        <FormattedMessage id={"activities.title"} />
        <Typography variant="body2" sx={{ pt: 1 }}>
          <FormattedMessage id={"activities.desc"} />
        </Typography>
      </Typography>
      <Box sx={{ margin: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {open === undefined ? null : (cards[open].composer(handleClose))}
        {cards.map((card, index) => (<ActivityItem key={index} data={card} onCreate={() => setOpen(index)} />))}
      </Box>
    </>
  );
}

export { Activities };
