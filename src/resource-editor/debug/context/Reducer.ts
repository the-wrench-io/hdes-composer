import Session from './Session';
import { Hdes } from '../../deps'

enum ActionType {
  setModel = "setModel",
  setModelEntityDefaults = "setModelEntityDefaults",
  setModelEntity = "setModelEntity",
  setModelErrors = "setModelErrors",
  setModelOutput = "setModelOutput",
}

interface Action {
  type: ActionType;

  setModel?: Hdes.ModelAPI.Model;
  setModelEntityDefaults?: Hdes.ModelAPI.Model;
  setModelEntity?: { modelId: Session.ModelId, entity: string, value: string };
  setModelErrors?: { modelId: Session.ModelId, errors: Hdes.StoreError };
  setModelOutput?: { modelId: Session.ModelId, output: any };
}

const ActionBuilder = {
  setModel: (setModel: Hdes.ModelAPI.Model): Action => ({ type: ActionType.setModel, setModel }),
  setModelEntityDefaults: (setModelEntityDefaults: Hdes.ModelAPI.Model): Action => ({ type: ActionType.setModelEntityDefaults, setModelEntityDefaults }),
  setModelEntity: (setModelEntity: { modelId: Session.ModelId, entity: string, value: string }): Action => ({ type: ActionType.setModelEntity, setModelEntity }),
  setModelErrors: (setModelErrors: { modelId: Session.ModelId, errors: Hdes.StoreError }): Action => ({ type: ActionType.setModelErrors, setModelErrors }),
  setModelOutput: (setModelOutput: { modelId: Session.ModelId, output: any }): Action => ({ type: ActionType.setModelOutput, setModelOutput }),
}

class ReducerDispatch implements Session.Actions {

  private _sessionDispatch: React.Dispatch<Action>;
  private _service: Hdes.Service;

  constructor(service: Hdes.Service, session: React.Dispatch<Action>) {
    this._sessionDispatch = session;
    this._service = service;
  }
  
  async handleSetModel(model: Hdes.ModelAPI.Model) {
    this._sessionDispatch(ActionBuilder.setModel(model))
  }
  async handleSetModelEntityDefaults(model: Hdes.ModelAPI.Model) {
    this._sessionDispatch(ActionBuilder.setModelEntityDefaults(model))
  }
  async handleSetModelEntity(props: { modelId: Session.ModelId, entity: string, value: string }) {
    this._sessionDispatch(ActionBuilder.setModelEntity(props));
  }
  async handleSetModelErrors(props: { modelId: Session.ModelId, errors: Hdes.StoreError }) {
    this._sessionDispatch(ActionBuilder.setModelErrors(props));
  }
  handleExecute(props: { id: string, type: Hdes.ModelAPI.ServiceType, input: string }): Promise<void> {
    return this._service.debug.getDebug(props)
      .then(output => {
        this._sessionDispatch(ActionBuilder.setModelOutput({modelId: props.id, output}))
      })
      .catch(errors => {
        this._sessionDispatch(ActionBuilder.setModelErrors({ modelId: props.id, errors }))
      });
  }
}

const Reducer = (state: Session.Instance, action: Action): Session.Instance => {
  switch (action.type) {
    case ActionType.setModel: {
      if (action.setModel) {
        return state.withModel(action.setModel);
      }
      console.error("Action data error", action);
      return state;
    }
    case ActionType.setModelEntity: {
      if (action.setModelEntity) {
        return state.withModelEntity(action.setModelEntity);
      }
      console.error("Action data error", action);
      return state;
    }
    case ActionType.setModelEntityDefaults: {
      if (action.setModelEntityDefaults) {
        return state.withModelDefaults(action.setModelEntityDefaults);
      }
      console.error("Action data error", action);
      return state;
    }
    case ActionType.setModelErrors: {
      if (action.setModelErrors) {
        return state.withModelErrors(action.setModelErrors);
      }
      console.error("Action data error", action);
      return state;
    }
    case ActionType.setModelOutput: {
      if (action.setModelOutput) {
        return state.withModelOutput(action.setModelOutput);
      }
      console.error("Action data error", action);
      return state;
    }
  }
}

export type { Action }
export { Reducer, ReducerDispatch, ActionType };
