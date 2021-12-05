import React from 'react';

import 'codemirror/addon/lint/lint';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/mode/groovy/groovy'; // eslint-disable-line
import 'codemirror/mode/yaml/yaml'; // eslint-disable-line

import 'codemirror/theme/eclipse.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/scroll/simplescrollbars.css';

import { styled } from "@mui/material/styles";
import { Box, BoxProps } from '@mui/material';

import { View, ViewProps, createView } from './ViewImpl';


const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  width: "100%",
  height: "100%",
  "& .CodeMirror": {
    width: "100% !important",
    height: "100% !important",
    fontSize: "13px",
    lineHeight: "1.5",
  }
}));

const CodeEditorState: React.FC<ViewProps> = (props) => {
  const ref = React.createRef<HTMLTextAreaElement>();
  const [view, setView] = React.useState<View>();
  
  React.useEffect(() => {
    if(ref.current && !view) {
      setView(createView(ref, props));  
    }
  }, [ref, props, setView, view])

  return (<textarea key={props.id} id={props.id} ref={ref} />);
}

const CodeEditor: React.FC<ViewProps> = (props) => {
  const {id} = props;
  return (<StyledBox key={id} id={id}><CodeEditorState {...props} /></StyledBox>);
}
export { CodeEditor };
