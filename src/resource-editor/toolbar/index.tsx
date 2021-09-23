import React from 'react';

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CachedIcon from '@mui/icons-material/Cached';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import ExtensionIcon from '@mui/icons-material/Extension';
import InfoIcon from '@mui/icons-material/Info';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { FormattedMessage } from 'react-intl';
import fileDownload from 'js-file-download'

import { Layout } from '../deps';
import Explorer from '../explorer';
import AddType from '../add-type';
import CopyAs from '../copy-as';
import Info from '../info';
import Resources from '../';
import { SaveDialog, SaveButton } from '../save';


const saveEnabled = (props: {
  resource: Resources.Session.ContextType,
  layout: Layout.Session.ContextType
}) => {
  const tabs = props.layout.session.tabs;
  const active = tabs[props.layout.session.history.open];
  if (!active) {
    return false;
  }
  const editor = props.resource.session.editor.getContent(active.id);

  if (!editor) {
    return false;
  }

  return editor.saved === false;
}

const createToolbar = (props: {
  resource: Resources.Session.ContextType,
  layout: Layout.Session.ContextType
}): Layout.Session.ToolbarItem[] => {

  return [
    {
      id: 'toolbar.explorer',
      icon: <LibraryBooksIcon />,
      type: () => ({ page: () => (<Explorer.View />) })
    },

    {
      id: 'toolbar.save',
      enabled: saveEnabled(props),
      icon: <SaveButton />,
      type: () => ({ dialog: (onClose: () => void) => (<SaveDialog handleClose={onClose} />) })
    },

    {
      id: 'toolbar.export',
      icon: <ImportExportIcon />,
      type: () => ({ button: () => 
        props.resource.service.resources.export().then(data => {
          fileDownload(data, 'migration.json')  
        })
      })
    },

    {
      id: 'toolbar.debug',
      icon: <PlayCircleFilledIcon />,
      type: () => ({
        button: () => props.layout.actions.handleTabAdd({ id: 'debug', label: <FormattedMessage id={"debug.tab.name"} /> })
      })
    },

    {
      id: 'toolbar.add',
      icon: <AddCircleIcon />,
      type: () => ({
        dialog: (onClose: () => void) => (<AddType handleClose={onClose} onSave={(asset) => Explorer.openTab(asset, props.layout.actions)} />)
      })
    },

    {
      id: 'toolbar.copyas',
      icon: <FileCopyIcon />,
      type: () => ({
        dialog: (onClose: () => void) => (<CopyAs handleClose={onClose} onSave={(asset) => Explorer.openTab(asset, props.layout.actions)} />)
      })
    },

    {
      id: 'toolbar.extensions',
      icon: <ExtensionIcon />,
      type: () => ({ button: () => (console.log("refresh")) })
    },

    {
      id: 'toolbar.releases',
      icon: <NewReleasesIcon />,
      type: () => ({
        button: () => props.layout.actions.handleTabAdd({ id: 'releases', label: 'Releases' })
      })
    },

    {
      id: 'toolbar.reload',
      icon: <CachedIcon />,
      type: () => ({ button: () => (props.resource.actions.setReload()) })
    },

    {
      id: 'toolbar.info',
      icon: <InfoIcon />,
      type: () => ({ dialog: (onClose: () => void) => (<Info handleClose={onClose} />) })
    },
  ];
}

export { createToolbar };


