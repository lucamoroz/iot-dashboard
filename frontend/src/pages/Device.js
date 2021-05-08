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
            tickRotation: 0,
            legend: 'transportation',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'count',
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


class Device extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorState: false,
            dataLabels: [],
            tableRows: [],
            deviceStatus: null,
            config: null,
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
            return "error"
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

        const datas = [
            {
                "id": "japan",
                "color": "hsl(288, 70%, 50%)",
                "data": [
                    {
                        "x": "plane",
                        "y": 124
                    },
                    {
                        "x": "helicopter",
                        "y": 200
                    },
                    {
                        "x": "boat",
                        "y": 71
                    },
                    {
                        "x": "train",
                        "y": 94
                    },
                    {
                        "x": "subway",
                        "y": 15
                    },
                    {
                        "x": "bus",
                        "y": 242
                    },
                    {
                        "x": "car",
                        "y": 186
                    },
                    {
                        "x": "moto",
                        "y": 125
                    },
                    {
                        "x": "bicycle",
                        "y": 257
                    },
                    {
                        "x": "horse",
                        "y": 72
                    },
                    {
                        "x": "skateboard",
                        "y": 180
                    },
                    {
                        "x": "others",
                        "y": 258
                    }
                ]
            },
            {
                "id": "france",
                "color": "hsl(151, 70%, 50%)",
                "data": [
                    {
                        "x": "plane",
                        "y": 17
                    },
                    {
                        "x": "helicopter",
                        "y": 116
                    },
                    {
                        "x": "boat",
                        "y": 112
                    },
                    {
                        "x": "train",
                        "y": 201
                    },
                    {
                        "x": "subway",
                        "y": 164
                    },
                    {
                        "x": "bus",
                        "y": 140
                    },
                    {
                        "x": "car",
                        "y": 113
                    },
                    {
                        "x": "moto",
                        "y": 248
                    },
                    {
                        "x": "bicycle",
                        "y": 10
                    },
                    {
                        "x": "horse",
                        "y": 95
                    },
                    {
                        "x": "skateboard",
                        "y": 268
                    },
                    {
                        "x": "others",
                        "y": 275
                    }
                ]
            },
            {
                "id": "us",
                "color": "hsl(259, 70%, 50%)",
                "data": [
                    {
                        "x": "plane",
                        "y": 278
                    },
                    {
                        "x": "helicopter",
                        "y": 215
                    },
                    {
                        "x": "boat",
                        "y": 283
                    },
                    {
                        "x": "train",
                        "y": 224
                    },
                    {
                        "x": "subway",
                        "y": 42
                    },
                    {
                        "x": "bus",
                        "y": 271
                    },
                    {
                        "x": "car",
                        "y": 249
                    },
                    {
                        "x": "moto",
                        "y": 158
                    },
                    {
                        "x": "bicycle",
                        "y": 6
                    },
                    {
                        "x": "horse",
                        "y": 113
                    },
                    {
                        "x": "skateboard",
                        "y": 129
                    },
                    {
                        "x": "others",
                        "y": 89
                    }
                ]
            },
            {
                "id": "germany",
                "color": "hsl(42, 70%, 50%)",
                "data": [
                    {
                        "x": "plane",
                        "y": 133
                    },
                    {
                        "x": "helicopter",
                        "y": 290
                    },
                    {
                        "x": "boat",
                        "y": 102
                    },
                    {
                        "x": "train",
                        "y": 79
                    },
                    {
                        "x": "subway",
                        "y": 257
                    },
                    {
                        "x": "bus",
                        "y": 78
                    },
                    {
                        "x": "car",
                        "y": 261
                    },
                    {
                        "x": "moto",
                        "y": 113
                    },
                    {
                        "x": "bicycle",
                        "y": 251
                    },
                    {
                        "x": "horse",
                        "y": 260
                    },
                    {
                        "x": "skateboard",
                        "y": 61
                    },
                    {
                        "x": "others",
                        "y": 4
                    }
                ]
            },
            {
                "id": "norway",
                "color": "hsl(60, 70%, 50%)",
                "data": [
                    {
                        "x": "plane",
                        "y": 181
                    },
                    {
                        "x": "helicopter",
                        "y": 160
                    },
                    {
                        "x": "boat",
                        "y": 78
                    },
                    {
                        "x": "train",
                        "y": 183
                    },
                    {
                        "x": "subway",
                        "y": 43
                    },
                    {
                        "x": "bus",
                        "y": 180
                    },
                    {
                        "x": "car",
                        "y": 114
                    },
                    {
                        "x": "moto",
                        "y": 47
                    },
                    {
                        "x": "bicycle",
                        "y": 259
                    },
                    {
                        "x": "horse",
                        "y": 146
                    },
                    {
                        "x": "skateboard",
                        "y": 161
                    },
                    {
                        "x": "others",
                        "y": 124
                    }
                ]
            }
        ]

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
                                <MyResponsiveLine data={datas}/>
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