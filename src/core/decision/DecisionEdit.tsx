import React from 'react';
import { Box, Drawer } from '@mui/material';

import Burger from '@the-wrench-io/react-burger';
import { Client, Composer } from '../context';
import RowsEdit, { RowOptions, CellEdit, EditMode } from './row-cell-editor';



const DecisionEdit: React.FC<{ decision: Client.Entity<Client.AstDecision> }> = ({ decision }) => {
  const { service, actions, session } = Composer.useComposer();
  const update = session.pages[decision.id];
  
  const commands = React.useMemo(() => update ? update.value : decision.source.commands, [decision, update]);
  const [ast, setAst] = React.useState<Client.AstDecision | undefined>();
  const [open, setOpen] = React.useState(false);
  const [edit, setEdit] = React.useState<EditMode | undefined>();
    
  const onChange = (newCommands: Client.AstCommand[]) => {
    actions.handlePageUpdate(decision.id, [...commands, ...newCommands])
  }
  
  
  React.useEffect(() => {
    service.ast(decision.id, commands).then(data => {
      console.log("new commands applied");
      setAst(data.ast);
    });

  }, [commands])

  if (!ast) {
    return <span>loading ...</span>
  }
  
  const header = (<Burger.PrimaryButton label="decisions.table.options" onClick={() => setOpen(true)} />);

  return (<Box sx={{ width: '100%', overflow: 'hidden', padding: 1 }}>
    <Drawer anchor="top" open={open} onClose={() => setOpen(false)} sx={{ zIndex: "10000" }}>
      <RowOptions decision={ast} onChange={onChange} />
    </Drawer>
    {edit?.rule ? <CellEdit cell={edit?.rule.cell} onClose={() => setEdit(undefined)} onChange={(command) => onChange([command])} /> : null}
    <RowsEdit key={decision.id} ast={ast} onChange={setEdit} header={header} />
  </Box>);
}

export type { };
export { DecisionEdit };
