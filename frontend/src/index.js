import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from "react-router-dom";

const axios = require('axios').default
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8080'

ReactDOM.render(
    <Router>
        <App /> {/* BrowserRouter accepts only a single child element - i.e. App - so the composition is done in App */}
    </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
