import {
  TagId, FlowId, ServiceId, DecisionId, AstBodyType, Direction, ValueType, ProgramStatus, HitPolicy, AssociationType, ColumnExpressionType, FlowCommandMessageType, AstCommandValue,
  CommandsAndChanges, AstChangeset, ProgramMessage, AstCommand, TypeDef, AstBody, Headers, AstSource, ProgramAssociation,
  Site, Entity, EntityId,
  CreateBuilder,
  AstDecision, AstDecisionRow, AstDecisionCell,
  AstFlow, FlowAstCommandMessage, FlowAstCommandRange, AstFlowInputType,
  AstFlowRoot, AstFlowTaskNode, AstFlowRefNode, AstFlowSwitchNode, AstFlowInputNode, AstFlowNode, AstService, 
  AstTag, AstTagValue,
  ServiceErrorMsg, ServiceErrorProps, Service, Store, DeleteBuilder,
  
  DebugRequest, DebugResponse, 
  ProgramResult, ServiceResult, DecisionResult, DecisionLog, DecisionLogEntry, 
  FlowProgramStepPointerType, FlowProgramStepRefType, FlowExecutionStatus, FlowResult, FlowResultLog, FlowResultErrorLog,
  Input, Output, CsvRow, VersionEntity
} from "./api";

import { StoreErrorImpl as StoreErrorImplAs, StoreError } from './error';
import { DefaultStore, StoreConfig } from './store';

declare namespace HdesClient {
  export type {
    TagId, FlowId, ServiceId, DecisionId, AstBodyType, Direction, ValueType, ProgramStatus, HitPolicy, AssociationType, ColumnExpressionType, FlowCommandMessageType, AstCommandValue,
    CommandsAndChanges, AstChangeset, ProgramMessage, AstCommand, TypeDef, AstBody, Headers, AstSource, ProgramAssociation,
    Site, Entity, EntityId,
    CreateBuilder, DeleteBuilder,
    AstDecision, AstDecisionRow, AstDecisionCell,
    AstFlow, FlowAstCommandMessage, FlowAstCommandRange, AstFlowInputType,
    AstFlowRoot, AstFlowTaskNode, AstFlowRefNode, AstFlowSwitchNode, AstFlowInputNode, AstFlowNode, AstService, 
    AstTag, AstTagValue,
    ServiceErrorMsg, ServiceErrorProps, Service, Store, StoreError, StoreConfig,
    
    DebugRequest, DebugResponse, 
    ProgramResult, ServiceResult, DecisionResult, DecisionLog, DecisionLogEntry, 
    FlowProgramStepPointerType, FlowProgramStepRefType, FlowExecutionStatus, FlowResult, FlowResultLog, FlowResultErrorLog,
    Input, Output, CsvRow  
  };
}

namespace HdesClient {
  export const StoreErrorImpl = StoreErrorImplAs;
  export const StoreImpl = DefaultStore;
  
  export class ServiceImpl implements HdesClient.Service {
    private _store: Store;
    private _headers: HeadersInit | undefined;

    constructor(store: HdesClient.Store) {
      this._store = store;
      this._headers = undefined;
    }
    withBranch(branchName: string): HdesClient.ServiceImpl {
      this._headers = { "Branch-Name": branchName };
      return this;
    }
    create(): HdesClient.CreateBuilder {
      const flow = (name: string) => this.createAsset(name, undefined, "FLOW");
      const service = (name: string) => this.createAsset(name, undefined, "FLOW_TASK");
      const decision = (name: string) => this.createAsset(name, undefined, "DT");
      const branch = (body: HdesClient.AstCommand[]) => this.createAsset("branch", undefined, "BRANCH", body);
      const tag = (props: {name: string, desc: string}) => this.createAsset(props.name, props.desc, "TAG");
      const site = () => this.createAsset("repo", undefined, "SITE");
      
      const importData = (tagContentAsString: string): Promise<HdesClient.Site> => {
        return this._store.fetch("/importTag", { method: "POST", body: tagContentAsString });
      }
      
      return { flow, service, decision, branch, site, tag, importData };
    }
    delete(): HdesClient.DeleteBuilder {
      const deleteMethod = (id: string): Promise<HdesClient.Site> => this._store.fetch(`/resources/${id}`, { method: "DELETE", headers: this._headers });
      const flow = (id: FlowId) => deleteMethod(id);
      const service = (id: ServiceId) => deleteMethod(id);
      const decision = (id: DecisionId) => deleteMethod(id);
      const tag = (id: TagId) => deleteMethod(id);
      return { flow, service, decision, tag };
    }
    update(id: string, body: HdesClient.AstCommand[]): Promise<HdesClient.Site> {
      return this._store.fetch("/resources", { method: "PUT", body: JSON.stringify({ id, body }), headers: this._headers });
    }
    createAsset(name: string, desc: string | undefined, type: HdesClient.AstBodyType | "SITE", body?: HdesClient.AstCommand[]): Promise<HdesClient.Site> {
      return this._store.fetch("/resources", { method: "POST", body: JSON.stringify({ name, desc, type, body, headers: this._headers }) });
    }
    ast(id: string, body: HdesClient.AstCommand[]): Promise<HdesClient.Entity<any>> {
      return this._store.fetch("/commands", { method: "POST", body: JSON.stringify({ id, body, headers: this._headers }) });
    }
    getSite(): Promise<HdesClient.Site> {
      return this._store.fetch("/dataModels", { method: "GET", body: undefined, headers: this._headers }).then(data => {
        console.log(data);
        return data as HdesClient.Site;
      });
    }
    debug(debug: HdesClient.DebugRequest): Promise<HdesClient.DebugResponse> {
      return this._store.fetch("/debugs", { method: "POST", body: JSON.stringify(debug), headers: this._headers });
    }
    copy(id: string, name: string): Promise<HdesClient.Site> {
      return this._store.fetch("/copyas", { method: "POST", body: JSON.stringify({ id, name }), headers: this._headers });
    }
    version(): Promise<VersionEntity> {
      return this._store.fetch("/version", { method: "GET", body: undefined });
    }
  }
}



export default HdesClient;

