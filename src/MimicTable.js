import React, { Component } from 'react';
import ReactTable from 'react-table';
import { Row } from 'react-bootstrap';


class MimicTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            columns: [],
        };
        this.update_data();
    }
    // data will be taken from local storage
    update_data() {
        // data is updated with an interval of 1 second
        setInterval(() => {
            if (this.state.columns.length < 1) {
                let columns = JSON.parse(window.localStorage.getItem('data_columns'));
                if (columns) {
                    this.setState({ columns: columns.slice(1, 3) });
                }
            }
            let rows = JSON.parse(window.localStorage.getItem('data_rows'));
            if (rows) {
                this.setState({ rows });
            }
        }, 1000);
    }
    render() {
        return (
            <div className="MimicTable">
                <Row>
                    <ReactTable
                        data={this.state.rows}
                        columns={this.state.columns}
                        showPageJump={false}
                        showPagination={false}
                        defaultPageSize={10}
                        minRows={1}
                    />
                </Row>
            </div>
        );
    }
}

export default MimicTable;
