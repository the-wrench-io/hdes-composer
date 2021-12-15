import HdesClient from '../../client';

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
const FIELD = ":";

const TYPES: HdesClient.ValueType[] = [
  'ARRAY',
  'TIME', 'DATE', 'DATE_TIME',
  'STRING',
  'INTEGER', 'LONG', 'DECIMAL',
  'BOOLEAN'
];

export interface FlowAstAutocomplete {
  id: string
  value: string[];
  append: boolean;
  guided?: GuidedType;
}

export type GuidedType = 'service-task' | 'decision-task';
export class AutocompleteVisitor {
  
  private _flow: HdesClient.AstFlow;
  private _result: FlowAstAutocomplete[] = [];
  private _pos: CodeMirror.Position;
  
  constructor(flow: HdesClient.AstFlow, site: HdesClient.Site, pos: CodeMirror.Position) {
    this._flow = flow;
    this._pos = { line: pos.line, ch: pos.ch, sticky: pos.sticky };
    //console.log(flow);
  }
  private hasNonNull(name: string, node: HdesClient.AstFlowNode): boolean {
    return this.get(name, node) ? true : false;
  }
  private get(keyword: string, node: HdesClient.AstFlowNode): HdesClient.AstFlowNode {
    const result = node.children[keyword];
    return result;
  }
  
  visit() {
    this.visitRoot(this._flow.src);
    //console.log("generating hints", this._result);
    return this._result;
  }
  visitRoot(flow: HdesClient.AstFlowRoot) {
    this.visitId(flow);
    this.visitDesc(flow);
    this.visitInputs(flow);
    this.visitTasks(flow);
    this.visitNewInput(flow);
    this.visitInput(flow);
    this.visitNewTask(flow);
  }
  
  visitNewTask(flow: HdesClient.AstFlowRoot) {
    const tasks = this.get(KEY_TASKS, flow);
    if(tasks == null) {
      return;
    }
    let isAround = tasks.start < this._pos.line;
    let isEndOfLine = false;
    const allTasks: HdesClient.AstFlowNode[] = Object.values(tasks.children);
    for(const task of allTasks) {
      if(this.isEndOfLine(task)) {
        isEndOfLine = true;
        break;
      }
      if(this.in(task)) {
        isAround = false;
      }
    }
    
    if(isAround || isEndOfLine) {
      this._result.push(ac()
        .id("new switch task")
        .append(isEndOfLine)
        .addValue(isEndOfLine ? ["", ""] : "")
        .addField("- {name}", { indent: 2 })
        .addField("id",     { indent: 6, value: "{task-id}" })
        .addField("switch", { indent: 6 })
        .addField("- {caseName}",     { indent: 8 })
        .addField("when",   { indent: 12, value: "{when-boolean-expression}" })
        .addField("then",   { indent: 12, value: "{then-next-task-id}" })
        .build());
        
      this._result.push(ac()
        .id("new service task")
        .append(isEndOfLine)
        .addValue(isEndOfLine ? ["", ""] : "")
        .addField("- {name}",   { indent: 2 })
        .addField("id",         { indent: 6, value: "{id}" })
        .addField("then",       { indent: 6, value: "{next}" })
        .addField("{serviceType}", { indent: 6 })
        .addField("ref",        { indent: 8, value: "{ref}" })
        .addField("collection", { indent: 8, value: "false" })
        .addField("inputs",     { indent: 8 })
        .guided("service-task")
        .build());

      this._result.push(ac()
        .id("new decision task")
        .append(isEndOfLine)
        .addValue(isEndOfLine ? ["", ""] : "")
        .addField("- {name}",   { indent: 2 })
        .addField("id",         { indent: 6, value: "{id}" })
        .addField("then",       { indent: 6, value: "{next}" })
        .addField("{serviceType}", { indent: 6 })
        .addField("ref",        { indent: 8, value: "{ref}" })
        .addField("collection", { indent: 8, value: "false" })
        .addField("inputs",     { indent: 8 })
        .guided("decision-task")
        .build());
    }
  }
    
    
  visitNewInput(flow: HdesClient.AstFlowRoot) {
    const inputs = this.get(KEY_INPUTS, flow);
    if(!inputs) {
      return;
    }
    let isAround = this.in(inputs, this.get(KEY_TASKS, flow));
    let isEndOfLine = false;
    const allInputs: HdesClient.AstFlowNode[] = Object.values(inputs.children);
    for(const input of allInputs) {
      if(this.isEndOfLine(input)) {
        isEndOfLine = true;
        break;
      }
      if(this.in(input)) {
        isAround = false;
      }
    }
    if(isAround || isEndOfLine) {
      this._result.push(ac().id("new input")
          .append(isEndOfLine)
          .addValue("")
          .addField("{name}", { indent: 2 })
          .addField("required", { indent: 4, value: "true" })
          .addField("type", { indent: 4, value: "STRING"})
          .addField("debugValue", { indent: 4, value: "\"test-string\""})
          .build());    
    }
  }
  
