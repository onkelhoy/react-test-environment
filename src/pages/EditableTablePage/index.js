import React, { useState } from 'react';
import EditableTable from 'components/EditableTable'
import { 
  skalarInput, 
  skalarParser, 
  percentInput, 
  percentParser,
} from 'util/constants';


const EditableTablePage = props => {
  const [data, setData] = useState([
    {
      age: 50,
      name: 'Erik',
      percent: 1,
      world: 'hmmm'
    },
  ]);

  const schema = [
    {
      name: 'name',
      default: 'Bob Ross',
    },
    {
      name: 'age',
      type: 'number',
      min: 0,
      max: 120,
      formatter: skalarInput,
      parser: skalarParser,
    },
    {
      name: 'percent',
      type: 'number',
      min: 0,
      max: 1,
      step: 0.01,
      total: true,
      sumUp: true,
      formatter: percentInput,
      parser: percentParser,
    }
  ];

  
  return (
    <React.Fragment>
      <EditableTable schema={schema} data={data} setData={setData} />
    </React.Fragment>
  )
}

export default EditableTablePage;