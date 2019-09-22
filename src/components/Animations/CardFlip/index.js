import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { timeout } from './constants''

const CardFlip = (props) => (
  <CSSTransition
      in={props.toggle}
      appear={true}
      timeout={timeout}
      classNames="card-flip"
    >

    <div className="animation">
      {props.children}
    </div>
  </CSSTransition>
) 

export const Front = (props) => (
  <div className="front">
    {props.children}
  </div>
)

export const Back = (props) => (
  <div className="back">
    {props.children}
  </div>
)

export default CardFlip;