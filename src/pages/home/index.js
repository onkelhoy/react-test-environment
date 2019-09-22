import React from 'react';
import { FieldProvider } from '../../util/context';
import InputField from '../../components/InputField';
import Card from './card'
import './style.css'
import { SpiderWrapper } from '../../components/Spider';


export default props => {
  const images = []

  return (
    <FieldProvider>
      <div className="container">

        {/* <SpiderWrapper>
            <InputField label="firstname" spider/>
          {/* <div className="form">
            <InputField label="lastname" spider/>
            <InputField label="email" spider/>
          </div> 
        </SpiderWrapper> */}
        
        <Card name="investor" />
        <Card name="startup" />
        <Card name="service-provider" />
        <h2>Which one are you?</h2>


      </div>
    </FieldProvider>
  )
}