import React, { useContext } from 'react';
import { Input, InputNumber, Form } from 'antd';
import EditableContext from './context';

import { SafeAddition } from 'util/constants';

const EditableCell = props => {
  const { form: { getFieldDecorator }, totals, translate } = useContext(EditableContext);
  
  const {
    editing,
    dataIndex,
    title,
    config = {},
    record,
    index,
    children,
    ...restProps
  } = props;

  const {
    type,
    rules = [{ required: true, message: 'pleaseInput' + title }],
    max,
    total,
    ...restConfigProps
  } = config;

  const getInput = () => {
    let maxValue = max;
    
    if (totals[dataIndex] !== undefined) 
    {
      maxValue = SafeAddition(totals[dataIndex], Number(record[dataIndex]) || 0);
    }

    switch (type) {
      case 'number':
        return <InputNumber {...restConfigProps} max={maxValue}/>
      default: 
        return <Input {...restConfigProps} />
    }
  }

  const getChildren = () => {
    if (config.formatter) {
      
      let copy = [...children]
      let value = children[2]
      if (isNaN(Number(value)))
      {
        value = 0 // fallback value
      }
      copy[2] = config.formatter(value); // last element is the text 
      return copy
    }

    return children;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item style={{margin:0}}>
          {getFieldDecorator(dataIndex, {
            rules,
            initialValue: record[dataIndex]
          })(getInput())}
        </Form.Item>
      ) : (
        getChildren() // could be nice to use formatter here as well if any 
      )}
    </td>
  );
}

export default EditableCell;