import HdesClient from '../../client';
import ac, {FlowAstAutocomplete} from './ac';

const KEY_ID = "id";
const KEY_THEN = "then";
const KEY_WHEN = "when";
const KEY_SWITCH = "switch";
const KEY_DESC = "description";
const KEY_INPUTS = "inputs";
const KEY_TASKS = "tasks";
const KEY_REQ = "required";
const KEY_TYPE = "type";
const KEY_DT = "decisionTable";
const KEY_USER_TASK = "userTask";
const KEY_REF = "ref";
const KEY_COLLECTION = "collection";
const KEY_SERVICE = "service";
const VALUE_NEXT = "next";
const VALUE_END = "end";
const KEY_DEBUG_VALUE = "debugValue";


export class AutocompleteVisitor {
  
  private _flow: HdesClient.AstFlow;
  private _result: FlowAstAutocomplete[] = [];
  
  constructor(flow: HdesClient.AstFlow, site: HdesClient.Site) {
    this._flow = flow;
  }
  private hasNonNull(name: string, node: HdesClient.AstFlowNode): boolean {
    return this.get(name, node) ? true : false;
  }
  private get(keyword: string, node: HdesClient.AstFlowNode): HdesClient.AstFlowNode {
    return node.children[keyword];
  }
  
  visit() {
    this.visitRoot(this._flow.src);
    console.log("generating hints", this._result);
    return this._result;
  }
  visitRoot(flow: HdesClient.AstFlowRoot) {
    this.visitId(flow);
    this.visitDesc(flow);
    this.visitBody(flow)
  }
  
  visitBody(flow: HdesClient.AstFlowRoot) {
    const AFTER = [KEY_ID, KEY_DESC, KEY_INPUTS];
    const node = this.get(KEY_TASKS, flow);
    if(node != null) {
      return;
    }
    /*

    const after = AFTER.stream()
        .filter(name -> flow.hasNonNull(name))
        .map(name -> flow.get(name).getStart()).sorted()
        .collect(Collectors.toList());
    if(after.isEmpty()) {
      return;
    }

    int start = after.get(after.size() - 1) + 1;
    int end = flow.getEnd();

    modelBuilder.addAutocomplete(
        AstFlowNodesFactory.ac()
        .id(InputsAutocomplete.class.getSimpleName())
        .addField(NodeFlowBean.KEY_TASKS)
        .addRange(start, end)
        .build()); */
  
  }
  
  visitId(flow: HdesClient.AstFlowRoot) {
    const BEFORE = [KEY_DESC, KEY_INPUTS, KEY_TASKS];
    const node = flow.id;
    if(node != null) {
      return;
    }
    const before = BEFORE
        .filter(name => this.hasNonNull(name, flow))
        .map(name => this.get(name, flow).start - 1);
    const end = before.length ? before[0]: flow.end;
    this._result.push(ac().id("id-autocomplete").addField(KEY_ID).addRange({start: 0, end}).build());
  }
  
  visitDesc(flow: HdesClient.AstFlowRoot) {
    const BEFORE = [KEY_INPUTS, KEY_TASKS];
    if(flow.description != null || flow.id == null) {
      return;
    }

    const before = BEFORE
        .filter(name => this.hasNonNull(name, flow))
        .map(name => this.get(name, flow).start - 1);

    const start = flow.id.end + 1;
    const end = before.length ? before[0]: flow.end;
    this._result.push(ac().id('desc-autocomplete').addField(KEY_DESC).addRange({start, end}).build());
  }
}

