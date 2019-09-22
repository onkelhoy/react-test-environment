import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const Question = props => {

  return (
    <div className="question">
      <h1>{props.title}</h1>
      <button type="button" className="yes" onClick={props.onYes}>yes</button>
      <span className="vertical"></span>
      <button type="button" className="no"  onClick={props.onNo} >no</button>
    </div>
  )
}

Question.propTypes = {
  title: PropTypes.string.isRequired,
  onYes: PropTypes.func.isRequired,
  onNo: PropTypes.func.isRequired,
};

export default Question;