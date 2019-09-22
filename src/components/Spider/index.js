import React, { useState, useEffect } from 'react';
import './style.css'

const iterateChildren = (children, found = false) => {
  React.Children.forEach(children, child => {
    if (found) 
    { // now go down to (label and input)?
      console.log(child)
    }
    else if (child.props.spider) // found it 
    {
      console.log('find', child); 
      // return iterateChildren(child.props.children, true)

    }
    else if (child.props.children) // show most go on
      return iterateChildren(child.props.children);
  })
}

export const SpiderWrapper = props => {
  const [children, setChildren] = useState(props.children);
  
  useEffect(() => {
    
    iterateChildren(children);
    
    return () => {
      
    };
  }, []);

  console.log('hello')

  return (
    <div className="spider-container">
      <svg className="spider"></svg>
      {children}
    </div>
  )
}