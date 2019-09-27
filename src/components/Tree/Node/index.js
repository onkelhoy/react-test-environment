import React, { useState, useContext, useEffect, } from 'react';
import { withLocalize } from 'react-localize-redux';

import { Context, } from '../index';
const w = 80;
const h = 50;

const Node = (props) => {
  const { 
    addNode, 
    removeNode,
    svg, 
  } = useContext(Context);
  
  const { 
    data: { 
      name, 
      children = [], 
    }, 
    length,
    angle,
    parentPos,
    index, 
    translate,
  } = props;


  let x = 10, 
      y = svg.clientHeight/2 - h/2;

  if (parentPos)
  {
    x = parentPos.x + Math.cos(angle) * length;
    y = parentPos.y + Math.sin(angle) * length;
  }

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function init () {
      for (let i=0; i<children.length; i++)
      {
        await addNode(children[i], i, children.length, x, y, index);
      }
    }

    init();
  }, [addNode, x, y, children, index]);


  // t x="50%" y="50%" 
  return (
    <g className="node-group">
      <rect x={x} y={y} width={w} height={h} />
      <text x={x + w/2} y={y + h/2} dominantBaseline="middle" textAnchor="middle">{name}</text>
    </g>
  );
};

export default withLocalize(Node);