import React, { Component, createContext, } from 'react';
import Tree from 'components/Tree/test';
import './styles.scss';

const Context = createContext();
class ModdelingPage extends Component {
  state = {
    visible: false,
  };

  constructor (props) {
    super(props);

    this.container = React.createRef();
  }

  render () {
    const { visible, } = this.state;

    const treeData = {
      name: 'root',
      children: [
        {
          name: 'a',
          children: [
            { name: 'd', },
            { name: 'e', },
            { name: 'f', },
          ]
        },
        { name: 'b', },
        { name: 'c', },
      ],
    };

    const provides = {
      treeData,
      visible,
      container: this.container,
    }

    return (
      <>
      <div className="moddeling">
        <header>
          <h2>Ventury Analytics</h2>
        </header>
        <main ref={this.container} className={visible ? "blurred" : ""}>
          <Context.Provider value={provides}>
          
            <Tree treeData={treeData} Context={Context} />  
          </Context.Provider>
        </main>

      </div>
      <div className={"popup " + (visible ? "show" : "hide")}>
        <h1>this is the general form</h1>
      </div>
      </>
    );
  }
}

export { Context };
export default ModdelingPage;