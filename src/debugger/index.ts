import {Debugger as DebuggerAs, DebuggerProps} from './Debugger';

declare namespace Debugger {
  export {
    DebuggerProps as ProviderProps
  };
}

namespace Debugger {
  export const Provider = DebuggerAs;
}

export default Debugger;


