import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Form, Icon } from 'antd';

import EditableContext from './context';
import Operations from './Operations';
import EditableCell from './EditableCell';
import './style.scss';
import 'antd/dist/antd.css'
import { SafeSubtraction } from 'util/constants';

/**
 * just pass schema, data, and other table props you want
 * for schema, you pass name, and type (optional)
 * for more info check the GrantForm 
 * @param {object} props 
 */
const EditableTable = props => {
  const {
    data,
    form,
    schema,
    footer,
    size = "small",
    translate,
    setData,
    className = "",
    onRow,
  } = props;

  for (let i=0; i<data.length; i++) {
    if (data[i].key === undefined) data[i].key = i; 
  }
  // const [data, setData] = useState(data.map((item, index) => ({ ...item, key: index })));
  const [editingKey, setEditingKey] = useState('');
  const [index, setIndex] = useState(data.length);
  
  // setting up the totals 
  const [sourceSchema, setSourceSchema] = useState({});
  
  const [columns, setColumns] = useState([]);
  const [totals, setTotals] = useState([]);
  
  useEffect(() => {
    const _totals = {};
    const _schema = {}

    const cols = schema.map(col => {
      const {
        name,
        title,
        total,
        ...config
      } = col;
  
      let value = config.default || 'N/A';
      if (config.type === 'number' && value === 'N/A')
        value = config.min || 0;
  
      _schema[name] = value;
      if (total) {
        _totals[name] = config.max || Number(total);
      }
  
      return {
        key:           name,
        dataIndex:     name,
        originalTitle: title || name,
        title:         title || name,
        editable:      config.type !== 'static', 
        ...config,
  
        onCell: record => {
  
          return {
            record, 
            config,
            dataIndex: name,
            title:     title || name,
            editing: editingKey === record.key && config.type !== 'static',
          }
        },
      };
    });
    cols.push({
      title: 'operations',
      dataIndex: 'operation',
      width: 100,
      render: (text, record, index) => {
        return <Operations record={record} index={index} />
      }
    });

    setColumns(cols)
  
    // if theres some, we check the current data and take away the value 
    if (Object.keys(_totals).length > 0) {
      for (let d of data) {
        for (let key in _totals) {
          console.log('before', _totals[key])
          console.log('adding', Number(d[key]) || 0)
          // _totals[key] -= Number(d[key]) || 0;
          _totals[key] = SafeSubtraction(_totals[key], Number(d[key]) || 0)
          console.log('after', _totals[key])
        }
      }
    }

    setTotals(_totals);
    setSourceSchema(_schema);
  }, [schema, editingKey, data])
    
  // iterating the totals to check if any of them has sumUp rule (making sure the rows sums up for total)
  for (let name in totals) {
    const column = columns.find(col => col.dataIndex === name);

    console.log('error', totals[name] !== 0, totals[name], typeof totals[name])
    if (column.sumUp && totals[name] !== 0) { // this one has sum-up rule, and theres values left 
      const className = column.className || '';
      column.className = className + 'error'; // marking the column title (red-color)

      let value = column.formatter ? column.formatter(totals[name]) : totals[name] // using the formatter rule if any
      column.title = `${column.originalTitle} - ${value} left`; // adding some error-feedback in title 
    }
  }

  const components = {
    body: {
      cell: EditableCell,
    },
  };

  const addNew = (schema) => {
    if (!schema) return 

    if (Object.keys(totals).length > 0) {
      const updated = {...totals};
      for (let key in schema) {
        if (updated[key] !== undefined) {
          updated[key] -= schema[key];
        }
      }

      setTotals(updated);
    }

    setData([...data, {...schema, key: index}])
    setIndex(index + 1);
  }
  const tableFooter = () => (
    <button 
      type="button" 
      className="save" 
      onClick={() => {
        // for customization
        if (onRow) onRow(sourceSchema, addNew); 
        else addNew(sourceSchema);
      }}
    >

      {footer || <Icon type="plus"/>}
    </button>
  );

  const provides = {
    form,
    data,
    setData,
    editingKey,
    setEditingKey,
    totals,
    translate,
    setTotals,
  };

  return (
    <EditableContext.Provider value={provides}>
      <Table 
        components={components}
        dataSource={data}
        columns={columns}
        className={"editable-table " + className}
        rowClassName="editable-row"
        size={size}
        footer={tableFooter}
        pagination={{
          onChange: () => setEditingKey('')
        }}
      />
    </EditableContext.Provider>
  )
}
EditableTable.protoTypes = {
  schema: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

export default Form.create()(EditableTable);
