import React from "react";
import { Box, Typography } from "@mui/material";

import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import ConstructionIcon from '@mui/icons-material/Construction';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import EditIcon from '@mui/icons-material/ModeEdit';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import LowPriorityIcon from '@mui/icons-material/LowPriority';

import { FormattedMessage } from 'react-intl';

import Burger from '@the-wrench-io/react-burger';

import MsgTreeItem from '../MsgTreeItem';
import { Composer, Client } from '../../context';
import ServiceOptions from './ServiceOptions';


const ErrorItem: React.FC<{
  msg: Client.ProgramMessage;
  nodeId: string;
}> = (props) => {
  return (
    <MsgTreeItem error msg={props.msg} nodeId={props.nodeId}>
      <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
        <Box component={PriorityHighIcon} color="error.main" sx={{ pl: 1, mr: 1 }} />
        <Typography align="left" maxWidth="300px" sx={{ fontWeight: "inherit", flexGrow: 1 }} noWrap>
          <b>{props.msg.id}</b><br />
          {props.msg.msg}
        </Typography>
      </Box>
    </MsgTreeItem>
  );
}

const WarningItem: React.FC<{
  msg: Client.ProgramMessage;
  nodeId: string;
}> = (props) => {
  return (
    <MsgTreeItem error msg={props.msg} nodeId={props.nodeId}>
      <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
        <Box component={LowPriorityIcon} color="warning.main" sx={{ pl: 1, mr: 1 }} />
        <Typography align="left" maxWidth="300px" sx={{ fontWeight: "inherit", flexGrow: 1 }} noWrap>
          <b>{props.msg.id}</b><br />
          {props.msg.msg}
        </Typography>
      </Box>
    </MsgTreeItem>
  );
}


function FlowItem(props: {
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
          <Box component={AccountTreeOutlinedIcon} color="article.main" sx={{ pl: 1, mr: 1 }} />
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

const ServiceItem: React.FC<{ serviceId: Client.ServiceId }> = ({ serviceId }) => {

  const { session, isArticleSaved } = Composer.useComposer();
  const nav = Composer.useNav();
  
  
  const service = session.site.services[serviceId];
  
  const saved = isArticleSaved(service);
  const serviceName = service.ast ? service.ast.name : service.id;

  const flows: Client.Entity<Client.AstFlow>[] = [];

  return (
    <Burger.TreeItem nodeId={service.id} labelText={serviceName} 
      labelIcon={ArticleOutlinedIcon}
      labelInfo={service.status === "UP" ? undefined : <ConstructionIcon color="error" />} 
      labelcolor={saved ? "explorerItem" : "explorerItem.contrastText"}>

      {/** Service status */}
      <Burger.TreeItem nodeId={service.id + 'status-nested'}
        labelText={<FormattedMessage id={`program.status.${service.status}`} />}
        labelIcon={FolderOutlinedIcon}
        labelInfo={`${service.errors.length + service.warnings.length}`}
        labelcolor="workflow">

        {service.errors.map((view, index) => (<ErrorItem key={index} msg={view} nodeId={`${view.id}-error-${index}`} />))}
        {service.warnings.map((view, index) => (<WarningItem key={index} msg={view} nodeId={`${view.id}-warning-${index}`} />))}
      </Burger.TreeItem>

      {/** Service options */}
      <Burger.TreeItem nodeId={service.id + 'options-nested'}
        labelText={<FormattedMessage id="options" />}
        labelIcon={EditIcon}>
        <ServiceOptions service={service} />
      </Burger.TreeItem>


      {/** Flow options */}
      <Burger.TreeItem nodeId={service.id + 'flows-nested'}
        labelText={<FormattedMessage id="flows" />}
        labelIcon={FolderOutlinedIcon}
        labelInfo={`${flows.length}`}
        labelcolor="article">

        {flows.map(view => (<FlowItem key={view.id} nodeId={view.id}
          labelText={view.ast ? view.ast.name : view.id}
          onClick={() => nav.handleInTab({ article: view })}
        />)
        )}
      </Burger.TreeItem>
    </Burger.TreeItem>)
}
export default ServiceItem;
