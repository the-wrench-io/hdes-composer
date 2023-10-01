import React from "react";

import { FormattedMessage } from "react-intl";
import { Composer } from "../context";
import { Box, ListItemText, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Burger from "@the-wrench-io/react-burger";

const CompareView: React.FC = () => {

  const { site } = Composer.useComposer();
  const layout = Burger.useTabs();
  const releases = Object.values(site.tags);
  const [base, setBase] = React.useState<string>("");
  const [target, setTarget] = React.useState<string>("");

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
          <Burger.PrimaryButton label={"activities.compare.view"} onClick={() => { }} />
        </Box>
      </Box>
      <Typography variant="body2" sx={{ mx: 1, mt: 2 }}><FormattedMessage id={"compare.tip"} /></Typography>
      <Box sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: 0.3, alignItems: 'center' }}>
          <Burger.Select label="compare.base"
            selected={base}
            onChange={(value) => setBase(value)}
            items={releases.map((release) => ({
              id: release.id,
              value: <ListItemText primary={release.ast?.name} />
            }))}
            empty={{
              id: "",
              label: "compare.base"
            }}
          />
        </Box>
        <ArrowBackIcon sx={{ m: 2, mt: 3 }} />
        <Box sx={{ width: 0.3 }}>
          <Burger.Select
            label="compare.target"
            selected={target}
            onChange={(value) => setTarget(value)}
            items={releases.map((release) => ({
              id: release.id,
              value: <ListItemText primary={release.ast?.name} />
            }))}
            empty={{
              id: "",
              label: "compare.target"
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export { CompareView };
