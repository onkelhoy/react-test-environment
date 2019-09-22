import React, { useState } from 'react';
import './styles.scss';

const ModdelingPage = (props) => {
  const [visible, setVisible] = useState(false);

  return (
    <React.Fragment>
      <div className="moddeling">
        <header>
          <h2>Ventury Analytics</h2>
        </header>
        <main className={visible ? "blurred" : ""}>
          <div className="node add">
            last round
          </div>

          <button onClick={() => setVisible(true)}>
            add something
          </button>
        </main>

      </div>
      <div className={"popup " + (visible ? "show" : "hide")}>
        <h1>this is the general form</h1>
      </div>
    </React.Fragment>
  )
}

export default ModdelingPage;