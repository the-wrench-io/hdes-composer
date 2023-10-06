import React from "react";

import { FormattedMessage } from "react-intl";
import { Composer } from "../context";
import { Box, ListItemText, Typography, Dialog, DialogTitle, DialogContent, DialogActions, ListItem, List, ButtonGroup } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Burger from "@the-wrench-io/react-burger";

import * as Diff2Html from "diff2html";
import "diff2html/bundles/css/diff2html.min.css";
import { OutputFormatType } from "diff2html/lib/types";
import { ReleasePreview, releasePreviewBase, releasePreviewTarget } from "./MockData";

interface DiffProps {
  base: string;
  target: string;
  diffStr: string;
}

interface ComareDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  diff: DiffProps;
}

const AssetMapper: React.FC<{ assets: ReleasePreview }> = ({ assets }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', m: 2 }}>
      <Typography variant='h5' fontWeight='bold'><FormattedMessage id='flows' /></Typography>
      <List>
        {assets.flows.map((flow) => (
          <ListItem>
            <Typography>{flow.name}</Typography>
          </ListItem>
        ))}
      </List>
      <Typography variant='h5' fontWeight='bold' sx={{ mt: 1 }}><FormattedMessage id='decisions' /></Typography>
      <List>
        {assets.decisions.map((decision) => (
          <ListItem>
            <Typography>{decision.name}</Typography>
          </ListItem>
        ))}
      </List>
      <Typography variant='h5' fontWeight='bold' sx={{ mt: 1 }}><FormattedMessage id='services' /></Typography>
      <List>
        {assets.services.map((service) => (
          <ListItem>
            <Typography>{service.name}</Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

const ReleaseSelect: React.FC<{ release: string, setRelease: (release: string) => void, label: string }> = ({ release, setRelease, label }) => {
  const { site } = Composer.useComposer();
  const releases = Object.values(site.tags);

  return (
    <Burger.Select label={label}
      selected={release}
      onChange={(value) => setRelease(value)}
      items={releases.map((release) => ({
        id: release.id,
        value: <ListItemText primary={release.ast?.name} />
      }))}
      empty={{
        id: "",
        label
      }}
    />
  );
}

const CompareDialog: React.FC<ComareDialogProps> = ({ open, setOpen, diff }) => {
  const { site } = Composer.useComposer();
  const releases = Object.values(site.tags);
  const baseName = releases.find((release) => release.id === diff.base)?.ast?.name;
  const targetName = releases.find((release) => release.id === diff.target)?.ast?.name;
  const [outputFormat, setOutputFormat] = React.useState<OutputFormatType>('line-by-line');

  const diffJson = Diff2Html.parse(diff.diffStr);
  const diffHtml = Diff2Html.html(diffJson, { outputFormat });

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth='xl'>
      <DialogTitle>
        <Typography variant="h3" sx={{ p: 1, fontWeight: "bold", color: "mainContent.dark" }}>
          <FormattedMessage id="compare.dialog.title" values={{ base: baseName, target: targetName }} />
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mx: 1, overflowY: 'unset' }}>
        <Box sx={{ minWidth: '80vw', display: 'flex', flexDirection: 'column' }}>
          <ButtonGroup variant="text" sx={{ alignSelf: 'flex-end' }}>
            <Burger.SecondaryButton label={"compare.dialog.line"} onClick={() => setOutputFormat('line-by-line')} />
            <Burger.SecondaryButton label={"compare.dialog.side"} onClick={() => setOutputFormat('side-by-side')} />
          </ButtonGroup>
          <div dangerouslySetInnerHTML={{ __html: diffHtml }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Burger.SecondaryButton label={"button.cancel"} onClick={() => setOpen(false)} />
      </DialogActions>
    </Dialog>
  );
}


const CompareView: React.FC = () => {
  const { service, session } = Composer.useComposer();
  const layout = Burger.useTabs();
  const [base, setBase] = React.useState<string>("");
  const [target, setTarget] = React.useState<string>("");
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [open, setOpen] = React.useState<boolean>(false);
  const [diffStr, setDiffStr] = React.useState<string>("");

  React.useEffect(() => {
    if (base && target) {
      setDisabled(false);
      service.diff({ baseId: base, targetId: target }).then((diff) => {
        console.log(diff);
        setDiffStr(diff.body);
      });
    } else {
      setDisabled(true);
    }
  }, [base, target]);

  return (
    <Box sx={{ paddingBottom: 1, m: 2 }}>
      <Box display="flex">
        <Box alignSelf="center">
          <Typography variant="h3" sx={{ p: 1, fontWeight: "bold", color: "mainContent.dark" }}>
            <FormattedMessage id="activities.compare.title" />
            <Typography variant="body2" sx={{ pt: 1 }}><FormattedMessage id={"activities.compare.desc"} /></Typography>
          </Typography>
        </Box>
        <Box flexGrow={1} />
        <Box alignSelf="center">
          <Burger.SecondaryButton label={"button.cancel"} onClick={() => layout.actions.handleTabCloseCurrent()} sx={{ marginRight: 1 }} />
          <Burger.PrimaryButton label={"activities.compare.view"} onClick={() => setOpen(true)} disabled={disabled} />
        </Box>
      </Box>
      <Typography variant="body2" sx={{ mx: 1, mt: 2 }}><FormattedMessage id={"compare.tip"} /></Typography>
      <Box sx={{ m: 1, display: 'flex' }}>
        <Box sx={{ width: 0.3, alignItems: 'center' }}>
          <ReleaseSelect release={base} setRelease={setBase} label="compare.base" />
          {base && <AssetMapper assets={releasePreviewBase} />}
        </Box>
        <ArrowBackIcon sx={{ m: 2, mt: 4 }} />
        <Box sx={{ width: 0.3 }}>
          <ReleaseSelect release={target} setRelease={setTarget} label="compare.target" />
          {target && <AssetMapper assets={releasePreviewTarget} />}
        </Box>
      </Box>
      <CompareDialog open={open} setOpen={setOpen} diff={{ base, target, diffStr }} />
    </Box >
  );
}

export { CompareView };
