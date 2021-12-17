import React from 'react';
import { FormattedMessage } from 'react-intl';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/ModeEdit';
import { Typography, Box } from "@mui/material";

import { useSnackbar } from 'notistack';
import Burger from '@the-wrench-io/react-burger';

import { Composer, Client } from '../../context';
import {ErrorView} from '../../styles';


const ServiceDelete: React.FC<{ serviceId: Client.ServiceId, onClose: () => void }> = ({ serviceId, onClose }) => {
  const { services } = Composer.useSite();
  const { service: composerService, actions } = Composer.useComposer();
  const { enqueueSnackbar } = useSnackbar();
  const [apply, setApply] = React.useState(false);
  const [errors, setErrors] = React.useState<Client.StoreError>();

  const service = services[serviceId];
  let editor = (<></>);
  if (errors) {
    editor = (<Box>
      <Typography variant="h4">
        <FormattedMessage id="services.delete.error.title" />
      </Typography>
      <ErrorView error={errors}/>
    </Box>)
  } else {
    editor = (<Typography variant="h4">
      <FormattedMessage id="services.delete.content" values={{ name: service.ast?.name }} />
    </Typography>)
  }


  return (<Burger.Dialog open={true}
    onClose={onClose}
    children={editor}
    backgroundColor="uiElements.main"
    title='services.delete.title'
    submit={{
      title: "buttons.delete",
      disabled: apply,
      onClick: () => {
        setErrors(undefined);
        setApply(true);

        composerService.delete().service(serviceId)
          .then(data => {
            enqueueSnackbar(<FormattedMessage id="services.deleted.message" values={{ name: service.ast?.name }} />);
            actions.handleLoadSite(data);
            onClose();
          })
          .catch((error: Client.StoreError) => {
            setErrors(error);
          });
      }
    }}
  />);
}

const ServiceOptions: React.FC<{ service: Client.Entity<Client.AstService> }> = ({ service }) => {

  const [dialogOpen, setDialogOpen] = React.useState<undefined | 'ServiceDelete' >(undefined);
  const nav = Composer.useNav();
  const handleDialogClose = () => setDialogOpen(undefined);

  return (
    <>
      { dialogOpen === 'ServiceDelete' ? <ServiceDelete serviceId={service.id} onClose={handleDialogClose} /> : null}
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
