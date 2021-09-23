import React from 'react';
import clsx from 'clsx';
import { IconButton, Theme } from '@mui/material';
import { makeStyles } from '@mui/material/styles';

import MenuIcon from '@mui/icons-material/Menu';


const useStyles = makeStyles((theme: Theme) => ({
  menuButton: {
    color: theme.palette.primary.main,
  },
  menuButtonHidden: {
    display: 'none',
  }
}));

interface HeaderRightProps {
  drawer: {
    open: boolean;
    onOpen: () => void;  
  };
  children: React.ReactElement[];
};

const HeaderRight: React.FC<HeaderRightProps> = ({ children, drawer }) => {
  const classes = useStyles();

  return (<>
    <IconButton edge="start" color="inherit"
      className={clsx(classes.menuButton, drawer.open && classes.menuButtonHidden)}
      onClick={drawer.onOpen}>
      <MenuIcon />
    </IconButton>
    {children}
  </>);
}

export type { HeaderRightProps };
export { HeaderRight };
