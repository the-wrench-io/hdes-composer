declare namespace API {
  interface DebugContext {
    models: DebugData[];
    getModel(modelId: string): DebugData | undefined;
    withModel(modelId: string): DebugContext;
    withModelEntity(props: { modelId: string, entity: string, value: string }): DebugContext;
    withoutModelEntity(modelId: string): DebugContext;
  }

  interface DebugData {
    model: string;
    entity: Record<string, string>
    withEntity(props: { entity: string, value: string }): DebugData;
  }
}

namespace API {

  class ImmutableDebugData implements DebugData {

    private _model: string;
    private _entity: Record<string, string>;

    constructor(props: {
      model: string,
      entity: Record<string, string>,
    }) {
      this._model = props.model;
      this._entity = props.entity;
    }

    get model() {
      return this._model;
    }
    get entity() {
      return this._entity;
    }
    withEntity(props?: { entity: string, value: string }) {
      if (!props) {
        return new ImmutableDebugData({ model: this._model, entity: {} });
      }
      const newEntity = Object.assign({}, this._entity);
      newEntity[props.entity] = props.value;
      return new ImmutableDebugData({ model: this._model, entity: newEntity });
    }
  }

  export const initContext = () => new ImmutableDebugContext({ models: {} });

  export class ImmutableDebugContext implements DebugContext {
    private _models: Record<string, ImmutableDebugData>;

    constructor(props: {
      models: Record<string, ImmutableDebugData>
    }) {
      this._models = props.models;
    }
    get models() {
      return Object.values(this._models);
    }
    getModel(modelId: string) {
      return this._models[modelId];
    }
    withModel(modelId: string): DebugContext {
      if (this._models[modelId]) {
        return this;
      }
      const newModels: Record<string, ImmutableDebugData> = Object.assign({}, this._models);
      newModels[modelId] = new ImmutableDebugData({ model: modelId, entity: {} });
      return new ImmutableDebugContext({ models: newModels })
    }
    withModelEntity(props: { modelId: string, entity: string, value: string }): DebugContext {
      if (!this._models[props.modelId]) {
        return this;
      }
      const newModels: Record<string, ImmutableDebugData> = Object.assign({}, this._models);
      const debugData = newModels[props.modelId];
      newModels[props.modelId] = debugData.withEntity({ entity: props.entity, value: props.value });
      return new ImmutableDebugContext({ models: newModels })
    }
    withoutModelEntity(modelId: string): DebugContext {
      if (!this._models[modelId]) {
        return this;
      }
      const newModels: Record<string, ImmutableDebugData> = Object.assign({}, this._models);
      const debugData = newModels[modelId];
      newModels[modelId] = debugData.withEntity();
      return new ImmutableDebugContext({ models: newModels })
    }
  }
}

export default API;