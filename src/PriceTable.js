import React, { Component } from 'react';
import ReactTable from 'react-table';
import { Button, Row } from 'react-bootstrap';

import 'react-table/react-table.css';

class PriceTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_history: [props.rows], // array in which all the state of rows
            data: props.rows,
            columns: props.columns,
        };
        this.editRow = this.editRow.bind(this);
        this.actionsRow = this.actionsRow.bind(this);
        this.state.columns.forEach(el => {
            // the last column is needed for actions with rows
            if (el !== this.state.columns[this.state.columns.length - 1]) {
                el.Cell = this.editRow;
            } else {
                el.Cell = this.actionsRow;
            }
        });
    }
    // allows you to edit an important cell
    editRow(cellInfo) {
        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.data];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({ data });
                    this.state.data_history.push(data);
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.data[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }
    // contains actions with row (remove, etc)
    actionsRow(cellInfo) {
        return (
            <Button bsStyle="danger" onClick={() => {
                const data = [...this.state.data];
                data.splice(cellInfo.index, 1);
                this.setState({ data });
                this.state.data_history.push(data);
            }}>REMOVE</Button>
        );
    }
    render() {
        return (
            <div className="PriceTable">
                <ReactTable
                    data={this.state.data}
                    columns={this.state.columns}
                    showPageJump={false}
                    showPagination={false}
                    defaultPageSize={10}
                    minRows={2}
                />
                <Row>
                    <Button bsStyle="link" onClick={() => {
                        const data = [...this.state.data];
                        data.push({ item: '', cost: '' });
                        this.setState({ data });
                        this.state.data_history.push(data);
                    }}>Add new row</Button>
                </Row>
                <Row>
                    <Button bsStyle="primary" onClick={() => {
                        console.log(this.state.data_history);

                    }}>Undo</Button>
                    <Button bsStyle="primary" onClick={() => {
                        console.log(this.state.data_history);

                    }}>Redo</Button>
                </Row>
            </div>
        );
    }
}

export default PriceTable;
