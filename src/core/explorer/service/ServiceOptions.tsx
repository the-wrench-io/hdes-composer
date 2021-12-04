import React from 'react';
import { FormattedMessage } from 'react-intl';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/ModeEdit';

import Burger from '@the-wrench-io/react-burger';

import { Composer, Client } from '../../context';



const ServiceOptions: React.FC<{ service: Client.Entity<Client.AstService> }> = ({ service }) => {

  const [dialogOpen, setDialogOpen] = React.useState<undefined | 'ServiceDelete' >(undefined);
  const nav = Composer.useNav();

  const handleDialogClose = () => setDialogOpen(undefined);
  const { handleInTab } = Composer.useNav();

  return (
    <>
      {/* dialogOpen === 'FlowDelete' ? <FlowDelete articleId={flow.id} onClose={handleDialogClose} /> : null */}
      <Burger.TreeItemOption nodeId={service.id + 'edit-nested'}
        color='link'
        icon={EditIcon}
        onClick={() => nav.handleInTab({ article: service })}
        labelText={<FormattedMessage id="services.edit.title" />}>
      </Burger.TreeItemOption>
      <Burger.TreeItemOption nodeId={service.id + 'delete-nested'}
        color='link'
        icon={DeleteOutlineOutlinedIcon}
        onClick={() => setDialogOpen('ServiceDelete')}
        labelText={<FormattedMessage id="services.delete.title" />}>
      </Burger.TreeItemOption>
      <Burger.TreeItemOption nodeId={service.id + 'copyas-nested'}
        color='link'
        icon={EditIcon}
        onClick={() => nav.handleInTab({ article: service })}
        labelText={<FormattedMessage id="services.copyas.title" />}>
      </Burger.TreeItemOption>
    </>
  );
}

export default ServiceOptions;
