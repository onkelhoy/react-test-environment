import React, { useState, Fragment } from 'react';
import { CardFlip } from 'components/Animations/index';

const { Front, Back } = CardFlip;

const CardFlipper = (props) => {

  const [state, setState] = useState(true);

  return (
    <div style={{
      width: '30vw',
      height: '200px',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    }}>

      <CardFlip toggle={state}>
        <Front style={{backgroundColor: 'blue'}}>
          <h1>front page!</h1>
          <p>some text</p>
        </Front>
        <Back>
          <h1>back page!</h1>
          <p>some text</p>
          <button onClick={() => console.log('back is clicked')}>Yay!</button>
        </Back>
      </CardFlip>

      <button
        onClick={() => setState(!state)}
        >
        Flip
      </button>
    </div>
  )
}

export default CardFlipper;