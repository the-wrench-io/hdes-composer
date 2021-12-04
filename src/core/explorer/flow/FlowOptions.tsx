import React from 'react';
import { FormattedMessage } from 'react-intl';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/ModeEdit';

import Burger from '@the-wrench-io/react-burger';

import { Composer, Client } from '../../context';



const FlowOptions: React.FC<{ flow: Client.Entity<Client.AstFlow> }> = ({ flow }) => {

  const [dialogOpen, setDialogOpen] = React.useState<undefined | 'FlowDelete'>(undefined);
  const nav = Composer.useNav();

  const handleDialogClose = () => setDialogOpen(undefined);
  const { handleInTab } = Composer.useNav();

  return (
    <>
      {/* dialogOpen === 'FlowDelete' ? <FlowDelete articleId={flow.id} onClose={handleDialogClose} /> : null */}

      <Burger.TreeItemOption nodeId={flow.id + 'edit-nested'}
        color='article'
        icon={EditIcon}
        onClick={() => nav.handleInTab({ article: flow })}
        labelText={<FormattedMessage id="flows.edit.title" />}>
      </Burger.TreeItemOption>

      <Burger.TreeItemOption nodeId={flow.id + 'delete-nested'}
        color='article'
        icon={DeleteOutlineOutlinedIcon}
        onClick={() => setDialogOpen('FlowDelete')}
        labelText={<FormattedMessage id="flows.delete.title" />}>
      </Burger.TreeItemOption>

      <Burger.TreeItemOption nodeId={flow.id + 'copyas-nested'}
        color='article'
        icon={EditIcon}
        onClick={() => nav.handleInTab({ article: flow })}
        labelText={<FormattedMessage id="flows.copyas.title" />}>
      </Burger.TreeItemOption>
    </>
  );
}

export default FlowOptions;
