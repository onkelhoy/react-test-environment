import React, { Component, createContext, } from 'react';
import { sameObjects } from 'util/constants';
import Node from './Node';

import './tree-style.scss';

const Context = createContext();
export default class Tree extends Component {

  svg = null;
  nodes = [];
  state = {
    initial: true,
    nodes: [],
  };

  componentDidUpdate (prevProps) {
    if (!sameObjects(this.props.data, prevProps.data)) 
    {
      this.mapNodes();
    }
  }

  componentDidMount () {
    this.mapNodes();
  }

  mapNodes = () => {
    // start fresh
    this.setState({ nodes: [] }, this.addNode.bind(this, this.props.root));
  }

  addNode = (node, childIndex, count, px, py, parentIndex) => new Promise(res => {
    const nodes = [...this.state.nodes];
    let length = px, angle = undefined, index = "root";

    // OR => 0 
    const isRoot = isNaN(Number(childIndex)); 
    if (!isRoot)
    {
      
      index = `${parentIndex}.${childIndex}`;
    }
    const parentPos = isRoot ? undefined : {x: px, y: py}; 

    nodes.push(<Node 
      index={index} 
      key={index} 
      data={node} 
      length={length}
      angle={angle} 
      parentPos={parentPos} />);
    this.setState({ nodes }, res);
  })

  render () {
    const provides = {
      addNode: this.addNode,
      addSubTree: (nodes) => this.setState({ nodes }),
      nodes: this.state.nodes,
      svg: this.svg,
    };

    return (
      <Context.Provider value={provides}>
      <svg className="tree-editor" ref={(svg) => this.svg = svg}>
        {this.state.nodes}
      </svg>
      </Context.Provider>
    );
  }
} 

export { Context };