  visitInput(flow: HdesClient.AstFlowRoot) {
    const inputs = flow.inputs;
    if(!inputs) {
      return;
    }
    const inputsNode = this.get(KEY_INPUTS, flow)
    const inputsSorted = Object.values(inputs).sort((v1, v2) => v1.start - v2.start);
    let index = 1;
    for(const input of inputsSorted) {
      if(this.in(input, inputsSorted[index++]) || input.end === inputsNode.end ) {
        this.visitInputRequired(input);
        this.visitInputType(input);
        this.visitDebugValue(input);
      }
      
    }
  }
  
  visitInputType(input: HdesClient.AstFlowInputNode) {
    if(input.type && this._pos.line !== input.type.start) {
      return;
    }
    for(const type of TYPES) {
      this._result.push(ac().id("type: " + type).addField("type", { indent: 4, value: type}).build());
    }
  }
  
  visitInputRequired(input: HdesClient.AstFlowInputNode) {
    if(input.required && this._pos.line !== input.required.start) {
      return;
    }
    this._result.push(ac().id("required: true").addField("required", { indent: 4, value: "true"}).build());
    this._result.push(ac().id("required: false").addField("required", { indent: 4, value: "false"}).build());
  }

  visitDebugValue(input: HdesClient.AstFlowInputNode) {
    if(input.debugValue) {
      return;
    }
    const builder = ac().id("debugValue");
    if(this.in(input)) {
      builder.addValue("").append(true);
    }
    this._result.push(builder.addField("debugValue", { indent: 4, value: "\"\""}).build())
  }
  
  visitInputs(flow: HdesClient.AstFlowRoot) {
    const node = this.get(KEY_INPUTS, flow);
    if(node) {
      return;
    }
    
    const AFTER = [KEY_ID, KEY_DESC];
    const after = AFTER
        .filter(name => this.hasNonNull(name, flow))
        .map(name => this.get(name, flow).start);
    if(!after.length) {
      return;
    }
    this._result.push(ac().id("inputs block")
        .addField(KEY_INPUTS)
        .addField("myInputParam", { indent: 2 })
        .addField("required", { indent: 4, value: true})
        .addField("type", { indent: 4, value: "STRING"})
        .build());
  }
  
  visitTasks(flow: HdesClient.AstFlowRoot) {
    if(this.get(KEY_TASKS, flow)) {
      return;
    }
    const inputs = this.get(KEY_INPUTS, flow);
    if(!inputs) {
      return;
    }
    if(!this.isAfter([inputs])) {
      return;
    }
    this._result.push(ac().id("tasks block").addField(KEY_TASKS).build()); 
  }
  
  visitId(flow: HdesClient.AstFlowRoot) {
    const BEFORE = [KEY_DESC, KEY_INPUTS, KEY_TASKS];
    const node = flow.id;
    if(node != null) {
      return; 
    }
    
    const before = BEFORE
        .filter(name => this.hasNonNull(name, flow))
        .map(name => this.get(name, flow));
    
    if(!this.isBefore(before)) {
      return; 
    }
    this._result.push(ac().id("id").addField(KEY_ID).build());
  }
  
