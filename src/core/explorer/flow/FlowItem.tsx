import React from "react";
import { Box, Typography } from "@mui/material";

import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/ModeEdit';

import { FormattedMessage } from 'react-intl';


import Burger from '@the-wrench-io/react-burger';

import { Composer, Client } from '../../context';
import FlowOptions from './FlowOptions';



function DecisionItem(props: {
  labelText: string;
  nodeId: string;
  children?: React.ReactChild;
  onClick: () => void;
}) {
  return (
    <Burger.TreeItemRoot
      nodeId={props.nodeId}
      onClick={props.onClick}
      label={
        <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
          <Box component={AccountTreeOutlinedIcon} color="workflow.main" sx={{ pl: 1, mr: 1 }} />
          <Typography noWrap={true} maxWidth="300px" variant="body2"
            sx={{ fontWeight: "inherit", flexGrow: 1 }}
          >
            {props.labelText}
          </Typography>
        </Box>
      }
    />
  );
}


const ServiceItem: React.FC<{
  labelText: string;
  nodeId: string;
  children?: React.ReactChild;
  onClick: () => void;
}> = (props) => {
  return (
    <Burger.TreeItemRoot
      nodeId={props.nodeId}
      onClick={props.onClick}
      label={
        <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
          <Box component={LinkIcon} color="link.main" sx={{ pl: 1, mr: 1 }} />
          <Typography align="left" maxWidth="300px" noWrap={true} variant="body2"
            sx={{ fontWeight: "inherit", flexGrow: 1 }}
          >
            {props.labelText}
          </Typography>
        </Box>
      }
    />
  );
}


const FlowItem: React.FC<{ flowId: Client.FlowId }> = ({ flowId }) => {

  const { session, isArticleSaved } = Composer.useComposer();
  const nav = Composer.useNav();
  
  
  const flow = session.site.flows[flowId];
  
  const saved = isArticleSaved(flow);
  const flowName = flow.ast ? flow.ast.name : flow.id;

  const decisions: Client.Entity<Client.AstDecision>[] = [];
  const services: Client.Entity<Client.AstService>[] = [];

  return (
    <Burger.TreeItem nodeId={flow.id} labelText={flowName} labelIcon={ArticleOutlinedIcon} labelcolor={saved ? "explorerItem" : "explorerItem.contrastText"}>

      <Burger.TreeItemOption nodeId={flow.id + 'edit-nested'}
        color='article'
        icon={EditIcon}
        onClick={() => nav.handleInTab({ article: flow })}
        labelText={<FormattedMessage id="flows.edit.title" />}>
      </Burger.TreeItemOption>

      {/** Article options */}
      <Burger.TreeItem nodeId={flow.id + 'flow-options-nested'}
        labelText={<FormattedMessage id="options" />}
        labelIcon={EditIcon}>
        <FlowOptions flow={flow} />
      </Burger.TreeItem>


      {/** Decision options */}
      <Burger.TreeItem nodeId={flow.id + 'decisions-nested'}
        labelText={<FormattedMessage id="decisions" />}
        labelIcon={FolderOutlinedIcon}
        labelInfo={`${decisions.length}`}
        labelcolor="workflow">

        {decisions.map(view => (<DecisionItem key={view.id} nodeId={view.id}
          labelText={view.ast ? view.ast.name : view.id}
          onClick={() => nav.handleInTab({ article: view })}
        />))}
      </Burger.TreeItem>


      {/** Service options */}
      <Burger.TreeItem nodeId={flow.id + 'services-nested'}
        labelText={<FormattedMessage id="services" />}
        labelIcon={FolderOutlinedIcon}
        labelInfo={`${services.length}`}
        labelcolor="link">

        {services.map(view => (<ServiceItem key={view.id} nodeId={view.id}
          labelText={view.ast ? view.ast.name : view.id}
          onClick={() => nav.handleInTab({ article: view })}
        />)
        )}
      </Burger.TreeItem>
    </Burger.TreeItem>)
}
export default FlowItem;
