import React from 'react';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Theme, Breadcrumbs, Link, Typography } from '@material-ui/core';

import Resource from '../';
import { Hdes } from '../deps';
import API from './DebugAPI';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
      color: theme.palette.primary.main
    },
  }),
);




interface NavProps {
  context: API.DebugContext;
  active?: Hdes.ModelAPI.Model;
  setActive: (model: Hdes.ModelAPI.Model) => void;
};

const Nav: React.FC<NavProps> = ({ context, active, setActive }) => {
  const classes = useStyles();
  const resource = Resource.useContext();

  const getModel = (debug: API.DebugData): Hdes.ModelAPI.Model | undefined => {
    try {
      return resource.session.getModel(debug.model);
    } catch (e) {
      return undefined;
    }
  }

  return (<Breadcrumbs separator="-" className={classes.root}>
    {
      context.models.map(m => getModel(m)).filter(m => m).map(m => m as Hdes.ModelAPI.Model)
        .map((m, index) => {
          if (m.id !== active?.id) {
            return (<Link key={index} underline="hover" href="_blank" onClick={(event: any) => {
              event.preventDefault();
              setActive(m);
            }}>
              {m.name}
            </Link>);
          }
          return (<Typography key={index} color="text.primary">{m.name}</Typography>);
        })
    }
    {
      context.models.length ? null : (<Typography>&nbsp;</Typography>)
    }
  </Breadcrumbs>);
}

export type { NavProps };
export { Nav };
