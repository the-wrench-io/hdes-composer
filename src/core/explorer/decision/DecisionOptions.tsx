import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography, Box } from "@mui/material";

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/ModeEdit';

import { useSnackbar } from 'notistack';

import Burger from '@the-wrench-io/react-burger';

import { Composer, Client } from '../../context';
import {ErrorView} from '../../styles';


const DecisionDelete: React.FC<{ decisionId: Client.DecisionId, onClose: () => void }> = ({ decisionId, onClose }) => {
  const { decisions } = Composer.useSite();
  const { service, actions } = Composer.useComposer();
  const { enqueueSnackbar } = useSnackbar();
  const [apply, setApply] = React.useState(false);
  const [errors, setErrors] = React.useState<Client.StoreError>();

  const decision = decisions[decisionId];
  let editor = (<></>);
  if (errors) {
    editor = (<Box>
      <Typography variant="h4">
        <FormattedMessage id="decisions.delete.error.title" />
      </Typography>
      <ErrorView error={errors}/>
    </Box>)
  } else {
    editor = (<Typography variant="h4">
      <FormattedMessage id="decisions.delete.content" values={{ name: decision.ast?.name }} />
    </Typography>)
  }


  return (<Burger.Dialog open={true}
    onClose={onClose}
    children={editor}
    backgroundColor="uiElements.main"
    title='decisions.delete.title'
    submit={{
      title: "buttons.delete",
      disabled: apply,
      onClick: () => {
        setErrors(undefined);
        setApply(true);

        service.delete().decision(decisionId)
          .then(data => {
            enqueueSnackbar(<FormattedMessage id="decisions.deleted.message" values={{ name: decision.ast?.name }} />);
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


const DecisionOptions: React.FC<{ decision: Client.Entity<Client.AstDecision> }> = ({ decision }) => {
  const [dialogOpen, setDialogOpen] = React.useState<undefined | 'DecisionDelete'>(undefined);
  const nav = Composer.useNav();
  const handleDialogClose = () => setDialogOpen(undefined);

  return (
    <>
      {dialogOpen === 'DecisionDelete' ? <DecisionDelete decisionId={decision.id} onClose={handleDialogClose} /> : null}
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
