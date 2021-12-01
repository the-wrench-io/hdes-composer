import React from 'react';

import Integration from './Integration';
import API from './api';
import { ReducerDispatch, Reducer } from './context/Reducer';
import Editor from './context/Context';

interface ProviderProps {
  src?: string;
  value?: string;
  mode: API.ViewMode;
  onCommands: (commands: API.ViewCommand[]) => void;
  lint?: () => API.LintMessage[];
  hint?: (pos: CodeMirror.Position, content: string) => CodeMirror.Hints;
};

const getMode = (mode: API.ViewMode): API.ViewLang => {
  if(mode === "json") {
    return "json"; 
  }
  return mode === "ft" ? "groovy" : "yaml"
}

const Provider: React.FC<ProviderProps> = ({ src, mode, onCommands, lint, hint, value }) => {

  const [session, dispatch] = React.useReducer(Reducer, Editor.sessionData);
  const actions = React.useMemo(() => new ReducerDispatch(dispatch, onCommands), [dispatch, onCommands]);

  React.useEffect(() => {
    if (session.config) {
      return;
    }
    actions.setConfig({
      src: src ? src : "",
      theme: 'eclipse',
      mode: getMode(mode),
    });
  }, [actions, src, mode, session.config]);

  React.useEffect(() => {
    if(!session.view) {
      return;
    }
    actions.setEvents({
      onChanges: (newCommands, _value) => actions.addCommands(newCommands),
      lint: lint,
      hint: hint,
    })
  }, [lint, hint, onCommands, actions, session.view]);

  React.useEffect(() => {
    if(!session.view || value === undefined || value === null) {
      return;
    }
    session.view.withValue(value);
  }, [value, session.view]);

  return (
    <Editor.Context.Provider value={{ session, actions }}>
      <Integration />
    </Editor.Context.Provider>

  );
}

export type { ProviderProps };
export { Provider };
