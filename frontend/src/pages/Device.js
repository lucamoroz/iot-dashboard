import React from "react";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Grid, Typography} from "@material-ui/core";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { createMuiTheme } from '@material-ui/core/styles';

const axios = require('axios').default

class Device extends React.Component {
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

    timestampFormat(timestamp) {
        return new Date(Date.parse(timestamp)).toLocaleString();
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
                    tableRow.push(this.timestampFormat(timestamp));

                    let data = res.data[timestamp]
                    for (let i in dataLabels) {
                        let dataLabel = dataLabels[i];
                        let dataValue = data[dataLabel] !== undefined ? data[dataLabel] : 0;

                        tableRow.push(dataValue)
                    }
                    this.state.tableRows.push(tableRow);
                }

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

        axios.get('devices/1')
            .then((resp) => {
                this.setState({
                    deviceStatus: resp.data.deviceStatus,
                    config: resp.data.config,
                })
            })
            .catch((error) => {
                console.log(error.response);

                this.setState({
                    error: true,
                })
            })
    }

    isEnabled() {

        if (this.state.config !== null && this.state.config.enabled === true) {
            return "primary";
        } else {
            return "error"
        }
    }

    render() {
        if (this.state.error) {
            return (
                <span>Error Loading data</span>
            );
        } else {
            return (
                <Grid container spacing={2}>
                    <Grid item key="left" md={6} >
                        <Paper>
                            <Grid container spacing={3}>
                                <Grid item container spacing={2}>
                                    <Grid item md={1} >
                                        <FiberManualRecordIcon color={this.isEnabled()}/>
                                    </Grid>
                                    <Grid item md={3} >
                                        <Typography variant="body1">Battery: {this.state.deviceStatus !== null ? this.state.deviceStatus.battery : ''}</Typography>
                                    </Grid>
                                    <Grid item md={3}>
                                        <Typography variant="body1">Version: {this.state.deviceStatus !== null ? this.state.deviceStatus.version : ''}</Typography>
                                    </Grid>
                                    <Grid item md={5}>
                                        <Typography variant="body1">Last update: {this.state.deviceStatus !== null ? this.timestampFormat(this.state.deviceStatus.last_update) : ''}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1">Update frequency: {this.state.config !== null ? this.state.config.update_frequency : ''}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body1">Token: {this.state.config !== null ? this.state.config.token : ''}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body1">Latitude: {this.state.config !== null ? this.state.config.latitude : ''}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body1">Longitude: {this.state.config !== null ? this.state.config.longitude : ''}</Typography>
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item key="right" md={6} >
                        <Paper>
                            <TableContainer >
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
                                                {tableRow.map((data, index) => (
                                                    <TableCell key={tableRow+data} align={index === 0 ? "left" : "right"}>{data}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                    </Grid>
                </Grid>
            );
        }
    }
}

export default Device