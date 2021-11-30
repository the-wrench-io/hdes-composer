import {
  TagId, FlowId, ServiceId, DecisionId, AstBodyType, Direction, ValueType, ProgramStatus, HitPolicy, AssociationType, ColumnExpressionType, FlowCommandMessageType, AstCommandValue,
  CommandsAndChanges, AstChangeset, ProgramMessage, AstCommand, TypeDef, AstBody, Headers, AstSource, ProgramAssociation,
  Site, Entity, EntityId, 
  CreateBuilder,
  AstDecision, AstDecisionRow, AstDecisionCell,
  AstFlow, FlowAstAutocomplete, FlowAstCommandMessage, FlowAstCommandRange, AstFlowInputType,
  AstFlowRoot, AstFlowTaskNode, AstFlowRefNode, AstFlowSwitchNode, AstFlowInputNode, AstFlowNode, AstService, AstTag,
  ServiceErrorMsg, ServiceErrorProps, Service, Store
} from "./api";

const getErrorMsg = (error: any) => {
  if (error.msg) {
    return error.msg;
  }
  if (error.value) {
    return error.value
  }
  if (error.message) {
    return error.message;
  }
}
const getErrorId = (error: any) => {
  if (error.id) {
    return error.id;
  }
  if (error.code) {
    return error.code
  }
  return "";
}
const parseErrors = (props: any[]): ServiceErrorMsg[] => {
  if (!props) {
    return []
  }

  const result: ServiceErrorMsg[] = props.map(error => ({
    id: getErrorId(error),
    value: getErrorMsg(error)
  }));

  return result;
}


declare namespace HdesClient {
  export type {
    TagId, FlowId, ServiceId, DecisionId, AstBodyType, Direction, ValueType, ProgramStatus, HitPolicy, AssociationType, ColumnExpressionType, FlowCommandMessageType, AstCommandValue,
    CommandsAndChanges, AstChangeset, ProgramMessage, AstCommand, TypeDef, AstBody, Headers, AstSource, ProgramAssociation,
    Site, Entity, EntityId, 
    CreateBuilder,
    AstDecision, AstDecisionRow, AstDecisionCell,
    AstFlow, FlowAstAutocomplete, FlowAstCommandMessage, FlowAstCommandRange, AstFlowInputType,
    AstFlowRoot, AstFlowTaskNode, AstFlowRefNode, AstFlowSwitchNode, AstFlowInputNode, AstFlowNode, AstService, AstTag,
    ServiceErrorMsg, ServiceErrorProps, Service, Store
  };
}

namespace HdesClient {
  export class StoreError extends Error {
    private _props: HdesClient.ServiceErrorProps;
    constructor(props: HdesClient.ServiceErrorProps) {
      super(props.text);
      this._props = {
        text: props.text,
        status: props.status,
        errors: parseErrors(props.errors)
      };
    }
    get name() {
      return this._props.text;
    }
    get status() {
      return this._props.status;
    }
    get errors() {
      return this._props.errors;
    }
  }
  export class ServiceImpl implements HdesClient.Service {
    private _store: Store;

    constructor(store: HdesClient.Store) {
      this._store = store;
    }
    create() {
      return {} as any;
    }
    getSite(): Promise<HdesClient.Site> {
      return this._store.fetch("/dataModels", { method: "GET", body: undefined });
    }
  }
}

export default HdesClient;

