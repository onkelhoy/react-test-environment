import React, { createContext } from 'react';

export const ChessContext = createContext();

export const FieldContext = createContext();

export const FieldProvider = props => {
  let fieldId = 0;

  const getFieldId = () => {
    return 'field' + ++fieldId;
  }

  return (
    <FieldContext.Provider value={{ getFieldId }}>
      {props.children}
    </FieldContext.Provider>
  )
} 