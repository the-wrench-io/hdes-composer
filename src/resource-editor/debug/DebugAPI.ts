import { Hdes } from '../deps';

declare namespace API {
  interface DebugContext {
    models: DebugData[];
    getModel(modelId: string): DebugData | undefined;
    withModel(model: Hdes.ModelAPI.Model): DebugContext;
    withModelErrors(props: { modelId: string, errors: Hdes.StoreError}): DebugContext; 
    withModelEntity(props: { modelId: string, entity: string, value: string }): DebugContext;
    withoutModelEntity(modelId: string): DebugContext;
  }

  interface DebugData {
    model: string;
    entity: Record<string, string>
    errors?: Hdes.StoreError;
    withErrors(props: Hdes.StoreError): DebugData;
    withEntity(props: { entity: string, value: string }): DebugData;
  }
}

namespace API {

  class ImmutableDebugData implements DebugData {

    private _model: string;
    private _entity: Record<string, string>;
    private _errors?: Hdes.StoreError;

    constructor(props: {
      model: string,
      entity: Record<string, string>,
      errors?: Hdes.StoreError
    }) {
      this._model = props.model;
      this._entity = props.entity;
      this._errors = props.errors;
    }

    get model() {
      return this._model;
    }
    get entity() {
      return this._entity;
    }
    get errors() {
      return this._errors;
    }
    withEntity(props?: { entity: string, value: string }) {
      if (!props) {
        return new ImmutableDebugData({ model: this._model, entity: {} });
      }
      const newEntity = Object.assign({}, this._entity);
      newEntity[props.entity] = props.value;
      return new ImmutableDebugData({ model: this._model, entity: newEntity });
    }
    withErrors(errors: Hdes.StoreError) {
      return new ImmutableDebugData({ model: this._model, entity: this._entity, errors });
    }
  }

  export class ImmutableDebugContext implements DebugContext {
    private _models: Record<string, ImmutableDebugData>;
    private _service: Hdes.Service;

    constructor(props: {
      models: Record<string, ImmutableDebugData>,
      service: Hdes.Service
    }) {
      this._models = props.models;
      this._service = props.service;
    }
    
    get models() {
      return Object.values(this._models);
    }
    getModel(modelId: string) {
      return this._models[modelId];
    }
    withModel(initModel: Hdes.ModelAPI.Model): DebugContext {
      const modelId = initModel.id;
      if (this._models[modelId]) {
        return this;
      }

      const entity = {};
      initModel.params
        .filter(p => p.direction === "IN")
        .filter(p => p.values)
        .forEach(p => entity[p.name] = p.values);

      const newModels: Record<string, ImmutableDebugData> = Object.assign({}, this._models);
      newModels[modelId] = new ImmutableDebugData({ model: modelId, entity });
      return new ImmutableDebugContext({ models: newModels, service: this._service })
    }
    withModelEntity(props: { modelId: string, entity: string, value: string }): DebugContext {
      if (!this._models[props.modelId]) {
        return this;
      }

      const newModels: Record<string, ImmutableDebugData> = Object.assign({}, this._models);
      const debugData = newModels[props.modelId];
      newModels[props.modelId] = debugData.withEntity({ entity: props.entity, value: props.value });
      return new ImmutableDebugContext({ models: newModels, service: this._service })
    }
    withModelErrors(props: { modelId: string, errors: Hdes.StoreError }): DebugContext {
      if (!this._models[props.modelId]) {
        return this;
      }

      const newModels: Record<string, ImmutableDebugData> = Object.assign({}, this._models);
      const debugData = newModels[props.modelId];
      newModels[props.modelId] = debugData.withErrors(props.errors);
      return new ImmutableDebugContext({ models: newModels, service: this._service })
    }
    withoutModelEntity(modelId: string): DebugContext {
      if (!this._models[modelId]) {
        return this;
      }
      const newModels: Record<string, ImmutableDebugData> = Object.assign({}, this._models);
      const debugData = newModels[modelId];
      newModels[modelId] = debugData.withEntity();
      return new ImmutableDebugContext({ models: newModels, service: this._service })
    }
  }

  export const initContext = (service: Hdes.Service) => new ImmutableDebugContext({
    models: {},
    service
  });
}

export default API;