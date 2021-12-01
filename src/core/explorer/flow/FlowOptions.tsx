import React from 'react';
import { FormattedMessage } from 'react-intl';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import Burger from '@the-wrench-io/react-burger';

import { Composer, Client } from '../../context';



const FlowOptions: React.FC<{ flow: Client.Entity<Client.AstFlow> }> = ({ flow }) => {

  const [dialogOpen, setDialogOpen] = React.useState<undefined | 'FlowDelete' >(undefined);


  const handleDialogClose = () => setDialogOpen(undefined);
  const { handleInTab } = Composer.useNav();

  return (
    <>
      {/* dialogOpen === 'FlowDelete' ? <FlowDelete articleId={flow.id} onClose={handleDialogClose} /> : null */}

      <Burger.TreeItemOption nodeId={flow.id + 'delete-nested'}
        color='article'
        icon={DeleteOutlineOutlinedIcon}
        onClick={() => setDialogOpen('FlowDelete')}
        labelText={<FormattedMessage id="flow.delete.title" />}>
      </Burger.TreeItemOption>
    </>
  );
}

export default FlowOptions;
