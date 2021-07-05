import React from 'react';

import { createStyles, makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

import { CodeEditor, Hdes } from './deps';


const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
    }
  }),
);

interface FlowTaskEditorProps {
  models: Hdes.ModelAPI.Models;
  theme: {
    mode: 'dark' | 'light'
  }
  size: {
    width: number, height: number
  };
  children: Hdes.AstAPI.FtCommand[];
  ast: (commands: Hdes.AstAPI.FtCommand[], rev?: number) => Promise<Hdes.AstAPI.Ft>;
  onChanges: (changes: Hdes.AstAPI.FtCommand[]) => void;
};


const FlowTaskEditor: React.FC<FlowTaskEditorProps> = (props) => {
  const classes = useStyles(props.size);
  const [parser, setParser] = React.useState<Hdes.AstAPI.Ft>();

  React.useEffect(() => {
    props.ast(props.children).then(setParser).catch(e => { console.error(e); })
  }, [props])

  if (!parser) {
    return null;
  }

  return (<div className={classes.root}>
    <CodeEditor.Provider mode="ft" theme={props.theme.mode} onCommands={props.onChanges}>
      {parser?.src}
    </CodeEditor.Provider>

  </div>);
}

export type { FlowTaskEditorProps }
export { FlowTaskEditor };
