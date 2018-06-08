import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'react-table/react-table.css';
import App from './App';
import MimicTable from './MimicTable';
import { BrowserRouter as Router, Route } from "react-router-dom";

ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={App} />
            <Route path="/mimic" component={MimicTable} />
        </div>
    </Router>,
    document.getElementById('root')
)
