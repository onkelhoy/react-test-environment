import React from 'react';

const Card = props => (
  <div className="card">
    <img src={`/content/${props.image}.svg`} alt={props.name} />
    <h3>{props.name}</h3>
    <p>some minor text would be nice</p>
  </div>
)

export default Card;