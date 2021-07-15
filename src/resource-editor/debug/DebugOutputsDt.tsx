import React from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails, Typography, useTheme,
  Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Paper
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { FormattedMessage } from 'react-intl';
import { CodeEditor } from '../deps';
import { Hdes } from '../deps';
import { useContext, Session } from './context';


type Rule = { 
  name: string, 
  type: string, 
  rule: string | null | undefined, 
  input: string | null | undefined,
};
type RuleRow = { order: number, rules: Rule[], outputs?: Object };


const createRejections = (debug: Hdes.DebugAPI.DtDebug): RuleRow[] => {
  if(debug.rejections.length === 0) {
    return [];
  }
  const result: RuleRow[] = [];
  const names = debug.rejections[0].context;
  
  for(const rejection of debug.rejections) {
    const ruleRow: RuleRow = { order: rejection.node.order, rules: [] }; 
    result.push(ruleRow);
    
    for(const name of names) {
      const node = rejection.expressions[name.key.name];
      const rule: Rule = {
        name: name.key.name,
        type: name.key.valueType,
        input: name.value as string | null | undefined,
        rule: node.src as string | null | undefined,
      }
      ruleRow.rules.push(rule);
    }
  }
  return result;
}

const createMatches = (debug: Hdes.DebugAPI.DtDebug): RuleRow[] => {

  if(debug.matches.length === 0) {
    return [];
  }

  const result: RuleRow[] = [];
  const names = debug.matches[0].context;
  for(const match of debug.matches) {
     

    const outputs = debug.outputs.filter(o => o.order === match.node.order)[0].values;
    const ruleRow: RuleRow = { order: match.node.order, rules: [], outputs };
    result.push(ruleRow);
        
    for(const name of names) {
      const node = match.expressions[name.key.name];
      const rule: Rule = {
        name: name.key.name,
        type: name.key.valueType,
        input: name.value as string | null | undefined,
        rule: node.src as string | null | undefined,
      }
      ruleRow.rules.push(rule);
    }
  }
  return result;
}


const DebugOutputsDt: React.FC<{
  expanded: boolean,
  setExpanded: (expanded: boolean) => void
}> = ({ expanded, setExpanded }) => {

  const theme = useTheme();
  const context = useContext();
  const active: Session.Active = context.active as Session.Active;
  const debug: Hdes.DebugAPI.DtDebug = active.debug.output.service as Hdes.DebugAPI.DtDebug;
  const [rejects, setRejects] = React.useState(debug.outputs.length < 1);
  const rejections = createRejections(debug);
  const matches = createMatches(debug);

console.log(debug, matches);
  return (<>
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography color="primary">
          <FormattedMessage id={"debug.asset.execute.outputs.dt.json"} />
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <CodeEditor.Provider mode="json" theme={theme.palette.mode === 'dark' ? 'dark' : 'light'} onCommands={() => { }}>
          {JSON.stringify(matches.map(r => r.outputs), null, 2)}
        </CodeEditor.Provider>
      </AccordionDetails>
    </Accordion>

    <Accordion expanded={rejects} onChange={() => setRejects(!rejects)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography color="primary">
          <FormattedMessage id="debug.asset.execute.outputs.dt.rejects" />
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell><FormattedMessage id="debug.asset.execute.outputs.dt.rows" /></TableCell>
                { rejections.length > 0 && rejections[0].rules.map((r, index) => (<TableCell key={index} align="right">{r.name}</TableCell>)) }
              </TableRow>
            </TableHead>
            <TableBody>
              { rejections.map((row, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">{row.order}</TableCell>
                    { 
                      row.rules.map((input, index) => (<TableCell align="right" key={index}>{`${input.input} ${input.rule}`}</TableCell>)) 
                    }
                  </TableRow>
                )) }
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  </>);
}

export { DebugOutputsDt };


