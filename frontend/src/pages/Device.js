import React from "react";
import { Redirect } from "react-router";

//Material IU imports
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Grid, Typography} from "@material-ui/core";
import { green, red } from '@material-ui/core/colors';
import PowerIcon from '@material-ui/icons/Power';
import PowerOffIcon from '@material-ui/icons/PowerOff';
import SettingsIcon from "@material-ui/icons/Settings";
import IconButton from "@material-ui/core/IconButton";

//Nivo imports
import { ResponsiveLine } from '@nivo/line'
import {Link as RouterLink} from "react-router-dom";


const axios = require('axios').default


//***** UTILS FUNCTIONS *****//

/**
 * Takes care of the Timestamp formatting
 * @param timestamp Timestamp is the string received by the remote requests
 * @returns {string} String formatted in the proper way
 */
function timestampFormat(timestamp) {
    return new Date(Date.parse(timestamp)).toLocaleString();
}

/**
 * Formats the labels adding spacing ("camelCase" to "Camel Case") and
 * add measurement units depending on the data type
 * @param dataLabel String representing the raw label
 * @returns {string} String of the formatted label
 */
function dataLabelsFormat(dataLabel) {
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
        default:
            break;
    }
    return dataLabelFormatted;
}

/**
 * Takes care of the wind bearing formatting
 * @param windBearing Raw data of the wind bearing
 * @returns {string} Formatted data of the wind bearing
 */
function windBearingFormat(windBearing) {
    switch (true) {
        case (11.25 <= windBearing && windBearing < 33.75): return 'NNE';
        case (33.75 <= windBearing && windBearing < 56.25): return 'NE';
        case (56.25 <= windBearing && windBearing < 78.75): return 'ENE';
        case (78.75 <= windBearing && windBearing < 101.25): return 'E';
        case (101.25 <= windBearing && windBearing < 123.75): return 'ESE';
        case (123.75 <= windBearing && windBearing < 146.25): return 'SE';
        case (146.25 <= windBearing && windBearing < 168.75): return 'SSE';
        case (168.75 <= windBearing && windBearing < 191.25): return 'S';
        case (191.25 <= windBearing && windBearing < 213.75): return 'SSW';
        case (213.75 <= windBearing && windBearing < 236.25): return 'SW';
        case (236.25 <= windBearing && windBearing < 258.75): return 'WSW';
        case (258.75 <= windBearing && windBearing < 281.25): return 'W';
        case (281.25 <= windBearing && windBearing < 303.75): return 'WNW';
        case (303.75 <= windBearing && windBearing < 326.25): return 'NW';
        case (326.25 <= windBearing && windBearing < 348.75): return 'NNW';
        case (348.75 <= windBearing && windBearing < 11.25): return 'N';
        default: return '';
    }
}

//***** REACT COMPONENTS *****//

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

function DeviceEnabledIndicator(props) {
    if (props.enabled) {
        return (
            <PowerIcon style={{color: green[500]}}/>
        )
    } else {
        return (
            <PowerOffIcon style={{color: red[500]}}/>
        )
    }
}

