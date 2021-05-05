import React from "react";


const axios = require('axios').default

class ShopCart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            dataLabels: [],
            tableRows: [],
            deviceStatus: null,
            config: null,
        };
    }
}