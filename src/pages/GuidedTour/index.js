import React, { useContext, useState } from 'react';
import Question from 'components/Question';
import GuidedForm from 'components/GuidedForm';
import Visible from '../../components/Visible/index';

import './style.scss'

const GuidedTour = props => {
  const [index, setIndex] = useState(0);

  const goForwards = (step = 1) => {
    setIndex(index + step);
  }
  const goBackwards = (step = 1) => {
    setIndex(index - step);
  }

  // schemas
  const fillYourName = [
    {
      label: 'Your name',
    },
    {
      label: 'Amount',
      type: 'number',
    },
  ];

  const founderSchema = [
    {
      label: ''
    }
  ];
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <React.Fragment>

    <Visible visible={index === 1}>
      <Question 
        title="Are you a founder?" 
        onYes={() => goForwards()} 
        onNo={() => goForwards(2)} /> 
    </Visible>

    {/* ### yes path ####### */}

    <Visible visible={index === 0}>
      <GuidedForm schema={fillYourName} onSubmit={() => goForwards()} layout={formItemLayout} />
    </Visible>
    
    <Visible visible={index === 2}>
      <Question 
        title="Do you have other founders?" 
        onYes={() => goForwards()} 
        onNo={() => console.log('no')} />    
    </Visible>
    
    {/* ### no path ######## */}

    <Visible visible={index === 3}>
      <GuidedForm schema={founderSchema} onSubmit={() => console.log('done')} />
    </Visible>
    
    </React.Fragment>
  )
}

export default GuidedTour;