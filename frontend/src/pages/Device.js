import React from "react";

//Material IU imports
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Grid, Typography} from "@material-ui/core";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

//Nivo imports
import { ResponsiveLine } from '@nivo/line'

const axios = require('axios').default


const MyResponsiveLine = ({ data }) => (
    <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 90,
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Value',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
)

const Graph = (props) => {
    if (props.graphType === 1) {
        return (
            <MyResponsiveLine data={props.graphData}/>
        )
    } else {
        //TODO
        return (
            <span>BOH</span>
        )
    }
}


class Device extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorState: false,
            dataLabels: [],
            tableRows: [],
            deviceStatus: null,
            config: null,
            graphData: [],
        };
    }

    /**
     * Takes care of the data retrival from the API.
     * This is the function called after the Component is called where React advice to make remote calls.
     */
    componentDidMount() {
        //Gets device data from the API
        axios.get('/devices/'+this.props.match.params.id+'/data')
            .then((res) => {
                //Request received correctly

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

                //Creates an array of data labels to be used in the table
                let dataLabels = new Array(0);
                for (let dataLabel in maxData) {
                    dataLabels.push(dataLabel);
                }

                //Sets the dataLabels in the State
                this.setState({
                    dataLabels: dataLabels,
                })

                //Creates the rows for the table
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

                let graphType;
                if (dataLabels.includes("temperature") || dataLabels.includes("pressure")) {
                    //This is a temperature sensor
                    graphType = 1;
                } else {
                    //This is a wind sensor
                    graphType = 2;
                }

                let graphData = [];
                for (let i = 0; i < dataLabels.length; i++) {
                    let lineData = [];
                    lineData['id'] = dataLabels[i];
                    lineData['data'] = [];
                    for (let timestamp in res.data) {
                        let data = res.data[timestamp];
                        if (data[dataLabels[i]] !== undefined) {
                            let dataTemp = []
                            dataTemp['x'] = this.timestampFormat(timestamp);
                            dataTemp['y'] = data[dataLabels[i]];
                            lineData['data'].push(dataTemp);
                        }
                    }
                    graphData.push(lineData);
                }

                this.setState({
                    graphData: graphData,
                    graphType: graphType,
                })
            })
            .catch((error) => {
                //Sets error state
                this.setState({
                    errorState: true,
                })
            });

        //Gets device config and status from the API
        axios.get('devices/'+this.props.match.params.id)
            .then((resp) => {
                //Request received correctly

                //Sets deviceStatus and config in the State
                this.setState({
                    deviceStatus: resp.data.deviceStatus,
                    config: resp.data.config,
                })
            })
            .catch((error) => {
                //Sets error state
                this.setState({
                    errorState: true,
                })
            })
    }

    /**
     * This function takes care of the proper color for the enabled/disabled dot for the device
     * @returns {string} indicating the color text for the right device status (enabled/disabled)
     */
    colorIsEnabled() {
        if (this.state.config !== null && this.state.config.enabled === true) {
            return "primary";
        } else {
            return "error";
        }
    }

    /**
     * Takes care of the Timestamp formatting
     * @param timestamp Timestamp is the string received by the remote requests
     * @returns {string} String formatted in the proper way
     */
    timestampFormat(timestamp) {
        return new Date(Date.parse(timestamp)).toLocaleString();
    }

    render() {
        if (this.state.errorState) {
            return (
                <span>Error Loading data</span>
            );
        } else {
            return (
                <Grid container spacing={2}>
                    <Grid item key="left" md={6} >
                        <Grid item md={12}>
                            <div style={{ height: 500 }}>
                                <Graph graphData={this.state.graphData} graphType={this.state.graphType}/>
                            </div>
                        </Grid>
                        <Grid item md={12}>
                            <Paper>
                                <Grid container>
                                    <Grid item container>
                                        <Grid item md={1} >
                                            <FiberManualRecordIcon color={this.colorIsEnabled()}/>
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
                                    <Grid item container>
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

                    </Grid>
                    <Grid item key="right" md={6} >
                        <Paper>
                            <TableContainer>
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