import React from "react";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import PowerIcon from '@material-ui/icons/Power';
import PowerOffIcon from '@material-ui/icons/PowerOff';
import { green, red } from '@material-ui/core/colors';
import { Link as RouterLink } from 'react-router-dom';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
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
    dashboard: {
        marginLeft: 10,
        marginRight: 10
    },
    deviceContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)"
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap",
        margin: theme.spacing(1),
        backgroundColor: "#F6F6F6"
    },
    divider: {
        margin: `${theme.spacing(2)}px 0`
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    deviceCard: {
        backgroundColor: "#EAEAEA",
        padding: 2,
        margin: 4
    },
    battery: {
        padding: 10
    }
}));

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
    if (percentage < 10)
        return <BatteryAlert style={{color: red[500]}}/>
    else if (percentage < 25)
        return <Battery20/>
    else if (percentage < 40)
        return <Battery30/>
    else if (percentage < 55)
        return <Battery50/>
    else if (percentage < 70)
        return <Battery60/>
    else if (percentage < 85)
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
        <Grid container className={classes.deviceContainer}>
            <Grid item>
                <Paper className={classes.paper}>
                    <DeviceEnabledIndicator enabled={deviceConfig["enabled"]}/>
                    <Battery percentage={deviceStatus["battery"]}/>
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
    const [groups, setGroups] = React.useState([]);
    const [product, setProduct] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const [sortby, setSortby] = React.useState(["id"]);

    React.useEffect(() => {
        // get user's groups
        axios.get("/groups")
            .then(res => {
                setGroups(res.data)
            })
    }, []);

    React.useEffect(() => {
        // get user's products
        axios.get("/products")
            .then(res => {
                setProducts(res.data)
            })
    }, []);

    React.useEffect(() => {
        // get devices
        const params = {
            includeLastData: true,
        }
        if (group) {
            params["groupId"] = group;
        }
        if (product) {
            params["productId"] = product;
        }
        axios.get("/devices", {params})
            .then(res => {
                setDevices(res.data);
            })
    }, [group, product]);

    const sortByItems = {
        "id": (a,b) => a["device"]["id"] - b["device"]["id"],
        "battery": (a,b) => a["device"]["deviceStatus"]["battery"] - b["device"]["deviceStatus"]["battery"],
        "enabled": (a,b) => a["device"]["config"]["enabled"] - b["device"]["config"]["enabled"]
    };

    return (
        <div className={classes.dashboard}>
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
            <FormControl className={classes.formControl}>
                <InputLabel id="product-select-label">Product</InputLabel>
                <Select
                    labelId="product-select-label"
                    id="product-select"
                    value={product}
                    onChange={(event) =>
                        setProduct(event.target.value)
                    }
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {
                        products.map(prod =>
                            <MenuItem key={prod["id"]} value={prod["id"]}>{prod["name"]}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel id="sortby-select-label">Sort by</InputLabel>
                <Select
                    labelId="sortby-select-label"
                    id="sortby-select"
                    value={sortby}
                    onChange={(event) =>
                        setSortby(event.target.value)
                    }
                >
                    {
                        Object.keys(sortByItems).map(item =>
                            <MenuItem key={item} value={item}>{item}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
                {
                    devices.sort(sortByItems[sortby])
                        .map(device =>
                        <Card className={classes.deviceCard} key={device["device"]["id"]}>
                                <Device deviceData={device}/>
                        </Card>
                    )
                }
        </div>
    );
}

export default Dashboard