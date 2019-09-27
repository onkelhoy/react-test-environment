import React, { useRef, useEffect, useMemo, useContext, useState, } from 'react';
import * as d3 from 'd3';
import * as _ from 'lodash';

import './tree-style.scss';

const colors = {
  gray: {
    lighten: '#eee',
  }
}

/**
 * LINKS 
 * https://codepen.io/HanchengZhao-1471862086/pen/KoYbav
 * https://observablehq.com/@d3/collapsible-tree
 * https://stackoverflow.com/questions/40845121/where-is-d3-svg-diagonal
 * https://d3-wiki.readthedocs.io/zh_CN/master/SVG-Shapes/#diagonal
 * https://d3-wiki.readthedocs.io/zh_CN/master/Tree-Layout/
 * https://bl.ocks.org/d3noob/5537fe63086c4f100114f87f124850dd
 * https://hzhao.me/2018/05/07/treechart-in-d3/
 */
 
// the const for controlling the tree 
const LINK_SIZE = {dx: 100, dy: 200};
const TEXT_OFFSET = 15;
const NODE_SHAPE = (node, update, source) => {
  node.attr("transform", d => `translate(${source.y0},${source.x0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .on("click", d => {
        d.children = d.children ? null : d._children;
        update(d);
      }) // TODO trying to make a button appear and dissapear (try with css!)
      .on('mouseenter', d => node.select('.add-btn').attr('display', ''))
      .on('mouseleave', d => node.select('.add-btn').attr('display', 'hide'))
        
  node.append("rect")
      .attr('rx', 3)
      .attr('rx', 3)
      .attr('x', 0)
      .attr('y', -15)
      .attr('width', 75)
      .attr('height', 30)
      .attr('stroke-width', d => d._children ? 1.5 : 0.5)
      .attr('stroke', '#888')
      .attr("fill", d => d._children ? colors.gray.lighten : "white")
  
  node.append("text")
      .attr("dy", "0.31em")
      .attr("x", TEXT_OFFSET)
      .text(d => d.data.name)
      .clone(true).lower()
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .attr("stroke", "white");

  const addBtn = node.append('g')
      .attr('class', 'add-btn')
      .attr('display', 'none');

  addBtn.append('rect')
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('x', 50)
      .attr('y', -6)
      .attr('width', 16)
      .attr('height', 12)
      .attr('fill', '#666')
  
  addBtn.append('text')
      .attr('x', 58)
      .attr("dy", "0.31em")
      .attr("dx", "-0.31em")
      .text('+')
      .attr('stroke', '#efefef')
}


const Tree = ({Context, treeData}) => {
  const svg_ref = useRef();
  const [screen, setScreen] = useState({w:0, h:0,});
  const {container} = useContext(Context);
  const margin = {side: 120, top: 20,};

  // NOTE this is controlling the length of link
  const {dx, dy} = LINK_SIZE;

  useEffect(() => {
    const w = container.current.clientWidth;
    const h = container.current.clientHeight;

    setScreen({w, h,});
  }, [container]);

  const resizeEvent = _.debounce(() => {
    update(root);
  }, 500);

  // component did mount 
  useEffect(() => {
    window.addEventListener('resize', resizeEvent);

    // component did unmount -> remove window event 
    return () => {
      window.removeEventListener('resize', resizeEvent);
    }
  }, [resizeEvent]);

  const tree = d3.tree().nodeSize([dx, dy]);
  const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
  const root = d3.hierarchy(treeData);
    
  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children; // storing to temp 
    
    // disable children if [name] !== 7
    if (d.depth && d.data.name.length !== 7) d.children = null;
  });

  const svg = d3.select('svg.modelling-tree')
    .attr('viewBox', [-margin.side, -margin.top, screen.w, dx])
    .style('font', '10px sans-serif')
    .style('user-select', 'none');

  const gLink = svg.select('g.links')
    .attr('fill', 'none')
    .attr('stroke', '#555')
    .attr('stroke-opacity', 0.4)
    .attr('stroke-width', 1.5);

  const gNode = svg.select('g.nodes')
    .attr('cursor', 'pointer')
    .attr('pointer-events', 'all');

  function update(source) {
    const duration = d3.event && d3.event.altKey ? 2500 : 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + margin.top*2;

    const transition = svg.transition()
        .duration(duration)
        .attr("viewBox", [-margin.side, left.x - margin.top, screen.w, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes…
    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g");
    NODE_SHAPE(nodeEnter, update, source);

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);
    
    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  update(root);

  return (
    <svg 
      className="modelling-tree"
      width={screen.w + margin.side*2}
      height={screen.h + margin.top*2} 
      ref={svg_ref}>
      <g transform="translate(5, 5)">
        <g className="links"></g>
        <g className="nodes"></g>
      </g>
    </svg>
  );
}

export default Tree;
