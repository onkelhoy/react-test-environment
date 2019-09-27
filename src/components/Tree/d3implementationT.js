import React, { useRef, } from 'react';
import * as d3 from 'd3';


function expandOnKey (key, root) {
  let node = root;
  let tags = key.split(".");

  while (tags.length > 0)
  {
    let found = false;
    let next = tags[0];
    if (node._children)
    {
      for (let child of node._children)
      {
        if (child.data.name === next)
        {
          // expand this node 
          node.children = node._children;
          node._children = null; // hmm..

          node.className = "match";
          child.className = "match";
          node = child; 
          found = true;
        }
        if (found) tags.shift();
        else return;
      }
    }
  }
}

function collapse (d) {
  if (d.children)
  {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}

function getHeight (root) {
  if (!root) return 0;

  let expandChildren = [0];
  // if root has expanded children 
  if (root.children) {
    expandChildren = root.children.map(c => getHeight(c));
  }
  const max = expandChildren.reduce((a, b) => Math.max(a, b), 0);
  return 1 + max;
}


// credits: https://hzhao.me/2018/05/07/treechart-in-d3/
const Tree = (props) => {
  const svg = useRef();
  const {width, height, data,} = props;
  const margin = {top: 20, right: 0, bottom: 30, left: 70};

  const treemap = d3.tree().size([height, width]);
  let i = 0,
    duration = 750,
    root;

  // Assigns parent, children, height, depth
  root = d3.hierarchy(data, (d) => d.children);
  root.x0 = height / 2;
  root.y0 = 0;

  function update (source) {
    const currentHeight = getHeight(root);
    // const newWidth = 
    
    // assign x & y 
    const treeData = treemap(root);

    // compute layout 
    const nodes = treeData.descendants(),
          links = treeData.descendants().slice(1);
    
    // normalize 
    nodes.forEach((d) => d.y = d.depth * width / (currentHeight+Math.log(currentHeight-1)));

    // update nodes 
    let node = svg.selectAll('g.node')
      .data(nodes, (d) => d.id || (d.id = ++i));

    // enter any modes at parents prev position
    let nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${source.y0}, ${source.x0})`)
      .on('click', click);

    nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style('fill', (d) => d.children ? 'lightsteelblue' : 'white')


    nodeEnter.append('text')
      .attr('dy', '.35em')
      .attr('x', (d) => d.children || d._children ? -13 : 13)
      .attr('text-anchor', (d) => d.children || d._children ? 'end' : 'start')
      .text((d) => d.data.name);
    
    // update 
    let nodeUpdate = nodeEnter.merge(node);
    nodeUpdate.transition()
      .duration(duration)
      .attr('transform', (d) => `translate(${d.y}, ${d.x})`);

    // update note attribs & style 
    nodeUpdate.select('circle.node')
      .attr('r', 10)
      .style('fill', (d) => {
        if (getPath(d) === key)
        {
          return '#F88C36';
        }
        else if (d.class === 'match')
        {
          return "#3fb986";
        }
        return d._children ? 'lightsteelblue' : 'white';
      })
      .attr('cursor', 'pointer');
    
    // remove any exisiting nodes
    let nodeExit = node.exit().transition()
      .duration(duration)
      .attr('transform', (d) => `translate(${source.y}, ${source.x})`)
      .remove();
  
    // on exit reduce the node circle size to 0
    nodeExit.select('circle').attr('r', 1e-6);
    // on exit, reduce opacity of text 
    nodeExit.select('text').style('fill-opacity', 1e-6);

    /*********** links section ********/
    // update the links 
    let link = svg.selectAll('path.link')
      .data(links, (d) => d.id);
    
    // enter any new links at the parent's prev position 
    let linkEnter = link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', (d) => {
        const o = {x: source.x0, y: source.y0};
        return diagonal(o, o);
      });

    // update 
    let linkUpdate = linkEnter.merge(link);
    
    // transition back to parent element position
    linkUpdate.transition()
      .duration(duration)
      .attr('d', (d) => diagonal(d, d.parent))
      .style('stroke', (d) => d.class === 'match' && '#3fb986');
    
    // remove any existing links 
    let linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', (d) => {
        const o = {x: source.x, y: source.y};
        return diagonal(o, o);
      })
      .remove();

    // store old positions for transition
    nodes.forEach((d) => {
      d.x0 = d.x; 
      d.y0 = d.y;
    });

    // creates curved (diagonal path) from parent to child
    function diagonal (s, d) {
      return `M ${s.y} ${s.x}
              C ${(s.y + d.y) / 2} ${s.x}
                ${(s.y + d.y) / 2} ${d.x}
                ${d.y} ${d.x}`
    }

    // toggle children on click 
    function click (d) {
      if (!d.children && !d._children)
      {
        // leaf 
        key = getPath(d);
        d.path = key;
      }

      if (d.children)
      {
        d._children = d.children;
        d.children = null;
      }
      else 
      {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }

    function getPath (d) {
      const path = [];
      while (d.parent !== null)
      {
        path.unshift(d.data.name);
        d=d.parent;
      }

      return path.join('.');
    }
  } 


  return (
    <svg 
      ref={svg}
      className="modelling-tree"
      width={width}
      height={height}>

      <g transform={`translate(${margin.left}, ${margin.top})`}></g>
    </svg>
  );
}

export default Tree;