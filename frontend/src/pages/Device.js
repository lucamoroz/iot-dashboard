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
        margin={{ top: 50, right: 150, bottom: 150, left: 60 }}
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
        enablePointLabel={true}
        pointLabel={"z"}
        useMesh={true}
        legends={[
            {
                anchor: 'right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 10,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 15,
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

                //Infers the graph type from the data types included in the response
                let graphType;
                if (dataLabels.includes("temperature") || dataLabels.includes("pressure")) {
                    //This is a temperature sensor
                    graphType = 1;
                } else {
                    //This is a wind sensor
                    graphType = 2;
                }

                //Makes the array of data for the graph
                let graphData = [];
                for (let i = 0; i < dataLabels.length; i++) {
                    if (dataLabels[i] !== 'windBearing') {
                        let lineData = [];
                        lineData['id'] = this.dataLabelsFormat(dataLabels[i]);
                        lineData['data'] = [];
                        for (let timestamp in res.data) {
                            let data = res.data[timestamp];
                            if (data[dataLabels[i]] !== undefined) {
                                let dataTemp = []
                                dataTemp['x'] = this.timestampFormat(timestamp);
                                dataTemp['y'] = data[dataLabels[i]];
                                if (dataLabels.includes('windBearing')) {
                                    if (data['windBearing'] !== undefined) {
                                        dataTemp['z'] = data['windBearing'] + "°";
                                    } else {
                                        dataTemp['z'] = "";
                                    }
                                }
                                lineData['data'].push(dataTemp);
                            }
                        }
                        graphData.push(lineData);
                    }
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

    /**
     * Formats the labels adding spacing ("camelCase" to "Camel Case") and
     * add measurement units depending on the data type
     * @param dataLabel String representing the raw label
     * @returns {string} String of the formatted label
     */
    dataLabelsFormat(dataLabel) {
        let dataLabelFormatted = dataLabel
            .replace(/([A-Z])/g, ' $1') // insert a space before all caps
            .replace(/^./, function(str){ return str.toUpperCase(); }); // uppercase the first character

        switch (dataLabel) {
            case 'windBearing':
                dataLabelFormatted = dataLabelFormatted + ' (Degrees)';
                break;
            case 'windSpeed':
                dataLabelFormatted = dataLabelFormatted + ' (Km/h)';
                break;
            case 'temperature':
                dataLabelFormatted = dataLabelFormatted + ' (C°)';
                break;
            case 'humidity':
                dataLabelFormatted = dataLabelFormatted + ' (%)';
                break;
            case 'pressure':
                dataLabelFormatted = dataLabelFormatted + ' (kPa)';
                break;
        }
        return dataLabelFormatted;
    }

    render() {
        if (this.state.errorState) {
            return (
                <span>Error Loading data</span>
            );
        } else {
            return (
                <Grid container spacing={2}>
                    <Grid item key="left" md={7} sm={12}>
                        <Grid item xs={12}>
                            <Paper>
                                <Grid item sm={1} xs={12}>
                                    <Typography variant="body1">ID: {this.props.match.params.id}</Typography>
                                </Grid>
                                <Grid item sm={1} xs={12}>
                                    <FiberManualRecordIcon color={this.colorIsEnabled()}/>
                                </Grid>
                                <Grid item sm={3} xs={12}>
                                    <Typography variant="body1">Battery: {this.state.deviceStatus !== null ? this.state.deviceStatus.battery : ''}</Typography>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <div style={{ height: 500 }}>
                                <MyResponsiveLine data={this.state.graphData}/>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                                <TableContainer>
                                    <Table aria-label="simple table">
                                        <TableBody>
                                            <TableRow key="version">
                                                <TableCell key="version_key" align="left">Version</TableCell>
                                                <TableCell key="version_value" align="left">{this.state.deviceStatus !== null ? this.state.deviceStatus.version : ''}</TableCell>
                                            </TableRow>
                                            <TableRow key="last_update">
                                                <TableCell key="last_update_key" align="left">Last update</TableCell>
                                                <TableCell key="last_update_value" align="left">{this.state.deviceStatus !== null ? this.timestampFormat(this.state.deviceStatus.last_update) : ''}</TableCell>
                                            </TableRow>
                                            <TableRow key="update_frequency">
                                                <TableCell key="update_frequency_key" align="left">Update frequency</TableCell>
                                                <TableCell key="update_frequency_value" align="left">{this.state.config !== null ? this.state.config.update_frequency : ''}</TableCell>
                                            </TableRow>
                                            <TableRow key="token">
                                                <TableCell key="token_key" align="left">Token</TableCell>
                                                <TableCell key="token_value" align="left">{this.state.config !== null ? this.state.config.token : ''}</TableCell>
                                            </TableRow>
                                            <TableRow key="latitude">
                                                <TableCell key="latitude_key" align="left">Latitude</TableCell>
                                                <TableCell key="latitude_value" align="left">{this.state.config !== null ? this.state.config.latitude : ''}</TableCell>
                                            </TableRow>
                                            <TableRow key="longitude">
                                                <TableCell key="longitude_key" align="left">Longitude</TableCell>
                                                <TableCell key="longitude_value" align="left">{this.state.config !== null ? this.state.config.longitude : ''}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid item key="right" md={5} sm={12}>
                        <Paper>
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Timestamp</TableCell>
                                            {this.state.dataLabels.map((data) => (
                                                <TableCell key={data}>{this.dataLabelsFormat(data)}</TableCell>
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