import React from "react";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from "@material-ui/core/styles";

const axios = require('axios').default

const useStyles = makeStyles((theme) => ({
    container: {
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gridGap: `${theme.spacing(3)}px`
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap",
        marginBottom: theme.spacing(2),
        marginRight: theme.spacing(1),
    },
    divider: {
        margin: `${theme.spacing(2)}px 0`
    }
}));

function DeviceEnabledIndicator(props) {
    if (props.enabled) {
        return (
            <div>On</div>
        )
    } else {
        return (
            <div>Off</div>
        )
    }
}

function DeviceData(props) {
    const classes = useStyles();
    return (
        <Grid item>
            <Paper className={classes.paper}>{props.dataType}: {props.value}</Paper>
        </Grid>
    )
}

function DeviceGroups(props) {
    const classes = useStyles();
    return (
        <Grid item>
            <Paper className={classes.paper}>{props.groupName}</Paper>
        </Grid>
    )
}

function Device (props) {
    const classes = useStyles();
    console.log(props.deviceData);
    const deviceId = props.deviceData["device"]["id"];
    const deviceData = props.deviceData["data"];
    const deviceConfig = props.deviceData["device"]["config"];
    const deviceStatus = props.deviceData["device"]["deviceStatus"];
    const productName = props.deviceData["product_name"];
    const groups = props.deviceData["groups"];
    return (
        <Grid container>
            <Grid item>
                <Paper className={classes.paper}>
                    <DeviceEnabledIndicator enabled={deviceConfig["enabled"]}/>
                </Paper>
            </Grid>
            <Grid item>
                <Paper className={classes.paper}>ID: {deviceId}</Paper>
            </Grid>
            {
                groups.map(group =>
                    <DeviceGroups key={group["id"]} groupName={group["name"]}/>
                )
            }
            <Grid item>
                <Paper className={classes.paper}>{productName}</Paper>
            </Grid>
            {
                Object.keys(deviceData).map(key =>
                    <DeviceData key={key} dataType={key} value={deviceData[key]}/>
                )
            }
        </Grid>
    )
}

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            devices: []
        }
    }

    componentDidMount() {
        const params = {
            includeLastData: true
        }
        axios.get("/devices", {params})
            .then(res => {
                const devices = res.data
                this.setState({
                    devices: devices.map(device =>
                        <Device key={device["device"]["id"]} deviceData={device}/>
                    )
                })
            })
    }

    render() {
        return (
            <div>
                {this.state.devices}
            </div>
        );
    }
}

export default Dashboard