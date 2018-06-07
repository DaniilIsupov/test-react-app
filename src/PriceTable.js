import React, { Component } from 'react';
import ReactTable from 'react-table';
import { Button, Row } from 'react-bootstrap';

import 'react-table/react-table.css';

class PriceTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            past_data: [],
            present_data: props.rows,
            future_data: [],
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
                    const present_data = JSON.parse(JSON.stringify(this.state.present_data)); // such a JSON bunch we will use to make a DeepCopy
                    present_data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.change_state(present_data);
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.present_data[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }
    // contains actions with row (remove, etc)
    actionsRow(cellInfo) {
        return (
            <Button bsStyle="danger" onClick={() => {
                const present_data = JSON.parse(JSON.stringify(this.state.present_data));
                present_data.splice(cellInfo.index, 1);
                this.change_state(present_data);
            }}>REMOVE</Button>
        );
    }
    // when any changes need to remember the old state and clear the future state
    change_state(new_state) {
        const past_data = JSON.parse(JSON.stringify(this.state.past_data));
        past_data.push(JSON.parse(JSON.stringify(this.state.present_data)));

        this.setState({ past_data: past_data, present_data: new_state, future_data: [] });
    }
    render() {
        return (
            <div className="PriceTable">
                <ReactTable
                    data={this.state.present_data}
                    columns={this.state.columns}
                    showPageJump={false}
                    showPagination={false}
                    defaultPageSize={10}
                    minRows={this.props.rows.length}
                />
                <Row>
                    <Button bsStyle="link" onClick={() => {
                        const present_data = JSON.parse(JSON.stringify(this.state.present_data));
                        present_data.push({ item: '', cost: '' });
                        this.change_state(present_data);
                    }}>Add new row</Button>
                </Row>
                <Row>
                    <Button bsStyle="primary" onClick={() => {
                        if (this.state.past_data.length > 0) {
                            const { past_data, present_data, future_data } = JSON.parse(JSON.stringify(this.state));

                            const previous = past_data[past_data.length - 1];
                            const new_past = past_data.splice(past_data.length - 1, 1);
                            future_data.unshift(present_data);
                            this.setState({ past_data: new_past, present_data: previous, future_data: future_data });
                        }
                    }}>Undo</Button>
                    <Button bsStyle="primary" onClick={() => {
                        if (this.state.future_data.length > 0) {
                            const { past_data, present_data, future_data } = JSON.parse(JSON.stringify(this.state));

                            const next = future_data[0];
                            const new_future = future_data.splice(0, 1);
                            past_data.push(present_data);
                            this.setState({ past_data: past_data, present_data: next, future_data: new_future });
                        }
                    }}>Redo</Button>
                </Row>
            </div>
        );
    }
}

export default PriceTable;
