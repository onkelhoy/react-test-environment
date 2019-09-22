import React, { useContext } from 'react';
import { FieldContext } from 'util/context';
import './style.css'

const InputField =  props => {
  const { getFieldId } = useContext(FieldContext);

  const id = getFieldId();
  return (
    <div className="field">
      <label htmlFor={id}>{props.label || "label"}</label>
      <input id={id} type="text" placeholder={props.placeholder || "placeholder"} />
    </div>
  )
}

export default InputField