  visitDesc(flow: HdesClient.AstFlowRoot) {
    const BEFORE = [KEY_INPUTS, KEY_TASKS];
    if(flow.description || !flow.id) {
      return;
    }

    const before = BEFORE
        .filter(name => this.hasNonNull(name, flow))
        .map(name => this.get(name, flow));
    if(!this.isBefore(before)) { 
      return; 
    }
    if(!this.isAfter([flow.id])) {
      return;
    }

    this._result.push(ac().id('description').addField(KEY_DESC).build());
  }
  isEndOfLine(node: HdesClient.AstFlowNode) {
    const sameLine = node.end === this._pos.line;
    if(!sameLine) {
      return false;
    }
    
    const last = Object.values(node.children).filter(v => v.end === node.end).reduce(v => v);
    if(!last) {
      return this._pos.ch >= node.value.length;
    }
    return this._pos.ch >= last.source.value.length 
  }
  in(node: HdesClient.AstFlowNode, endNode?: HdesClient.AstFlowNode) {
    const ending = endNode ? endNode.start - 1 : node.end;
    return this._pos.line <= ending && this._pos.line >= node.start;
  }

  isBefore(nodes: HdesClient.AstFlowNode[]): boolean {
    for(const current of nodes) {
      if(this._pos.line >= current.start) {
        return false;
      }
    }
    return true;
  }  

  isAfter(nodes: HdesClient.AstFlowNode[]): boolean {
    for(const current of nodes) {
      if(!(this._pos.line > current.end)) {
        return false;
      }
    }
    return true;
  }
}



class AcBuilder {
  private _id?: string;
  private value: string[] = [];
  private _append = false;
  private _guided: GuidedType | undefined;

  id(id: string): AcBuilder {
    this._id = id;
    return this;
  }
  private getIndent(indent: number): string {
    var result = "";
    for (var index = 0; index < indent; index++) {
      result += " ";
    }
    return result;
  }
  append(append: boolean) {
    this._append = append;
    return this;
  }
  guided(guided: GuidedType) {
    this._guided = guided;
    return this;
  }
  addField(fieldName: string, props?: {
    indent?: number
    value?: any
  }) {
    const prefix = props?.indent ? this.getIndent(props.indent): '';
    const sufix = props?.value ? ' ' + props.value: '';
    this.value.push(prefix + fieldName + FIELD + sufix);
    return this;
  }
  addValue(value: string | string[]) {
    const toArray: string[] = Array.isArray(value) ? value as string[] : [value as string];
    this.value.push(...toArray);
    return this;
  }
  build(): FlowAstAutocomplete {
    if(!this._id) {
      throw new Error("id must be defined!");
    }
    return { id: this._id, value: this.value, append: this._append, guided: this._guided }
  }
}
const ac = () => new AcBuilder();




const parseTemplate = (toBeReplaced: any, template: string[]) => {
  const result: string[] = [];
  for(let v of template) {
    let line: string = v;
    
    for(let key of Object.keys(toBeReplaced)) {
      const replacable = '{' + key + '}';
      if(line.indexOf(replacable) < 0) {
        continue;
      }
      if(toBeReplaced[key] === undefined) {
        return result;
      }
      line = line.replace(replacable, toBeReplaced[key])
    }
    result.push(line)
  }
  return result
}

const toLowerCamelCase = (value: string) => {
  if(value) {
    return value.replace(/^([A-Z])|\s(\w)/g, function(_match, p1, p2, _offset) {
      if (p2) return p2.toUpperCase();
      return p1.toLowerCase();        
    });    
  }
}


const executeTemplate = (cm: CodeMirror.Editor, value: any, guided: FlowAstAutocomplete, asset?: HdesClient.AstBody) => {
  const doc = cm.getDoc()
  const cursor = doc.getCursor()
  const content = cm.getLine(cursor.line)
  
  const lines: string[] = [];
  if(guided.append) {
    lines.push(content); 
  }
  lines.push(...parseTemplate(value, guided.value));
  if (asset) {
    console.log("Template asset", asset);
    const params = asset.headers.acceptDefs.map(p => '          ' + p.name + ':');
    lines.push(...params)
  }

  doc.replaceRange([...lines],
    { line: cursor.line, ch: 0 },
    { line: cursor.line, ch: content.length }, '+input')
}

export {parseTemplate, toLowerCamelCase, executeTemplate};
