import React from 'react';
import { Vis as createVis } from './Vis';


declare namespace Vis {

  interface Model {
    nodes: Node[];
    edges: Edge[];
  }

  interface Node {
    id: string,
    label: string,
    shape: 'circle' | 'diamond' | 'box' | undefined,
    parents: string[],
    color?: string;
    group?: string,
    externalId?: string;
    body?: any;
    widthConstraint?: { maximum: number, minimum: number }
    x: number,
    y: number,
  }

  interface Edge {
    from: string,
    to: string
  }

  interface InitProps {
    model?: Model;
    options: any,
    events: {
      onClick: (id: string) => void;
      onDoubleClick: (id: string) => void;
    }
  }
}


interface VisEvents {
  select: (event: { nodes: Vis.Node[], edges: Vis.Edge[] }) => void;
  doubleClick: (event: { nodes: Vis.Node[], edges: Vis.Edge[] }) => void;
}

namespace Vis {
  export const create = (init: InitProps): React.ReactElement => {
    const { model } = init;
    if (!model) {
      return (<span></span>);
    }

    const events: VisEvents = {
      select: (event) => {
        const { nodes, edges } = event
        console.log("vis.events.select", nodes, edges);
        init.events.onClick(nodes[0].id);
      },

      doubleClick: (event) => {
        const { nodes, edges } = event;
        console.log("vis.events.doubleClick", nodes, edges);

        const selected = nodes[0];
        const values = model.nodes
          .filter(n => n.id === selected.id)
          .filter(n => n.id ? true : false)

        if (values.length > 0) {
          init.events.onDoubleClick(values[0].id)
        }
      }
    };

    return createVis({
      events: events,
      value: model,
      options: init.options
    });
  }
}

export default Vis;

