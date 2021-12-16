import React from 'react';
import { FormattedMessage } from 'react-intl';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/ModeEdit';
import { Typography, Box } from "@mui/material";

import { useSnackbar } from 'notistack';
import Burger from '@the-wrench-io/react-burger';

import { Composer, Client } from '../../context';
import ErrorView from '../ErrorView'


const FlowDelete: React.FC<{ flowId: Client.FlowId, onClose: () => void }> = ({ flowId, onClose }) => {
  const { flows } = Composer.useSite();
  const { service, actions } = Composer.useComposer();
  const { enqueueSnackbar } = useSnackbar();
  const [apply, setApply] = React.useState(false);
  const [errors, setErrors] = React.useState<Client.StoreError>();

  const flow = flows[flowId];
  let editor = (<></>);
  if (errors) {
    editor = (<Box>
      <Typography variant="h4">
        <FormattedMessage id="flows.delete.error.title" />
      </Typography>
      <ErrorView error={errors}/>
    </Box>)
  } else {
    editor = (<Typography variant="h4">
      <FormattedMessage id="flows.delete.content" values={{ name: flow.ast?.name }} />
    </Typography>)
  }


  return (<Burger.Dialog open={true}
    onClose={onClose}
    children={editor}
    backgroundColor="uiElements.main"
    title='flows.delete.title'
    submit={{
      title: "buttons.delete",
      disabled: apply,
      onClick: () => {
        setErrors(undefined);
        setApply(true);

        service.delete().flow(flowId)
          .then(data => {
            enqueueSnackbar(<FormattedMessage id="flows.deleted.message" values={{ name: flow.ast?.name }} />);
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


const FlowOptions: React.FC<{ flow: Client.Entity<Client.AstFlow> }> = ({ flow }) => {

  const [dialogOpen, setDialogOpen] = React.useState<undefined | 'FlowDelete'>(undefined);
  const nav = Composer.useNav();
  const handleDialogClose = () => setDialogOpen(undefined);

  return (
    <>
      {dialogOpen === 'FlowDelete' ? <FlowDelete flowId={flow.id} onClose={handleDialogClose} /> : null}

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
