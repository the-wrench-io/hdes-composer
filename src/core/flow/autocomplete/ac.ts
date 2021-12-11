const FIELD = ":";

interface AstCommandRange {
  start: number;
  end: number;
  column?: number;
  insert?: boolean;
}

interface FlowAstAutocomplete {
  id: string
  range: AstCommandRange[];
  value: string[];
}



class AcBuilder {
  private _id?: string;
  private range: AstCommandRange[] = [];
  private value: string[] = [];

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

  addRange(props: AstCommandRange | AstCommandRange[]) {
    if(Array.isArray(props)) {
      this.range.push(...(props as AstCommandRange[]));  
    }
    const single = props as AstCommandRange;
    this.range.push({ ...single });
    return this;
  }
  addField(fieldName: string, props?: {
    indent?: number
    value?: any
  }) {
    const prefix = props?.indent ? this.getIndent(props.indent): '';
    const sufix = props?.value ? ' ' + this.getIndent(props.value): '';
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
    return { id: this._id, range: this.range, value: this.value }
  }
}
const ac = () => new AcBuilder();

export type { AstCommandRange, FlowAstAutocomplete }
export default ac;

