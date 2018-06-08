import React, { Component } from 'react';
import PriceTable from './PriceTable.js';

class App extends Component {
  render() {
    const columns = [{
      Header: 'Choice',
      accessor: 'choice',
    }, {
      Header: 'Item',
      accessor: 'item',
    }, {
      Header: 'Cost per lb/kg',
      accessor: 'cost',
    }, {
      Header: 'Actions',
      accessor: 'actions',
    }];
    const rows = [{
      item: 'Apples',
      cost: '$20'
    }, {
      item: 'Oranges',
      cost: '$30',
    }];
    return (
      <div className="App">
        <PriceTable
          columns={columns}
          rows={rows}
        />
      </div>
    );
  }
}

export default App;
