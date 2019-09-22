import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

/**
 * NOTE 
 * all the components can have following props 
 *  + timeout [default: 300]
 */

import { timeout, pageTimeout } from './constants'
import './animations.scss'


/** 
 * This is more amimed towards page-load 
 * This component fades in on component mount 
 * and fade out on component unmount 
 * @param {object} props 
 */
export const FadeIn = props => (
  <CSSTransition
    in={props.toggle || true}
    appear={true}
    timeout={props.timeout || pageTimeout}
    classNames="fadeIn">
      <div className={"animation " + (props.className || '')}>
        {props.children}
      </div>
    </CSSTransition>
)

/** OBS - still work in progress
 * This component slides up on component mount [+ fades]
 * and slides down on component unmount [+ fades]
 * @param {object} props 
 */
export const SlideUp = (props) => (
  <CSSTransition
    in={true}
    appear={true}
    timeout={props.timeout || timeout}
    classNames="animation slide-up">

    <div className='animation'>
      {props.children}
    </div>
  </CSSTransition>
)

/** OBS - still work in progress
 * This component slides down on component mount [+ fades]
 * and slides up on component unmount [+ fades]
 * @param {object} props 
 */
export const SlideDown = (props) => (
  // <TransitionGroup className="animation">
    <CSSTransition
      in={props.in}
      timeout={props.timeout || timeout}
      classNames="down">

      <div className='animation'>
        {props.children}
      </div>
    </CSSTransition>
  // </TransitionGroup>
);

/**
 * This component collapses in and out on toggle 
 * (height and fading is effected)
 * @param {object} props 
 */
export const Collapse = props => (
  <CSSTransition
    in={props.toggle}
    timeout={timeout}
    classNames="collapse"
  >

    <div className="animation">
      {props.children}
    </div>
  </CSSTransition>
);

const CardFlipAnimation = (props) => {
  const toggle = props.toggle ? '' : 'flip'
  return (
    <div className="card-flip-container">
      <div className={`card-flip-inner ${toggle}`}>
        {props.children}
      </div>
    </div>
) }

CardFlipAnimation.Front = (props) => {
  const {children, ...restProps} = props;
  return (
    <div className="front" {...restProps}>
      {children}
    </div>
  )
}; 

CardFlipAnimation.Back = (props) => {
  const {children, ...restProps} = props;
  return (
    <div className="back" {...restProps}>
      {children}
    </div>
  )
}; 

export const CardFlip = CardFlipAnimation;
