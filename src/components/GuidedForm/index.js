import React, { useState } from 'react';
import PropType from 'prop-types';
import { Form, Input, InputNumber, Button } from 'antd';
import Visible from '../Visible';


let timer;
const GuidedForm = props => {
  const {
    form: { getFieldDecorator },
    schema,
    layout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    },
  } = props;

  const [index, setIndex] = useState(0);
  const [values, setValues] = useState({});

  const getInitialValue = (type, config, initialValue = '') => {
    const { 
      min = 0,
      defaultValue = initialValue, 
    } = config;

    switch (type) {
      case 'checkbox':
        return defaultValue === '' ? false : defaultValue;
      case 'number':
        return defaultValue === '' ? min : defaultValue;
      default:
        return defaultValue;    
    }
  }

  const onSubmit = e => {
    e.preventDefault();
    const { form: { validateFields, resetFields }, onSubmit } = props;
    
    validateFields((error, fields) => {
      if (error) {
        console.error(error); 
        onSubmit(error);
      }
      else 
      {
        onSubmit(null, fields, e);
        validateFields(() => console.log('reseting'))
        resetFields();
      }
    })
  }

  const getInput = (type, key, targetIndex, options) => {
    const {
      onChange,
      ...restProps
    } = options;

    let value;
    const change = e => {
      switch (type.toLowerCase()) {
        case 'number':
          value = e;
          break;
        default:
          value = e.target.value;
          break;
      }

      if (index < targetIndex + 1) {
        clearInterval(timer);
        timer = setTimeout(() => 
          index < targetIndex + 1 && setIndex(targetIndex + 1), 1000)
      }
      
      const newValues = {...values};
      newValues[key] = value;      
      setValues(newValues);

      if (onChange) onChange(value, e);
    }

    switch (type.toLowerCase()) {
      case 'number':
        return <InputNumber onChange={change} {...restProps} />
      default:
        return <Input onChange={change} {...restProps} />
    }
  }
  
  const items = schema.map((item, targetIndex) => {
    const {
      type = 'text',
      label,
      key = label ? label.replace(/ /g, '-') : 'form-item' + targetIndex,
      options = {},
      ...restProps
    } = item;

    const {
      initialValue,
      itemlayout = {},
      ...restOptions
    } = options;

    if (values[key] === undefined) {
      const newValues = {...values};
      newValues[key] = getInitialValue(type, restOptions, initialValue);
      setValues(newValues);
    }

    const ll = {...layout, ...itemlayout};

    return (
      <Visible visible={index >= targetIndex} key={key}>
        <Form.Item label={label} {...ll}>
          {getFieldDecorator(key, { initialValue: values[key], ...restOptions })(
            getInput(type, key, targetIndex, restProps)
          )}
        </Form.Item>
      </Visible>
    )
  })

  items.push(
    <Visible visible={index >= items.length} key="submit">
      <Form.Item {...layout}>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Visible> 
  )

  return (
    <Form onSubmit={onSubmit}>
      {items}
    </Form>
  )
}

GuidedForm.propType = {
  schema: PropType.array.isRequired,
  onSubmit: PropType.func.isRequired,
};

export default Form.create()(GuidedForm);
