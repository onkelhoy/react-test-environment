import React, { useContext } from 'react';
import { Popconfirm } from 'antd';

import EditableContext from './context';
import { SafeAddition, SafeSubtraction } from 'util/constants';


const Operations = props => {
  const { 
    setEditingKey, 
    editingKey, 
    data, 
    setData, 
    form, 
    totals, 
    setTotals,
    translate,
  } = useContext(EditableContext);

  const {record: { key }, index} = props;

  const editable = editingKey === key;

  const deleteRow = () => {
    const newSource = [...data]
    const item = newSource[index];
    
    for (let key in item) {
      if (totals[key] !== undefined) {
        const newTotals = {...totals};
        newTotals[key] = SafeAddition(totals[key], item[key]);

        setTotals(newTotals);
      }
    }
    
    newSource.splice(index, 1);
    setData(newSource);
    setEditingKey('');
  }

  const save = () => {
    
    form.validateFields((error, row) => {
      if (error) {
        return;
      }

      const newSource = [...data];
      const index = newSource.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newSource[index];
        newSource.splice(index, 1, {
          ...item,
          ...row,
        });
      } else {
        newSource.push(row);
      }

      for (let col in row) {
        if (totals[col] !== undefined) {
          // now we need to update the totals
          let value = Number(row[col])
          if (index > -1) {
            // since its an edit : we need to know if the value went up or down 
            const old = data[index][col];
            value -= old; // new - old -> up/down value 
          }

          console.log('new value', value)

          const newTotals = {...totals};
          newTotals[col] = SafeSubtraction(newTotals[col], value);
          console.log('new totals', newTotals[col])

          setTotals(newTotals);
        }
      }

      setData(newSource);
      setEditingKey('');
    });
  }

  return editable ? (
    <span>
      <button
        type="button"
        className="btn-link"
        onClick={save}
      >

        save
      </button>
      <Popconfirm 
        title={'are you sure?'}
        okText={'yes'}
        cancelText={'no'}
        onConfirm={() => setEditingKey('')}
      >

        <button className="btn-link" type="button">
          cancel
        </button>
      </Popconfirm>
    </span>
  ) : (
    <span>
      <button type="button" className="btn-link" disabled={editingKey !== ''} onClick={() => setEditingKey(key)}>
        edit
      </button>
      <button type="button" className="btn-link" disabled={editingKey !== ''} onClick={deleteRow}>
        delete
      </button>
    </span>
  )
}

export default Operations;