function DeviceTable(props) {
    return (
        <TableContainer>
            <Table aria-label="simple table">
                <TableBody>
                    <TableRow key="id">
                        <TableCell key="id_key" align="left">ID</TableCell>
                        <TableCell key="id_value" align="left">{props.id}</TableCell>
                    </TableRow>
                    <TableRow key="status">
                        <TableCell key="status_key" align="left">Status</TableCell>
                        <TableCell key="status_value" align="left">
                            <DeviceEnabledIndicator enabled={props.config !== null ? props.config.enabled : true}/>
                        </TableCell>
                    </TableRow>
                    <TableRow key="battery">
                        <TableCell key="battery_key" align="left">Battery</TableCell>
                        <TableCell key="battery_value" align="left">{props.deviceStatus !== null ? props.deviceStatus.battery : ''}%</TableCell>
                    </TableRow>
                    <TableRow key="version">
                        <TableCell key="version_key" align="left">Version</TableCell>
                        <TableCell key="version_value" align="left">{props.deviceStatus !== null ? props.deviceStatus.version : ''}</TableCell>
                    </TableRow>
                    <TableRow key="last_update">
                        <TableCell key="last_update_key" align="left">Last update</TableCell>
                        <TableCell key="last_update_value" align="left">{props.deviceStatus !== null ? timestampFormat(props.deviceStatus.last_update) : ''}</TableCell>
                    </TableRow>
                    <TableRow key="update_frequency">
                        <TableCell key="update_frequency_key" align="left">Update frequency</TableCell>
                        <TableCell key="update_frequency_value" align="left">{props.config !== null ? props.config.update_frequency : ''}</TableCell>
                    </TableRow>
                    <TableRow key="token">
                        <TableCell key="token_key" align="left">Token</TableCell>
                        <TableCell key="token_value" align="left">{props.config !== null ? props.config.token : ''}</TableCell>
                    </TableRow>
                    <TableRow key="latitude">
                        <TableCell key="latitude_key" align="left">Latitude</TableCell>
                        <TableCell key="latitude_value" align="left">{props.config !== null ? props.config.latitude : ''}</TableCell>
                    </TableRow>
                    <TableRow key="longitude">
                        <TableCell key="longitude_key" align="left">Longitude</TableCell>
                        <TableCell key="longitude_value" align="left">{props.config !== null ? props.config.longitude : ''}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function DataTable(props) {
    return (
        <TableContainer>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Timestamp</TableCell>
                        {props.dataLabels.map((data) => (
                            <TableCell key={data}>{dataLabelsFormat(data)}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(props.tableRows.length === 0) ? <TableRow key="noData"><TableCell key="noDataCell">No data</TableCell></TableRow> : null}
                    {props.tableRows.map((tableRow) => (
                        <TableRow key={tableRow[0]}>
                            {tableRow.map((data, index) => (
                                <TableCell key={tableRow+data} align={index === 0 ? "left" : "right"}>{data}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function Graph(props) {
    if (props.graphData.length !== 0) {
        return (
            <div style={{ height: 500 }}>
                <MyResponsiveLine data={props.graphData}/>
            </div>
        );
    } else {
        return (
            <></>
        )
    }
}


class Device extends React.Component {
    constructor(props) {
        super(props);

        //This variable is used to check if the component is unmounted
        this._isMounted = false;

        this.state = {
            errorState: false,
            error: null,
            dataLabels: [],
            tableRows: [],
            deviceStatus: null,
            config: null,
            graphData: [],
        };

        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

        this.loadData();

        setInterval(this.loadData, 3000);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * Takes care of the data retrival from the API.
     * This is the function called after the Component is called where React advice to make remote calls.
     */
    loadData() {
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
                this.state.tableRows = [];
                for (let timestamp in res.data) {
                    let tableRow = [];
                    tableRow.push(timestampFormat(timestamp));

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
                        lineData['id'] = dataLabelsFormat(dataLabels[i]);
                        lineData['data'] = [];
                        for (let timestamp in res.data) {
                            let data = res.data[timestamp];
                            if (data[dataLabels[i]] !== undefined) {
                                let dataTemp = []
                                dataTemp['x'] = timestampFormat(timestamp);
                                dataTemp['y'] = data[dataLabels[i]];
                                if (dataLabels.includes('windBearing')) {
                                    if (data['windBearing'] !== undefined) {
                                        dataTemp['z'] = windBearingFormat(data['windBearing']);
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
                this._isMounted && this.setState({
                    errorState: true,
                    error: error,
                })
            });

        //Gets device config and status from the API
        axios.get('devices/'+this.props.match.params.id)
            .then((resp) => {
                //Request received correctly

                //Sets deviceStatus and config in the State
                this.setState({
                    deviceStatus: resp.data.device.deviceStatus,
                    config: resp.data.device.config,
                })
            })
            .catch((error) => {
                //Sets error state
                this._isMounted && this.setState({
                    errorState: true,
                    error: error,
                })
            })
    }

    render() {
        if (this.state.errorState) {
            let errorCode = this.state.error.response.data.errorCode;

            if (errorCode === "EDEV1" || errorCode === "ESDA2") {
                return (<Redirect to="/dashboard" />);
            } else if (errorCode === "EAUT2") {
                return (<Redirect to="/signin" />);
            }

            return (<></>);
        } else {
            return (
                <Grid container spacing={2}>
                    <Grid item xs={12} container>
                        <Typography variant={"h4"}>Device</Typography>
                        <IconButton component={RouterLink} to={"/dashboard/device/"+this.props.match.params.id+"/config"}>
                            <SettingsIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item key="left" md={7} sm={12}>
                        <Grid item xs={12}>
                            <Graph graphData={this.state.graphData}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                                <DeviceTable id={this.props.match.params.id} config={this.state.config} deviceStatus={this.state.deviceStatus}/>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid item key="right" md={5} sm={12}>
                        <Paper>
                            <DataTable dataLabels={this.state.dataLabels} tableRows={this.state.tableRows}/>
                        </Paper>
                    </Grid>
                </Grid>
            );
        }
    }
}

export default Device