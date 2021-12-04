import React from 'react';
import { FormattedMessage } from 'react-intl';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/ModeEdit';

import Burger from '@the-wrench-io/react-burger';

import { Composer, Client } from '../../context';



const DecisionOptions: React.FC<{ decision: Client.Entity<Client.AstDecision> }> = ({ decision }) => {

  const [dialogOpen, setDialogOpen] = React.useState<undefined | 'DecisionDelete'>(undefined);
  const nav = Composer.useNav();

  const handleDialogClose = () => setDialogOpen(undefined);
  const { handleInTab } = Composer.useNav();

  return (
    <>
      {/* dialogOpen === 'FlowDelete' ? <FlowDelete articleId={flow.id} onClose={handleDialogClose} /> : null */}
      <Burger.TreeItemOption nodeId={decision.id + 'edit-nested'}
        color='page'
        icon={EditIcon}
        onClick={() => nav.handleInTab({ article: decision })}
        labelText={<FormattedMessage id="decisions.edit.title" />}>
      </Burger.TreeItemOption>
      <Burger.TreeItemOption nodeId={decision.id + 'delete-nested'}
        color='page'
        icon={DeleteOutlineOutlinedIcon}
        onClick={() => setDialogOpen('DecisionDelete')}
        labelText={<FormattedMessage id="decisions.delete.title" />}>
      </Burger.TreeItemOption>
      <Burger.TreeItemOption nodeId={decision.id + 'copyas-nested'}
        color='page'
        icon={EditIcon}
        onClick={() => nav.handleInTab({ article: decision })}
        labelText={<FormattedMessage id="decisions.copyas.title" />}>
      </Burger.TreeItemOption>
    </>
  );
}

export default DecisionOptions;
