import AstAPI from "./AstAPI";
import ModelAPI from "./ModelAPI";
import ResourceAPI from "./ResourceAPI";
import DebugAPI from "./DebugAPI";

import ModelService from "./spi/ModelService";
import AstService from "./spi/AstService";
import ResourceService from "./spi/ResourceService";
import DebugService from "./spi/DebugService";
import { Service, Store } from "./Service";


declare namespace Hdes {
  export interface ErrorProps {
    text: string;
    status: number;
    errors: any[];
  }

  export type { Service, Store, AstAPI, ModelAPI, ResourceAPI, DebugAPI };
}

namespace Hdes {
  export class StoreError extends Error {
    private _props: ErrorProps;

    constructor(props: ErrorProps) {
      super(props.text);
      this._props = props;
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


  export class ServiceImpl implements Hdes.Service {
    private _store: Store;
    private _models: ModelAPI.Service;
    private _debug: DebugAPI.Service;
    private _ast: AstAPI.Service;
    private _resources: ResourceAPI.Service;

    constructor(store: Hdes.Store) {
      this._store = store;
      this._models = new ModelService(store);
      this._debug = new DebugService(store);
      this._ast = new AstService(store);
      this._resources = new ResourceService(store);
    }

    get models() {
      return this._models;
    }
    get debug() {
      return this._debug;
    }
    get ast() {
      return this._ast;
    }
    get resources() {
      return this._resources;
    }
  }
}

export default Hdes;

