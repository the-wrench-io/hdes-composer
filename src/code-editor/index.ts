
import {Provider as ProviderAs, ProviderProps} from './Provider';
import API from './api';


declare namespace CodeEditor {
  export type {
     ProviderProps
  }
  export {API};
}

namespace CodeEditor {
  export const Provider = ProviderAs;
  export const optimize = API.optimize;
  
}


export default CodeEditor;


