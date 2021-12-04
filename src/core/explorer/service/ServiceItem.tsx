import React from "react";
import { Box, Typography } from "@mui/material";

import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import EditIcon from '@mui/icons-material/ModeEdit';

import { FormattedMessage } from 'react-intl';


import Burger from '@the-wrench-io/react-burger';

import { Composer, Client } from '../../context';
import ServiceOptions from './ServiceOptions';



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
    <Burger.TreeItem nodeId={service.id} labelText={serviceName} labelIcon={ArticleOutlinedIcon} labelcolor={saved ? "explorerItem" : "explorerItem.contrastText"}>

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
