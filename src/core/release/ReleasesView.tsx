import React from 'react';
import {
  Box, Typography, IconButton,
  TableCell, TableRow, Card,
} from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PublishIcon from '@mui/icons-material/Publish';
import { FormattedMessage } from 'react-intl';
import fileDownload from 'js-file-download'
import { useSnackbar } from 'notistack';

import Burger from '@the-wrench-io/react-burger';
import { Composer, Client } from '../context';
import { ReleaseComposer } from './ReleaseComposer';
import { ErrorView } from '../styles';
import ReleasesTable, { Release } from './ReleasesTable';

const ReleasesView: React.FC<{}> = () => {

  const { site } = Composer.useComposer();
  const layout = Burger.useTabs();
  const releases = Object.values(site.tags);

  const formattedReleases: Release[] = releases.map((release) => {
    const { id } = release;
    const name = release.ast?.name || '';
    const created = release.ast?.created || '';
    const note = release.ast?.description;
    const data = JSON.stringify(release.ast, null, 2);
    return {
      id,
      body: {
        name,
        note,
        created,
        data,
      }
    }
  });

  formattedReleases.push({
    id: 'latest',
    body: {
      name: 'latest',
      note: 'The current branch with the latest changes that can be released',
      created: '',
      data: '',
    }
  });

  return (
    <Box sx={{ paddingBottom: 1, m: 2 }}>
      <Box display="flex">
        <Box alignSelf="center">
          <Typography variant="h3" sx={{ p: 1, mb: 3, fontWeight: "bold", color: "mainContent.dark" }}>
            <FormattedMessage id="activities.releases.title" />: {releases.length}
            <Typography variant="body2" sx={{ pt: 1 }}><FormattedMessage id={"activities.releases.desc1"} /></Typography>
            <Typography variant="body2" sx={{ pt: 1 }}><FormattedMessage id={"activities.releases.desc2"} /></Typography>
          </Typography>
        </Box>
        <Box flexGrow={1} />
        <Box>
          <Burger.SecondaryButton label={"button.cancel"} onClick={() => layout.actions.handleTabCloseCurrent()} sx={{ marginRight: 1 }} />
          <Burger.SecondaryButton label={"activities.releases.graph"} onClick={() => layout.actions.handleTabAdd({ id: 'graph', label: "Release Graph" })} sx={{ marginRight: 1 }} />
          <Burger.PrimaryButton label={"releases.button.compare"} onClick={() => { }} />
        </Box>
      </Box>

      <Box display="flex" sx={{ justifyContent: 'center' }}>

        <Card sx={{ margin: 1, width: 'fill-available' }}>
          <Typography variant="h4" sx={{ p: 2, backgroundColor: "table.main" }}>
            <FormattedMessage id="releases.table.title" />
          </Typography>
          <ReleasesTable releases={formattedReleases} tableRowComponent={Row} />
        </Card>
      </Box>
    </Box>
  );
}



const ReleaseDelete: React.FC<{ release: Release, onClose: () => void }> = ({ release, onClose }) => {
  const { service, actions } = Composer.useComposer();
  const { enqueueSnackbar } = useSnackbar();
  const [apply, setApply] = React.useState(false);
  const [errors, setErrors] = React.useState<Client.StoreError>();

  let editor = (<></>);
  if (errors) {
    editor = (<Box>
      <Typography variant="h4">
        <FormattedMessage id="releases.delete.error.title" />
      </Typography>
      <ErrorView error={errors} />
    </Box>)
  } else {
    editor = (<Typography variant="h4">
      <FormattedMessage id="releases.delete.content" values={{ name: release.body.name }} />
    </Typography>)
  }


  return (<Burger.Dialog open={true}
    onClose={onClose}
    children={editor}
    backgroundColor="uiElements.main"
    title='release.delete.title'
    submit={{
      title: "buttons.delete",
      disabled: apply,
      onClick: () => {
        setErrors(undefined);
        setApply(true);

        service.delete().tag(release.id)
          .then(data => {
            enqueueSnackbar(<FormattedMessage id="release.deleted.message" values={{ name: release.body.name }} />);
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



const Row: React.FC<{ release: Burger.Release }> = ({ release }) => {
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [releaseComposer, setReleaseComposer] = React.useState(false);
  const isLatest = release.id === 'latest';
  const latestSx = isLatest ? { backgroundColor: '#F2F2F2' } : {};

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const toggleExpand = () => {
    setExpanded(!expanded);
  }

  const onDownload = (data: string | undefined) => {
    if (data) {
      fileDownload(data, release.body.name + "_" + release.body.created + '.json');
    }
  }

  return (
    <>
      {releaseComposer ? <ReleaseComposer onClose={() => setReleaseComposer(false)} /> : null}
      <TableRow key={release.id} sx={latestSx}>
        <TableCell align="center" sx={{ width: "20px" }}><IconButton onClick={toggleExpand}>{expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton></TableCell>
        <TableCell align="left">{release.body.name}</TableCell>
        <TableCell align="left"><Burger.DateTimeFormatter timestamp={release.body.created} /></TableCell>
        <TableCell align="left">{release.body.note}</TableCell>
        <TableCell align="center">
          {isLatest ?
            <Burger.SecondaryButton label={'releases.button.release'} onClick={() => setReleaseComposer(true)}></Burger.SecondaryButton> :
            <Burger.SecondaryButton label={'buttons.download'} onClick={() => onDownload(release.body.data)}></Burger.SecondaryButton>
          }
        </TableCell>
        <TableCell align="right">
          {dialogOpen ? <ReleaseDelete release={release} onClose={handleDialogClose} /> : null}
          {!isLatest && <IconButton onClick={() => setDialogOpen(true)} sx={{ color: 'error.main' }}><DeleteOutlineOutlinedIcon /> </IconButton>}
        </TableCell>
      </TableRow>
      {expanded && <TableRow>
        <TableCell />
        <TableCell colSpan={5}>
          <Burger.PrimaryButton label={'releases.button.branch'} onClick={() => { }}></Burger.PrimaryButton>
        </TableCell>
      </TableRow>}
    </>
  )
}

export { ReleasesView }
