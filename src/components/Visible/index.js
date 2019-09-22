import React from 'react';
import PropTypes from "prop-types";
import './style.scss'

const Visible = props => (
  <div className={`visible-container ${props.visible ? 'visible' : ''}`}>
    {props.children}
  </div>
);

Visible.propType = {
  visible: PropTypes.bool.isRequired,
};

export default Visible;