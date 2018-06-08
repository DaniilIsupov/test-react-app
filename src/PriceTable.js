import React, { Component } from 'react';
import ReactTable from 'react-table';
import { Button, Row, Col, Checkbox } from 'react-bootstrap';

class PriceTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            past_data: [],
            present_data: props.rows,
            future_data: [],
            columns: props.columns,
            saved_rows: [],
            saved_columns: JSON.parse(JSON.stringify(props.columns)),
            checked: []
        };
        window.localStorage.setItem('data_columns', JSON.stringify(props.columns));
        this.editRow = this.editRow.bind(this);
        this.actionsRow = this.actionsRow.bind(this);
        this.choiceRow = this.choiceRow.bind(this);
        this.state.columns.forEach(el => {
            switch (el) {
                // the last column to delete rows
                case this.state.columns[this.state.columns.length - 1]:
                    el.Cell = this.actionsRow;
                    break;
                // the first column to checkbox (choice row)
                case this.state.columns[0]:
                    el.Cell = this.choiceRow;
                    break;
                // all other columns are highlighted for formatting content
                default:
                    el.Cell = this.editRow;
                    break;
            }
        });
        this.state.saved_columns = this.state.saved_columns.slice(1, this.state.saved_columns.length - 1);
        // this.state.saved_columns.splice(0, 1);
    }
    // allows you to edit an important cell
    editRow(cellInfo) {
        return (
            <div
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
    // checkbox column
    choiceRow(cellInfo) {
        return (
            <Checkbox
                inline
                onClick={({ target }) => {
                    // for convenience we will store in the associative array the selected rows
                    if (target.checked) {
                        this.state.checked[`${cellInfo.index}`] = true;
                    } else {
                        this.state.checked[`${cellInfo.index}`] = false;
                    }
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
                <Row>
                    <Col md={6}>
                        <ReactTable
                            data={this.state.present_data}
                            columns={this.state.columns}
                            showPageJump={false}
                            showPagination={false}
                            defaultPageSize={10}
                            minRows={1}
                        />
                        <Row>
                            <Button bsStyle="link" onClick={() => {
                                const present_data = JSON.parse(JSON.stringify(this.state.present_data));
                                present_data.push({ item: '', cost: '' });
                                this.change_state(present_data);
                            }}>Add new row</Button>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Button
                                    bsStyle="primary"
                                    disabled={this.state.past_data.length < 1}
                                    block
                                    onClick={() => {
                                        if (this.state.past_data.length > 0) {
                                            const { past_data, present_data, future_data } = JSON.parse(JSON.stringify(this.state));

                                            const previous = past_data[past_data.length - 1];
                                            const new_past = past_data.splice(past_data.length - 1, 1);
                                            future_data.unshift(present_data);
                                            this.setState({ past_data: new_past, present_data: previous, future_data: future_data });
                                        }
                                    }}>Undo</Button>
                            </Col>
                            <Col md={6}>
                                <Button
                                    bsStyle="primary"
                                    disabled={this.state.future_data.length < 1}
                                    block
                                    onClick={() => {
                                        if (this.state.future_data.length > 0) {
                                            const { past_data, present_data, future_data } = JSON.parse(JSON.stringify(this.state));

                                            const next = future_data[0];
                                            const new_future = future_data.splice(0, 1);
                                            past_data.push(present_data);
                                            this.setState({ past_data: past_data, present_data: next, future_data: new_future });
                                        }
                                    }}>Redo</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6}>
                        <Row>
                            <ReactTable
                                data={this.state.saved_rows}
                                columns={this.state.saved_columns}
                                showPageJump={false}
                                showPagination={false}
                                defaultPageSize={10}
                                minRows={1}
                            />
                        </Row>
                        <Row>
                            <Button bsStyle="link" onClick={() => {
                                const saved_rows = JSON.parse(JSON.stringify(this.state.saved_rows));
                                // rows are transferred to another page via local storage when the table is rebuilt
                                window.localStorage.setItem('data_rows', JSON.stringify(saved_rows));
                                this.setState({ saved_rows });
                            }}>Rebuild Table</Button>
                            <Button bsStyle="link" onClick={() => {
                                this.state.saved_rows = []; //delete the old save
                                const present_data = JSON.parse(JSON.stringify(this.state.present_data));
                                this.state.checked.forEach((element, index) => {
                                    // if the item is selected then save it
                                    if (element) {
                                        this.state.saved_rows.push(present_data[index]);
                                    }
                                });
                            }}>Save Table</Button>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default PriceTable;
