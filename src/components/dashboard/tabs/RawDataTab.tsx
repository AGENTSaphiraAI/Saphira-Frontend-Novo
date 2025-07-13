import React from 'react';
import ReactJson from 'react18-json-view';
import 'react18-json-view/src/style.css';

function RawDataTab() {
  const data = {
    name: "Example",
    value: 123
  };

  return (
    <div>
      <ReactJson src={data} />
    </div>
  );
}

export default RawDataTab;