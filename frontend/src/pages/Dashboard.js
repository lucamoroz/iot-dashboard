import React from "react";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import { Link as RouterLink } from 'react-router-dom';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
    BatteryAlert,
    Battery20,
    Battery30,
    Battery50,
    Battery60,
    Battery80,
    Battery90,
    BatteryFull
} from "@material-ui/icons";

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
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
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
    );
}

function Battery(props) {
    const percentage = props.percentage
    if (percentage < 20)
        return <BatteryAlert/>
    else if (percentage < 30)
        return <Battery20/>
    else if (percentage < 50)
        return <Battery30/>
    else if (percentage < 60)
        return <Battery50/>
    else if (percentage < 80)
        return <Battery60/>
    else if (percentage < 90)
        return <Battery80/>
    else if (percentage < 95)
        return <Battery90/>
    else
        return <BatteryFull/>
}

function Device (props) {
    const classes = useStyles();
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
                <Battery percentage={deviceStatus["battery"]}/>
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
            <Grid item>
                <IconButton component={RouterLink} to={"/device/"+deviceId}>
                    <SettingsIcon/>
                </IconButton>
            </Grid>
        </Grid>
    )
}

function Dashboard(props) {
    const classes = useStyles();
    const [group, setGroup] = React.useState("");
    const [devices, setDevices] = React.useState([]);
    const [groups, setGroups] = React.useState([])

    React.useEffect(() => {
        // get devices
        const params = {
            includeLastData: true,
        }
        if (group) {
            params["groupId"] = group;
        }
        axios.get("/devices", {params})
            .then(res => {
                setDevices(res.data);
            })

        // get user's groups
        axios.get("/groups")
            .then(res => {
                setGroups(res.data)
            })
    }, [group]);

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id="group-select-label">Group</InputLabel>
                <Select
                    labelId="group-select-label"
                    id="group-select"
                    value={group}
                    onChange={(event) =>
                        setGroup(event.target.value)
                    }
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {
                        groups.map(group =>
                            <MenuItem key={group["id"]} value={group["id"]}>{group["name"]}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
            {
                devices.map(device =>
                    <Device key={device["device"]["id"]} deviceData={device}/>
                )
            }
        </div>
    );
}

export default Dashboard