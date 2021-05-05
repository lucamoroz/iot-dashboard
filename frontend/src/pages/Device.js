import React from "react";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Grid} from "@material-ui/core";

const axios = require('axios').default

class Device extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            dataLabels: [],
            tableRows: [],
        };
    }

    componentDidMount() {
        axios.get('/devices/1/data')
            .then((res) => {
                //Calculates the maximum number of different type of data types and the relative data
                let maxSize = 0;
                let maxData;
                for (let timestamp in res.data) {
                    let data = res.data[timestamp]
                    let size = Object.keys(data).length;
                    if (size > maxSize) {
                        maxSize = size;
                        maxData = data;
                    }
                }

                let dataLabels = new Array(0);
                for (let dataLabel in maxData) {
                    dataLabels.push(dataLabel);
                }


                for (let timestamp in res.data) {
                    let tableRow = [];
                    tableRow.push(timestamp);

                    let data = res.data[timestamp]
                    for (let i in dataLabels) {
                        let dataLabel = dataLabels[i];
                        let dataValue = data[dataLabel] !== undefined ? data[dataLabel] : 0;

                        tableRow.push(dataValue)
                    }
                    this.state.tableRows.push(tableRow);
                }
                console.log(this.state.tableRows);

                console.log("Constructor " + dataLabels);
                dataLabels.forEach((data) => {
                    console.log(data);
                })

                this.setState({
                    dataLabels: dataLabels,
                })
            })
            .catch((error) => {
                console.log(error.response);

                this.setState({
                    error: true,
                })
            });
    }

    render() {
        if (this.state.error) {
            return (
                <span>Error Loading data</span>
            );
        } else {
            return (
                <Grid container>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Timestamp</TableCell>
                                    {this.state.dataLabels.map((data) => (
                                        <TableCell key={data}>{data.charAt(0).toUpperCase() + data.slice(1)}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.tableRows.map((tableRow) => (
                                    <TableRow key={tableRow[0]}>
                                        {tableRow.map((data) => (
                                            <TableCell align="right">{data}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            );
        }
    }
}

export default Device