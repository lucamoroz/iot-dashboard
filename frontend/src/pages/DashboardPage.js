import React, {useContext, useState} from "react";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import PowerIcon from '@material-ui/icons/Power';
import PowerOffIcon from '@material-ui/icons/PowerOff';
import { green, red } from '@material-ui/core/colors';
import {Link as RouterLink} from 'react-router-dom';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import {
    CardActionArea,
    CardActions,
    CardContent,
    FormControlLabel,
    FormLabel,
    Link, Radio,
    RadioGroup,
    Zoom
} from "@material-ui/core";
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
import Typography from "@material-ui/core/Typography";
import CustomerContext from "../CustomerContext";
import { useEffect } from "react";

const axios = require('axios').default

const useStyles = makeStyles((theme) => ({
    dashboard: {
        marginLeft: 10,
        marginRight: 10
    },
    deviceContainer: {
        display: "flex",
        padding:0,
        flexFlow: "row wrap",
        justifyContent: "flex-start",
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap",
        margin: theme.spacing(1),
        backgroundColor: "#F6F6F6",
        width: 180,
        float:"left"
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
    },
    deviceCardCompact: {
        width: 230,
        margin: 10,
        backgroundColor: "#EAEAEA",
        float: "left",
    },
    devices: {
        display: "flex",
        flexFlow: "row wrap",
        alignContent: "space-between"
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
            <Paper className={classes.paper} style={{backgroundColor: "#77CBB9"}}>
                <Typography noWrap>{props.dataType}: {props.value}</Typography>
            </Paper>
    )
}

function DeviceGroups(props) {
    const classes = useStyles();
    return (
            <Paper className={classes.paper} style={{backgroundColor: "#DAD2BC"}}>
                <Typography noWrap>{props.groupName}</Typography>
            </Paper>
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
    const {checked} = props;
    const {delay} = props;

    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    const compact = (
        <Zoom in={checked} style={{ transitionDelay: checked ? delay : 0 }}>
            <Card className={classes.deviceCardCompact}>
                <CardActionArea>
                    <Link style={{color: 'inherit', textDecoration: 'inherit'}}
                          component={RouterLink} to={"/dashboard/device/"+deviceId}>
                        <CardContent>
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <Typography noWrap gutterBottom variant="subtitle1">
                                    {capitalize(productName)}
                                </Typography>
                                <Typography variant="h6">
                                    {deviceId}
                                </Typography>
                            </div>
                            {
                                groups.map(group =>
                                    <DeviceGroups key={group["id"]} groupName={capitalize(group["name"])}/>
                                )
                            }
                            {
                                Object.keys(deviceData).map(key =>
                                    <DeviceData key={key} dataType={capitalize(key)} value={deviceData[key]}/>
                                )
                            }
                        </CardContent>
                    </Link>
                </CardActionArea>
                <CardActions style={{display: "flex", justifyContent: "space-between"}}>
                    <IconButton component={RouterLink} to={"/dashboard/device/"+deviceId+"/config"} >
                        <SettingsIcon/>
                    </IconButton>
                    <div>
                        <DeviceEnabledIndicator enabled={deviceConfig["enabled"]}/>
                        <Battery percentage={deviceStatus["battery"]}/>
                    </div>
                </CardActions>
            </Card>
        </Zoom>
    );

    const wide = (
        <Zoom in={checked} style={{ transitionDelay: checked ? delay : 0 }}>
            <Grid container alignItems="center">
                <Grid item xs={11}>
                    <Card className={classes.deviceCard}>
                        <CardActionArea component={RouterLink} to={"/dashboard/device/"+deviceId}>
                            <CardContent className={classes.deviceContainer}>
                                <Paper className={classes.paper} style={{width: "auto"}}>
                                    <DeviceEnabledIndicator enabled={deviceConfig["enabled"]}/>
                                    <Battery percentage={deviceStatus["battery"]}/>
                                </Paper>
                                <Paper className={classes.paper} style={{width: 70}}>
                                    <Typography>ID: {deviceId}</Typography>
                                </Paper>
                                {
                                    groups.map(group =>
                                        <DeviceGroups key={group["id"]} groupName={capitalize(group["name"])}/>
                                    )
                                }
                                    <Paper className={classes.paper}>
                                        <Typography noWrap>{capitalize(productName)}</Typography>
                                    </Paper>
                                {
                                    Object.keys(deviceData).map(key =>
                                        <DeviceData key={key} dataType={capitalize(key)} value={deviceData[key]}/>
                                    )
                                }
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={1}>
                    <IconButton component={RouterLink} to={"/dashboard/device/"+deviceId+"/config"} >
                        <SettingsIcon/>
                    </IconButton>
                </Grid>
            </Grid>
        </Zoom>
    );

    if (props.mode === "compact") {
        return compact;
    } else {
        return wide;
    }
}

function Devices(props) {
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        setChecked(true);
    }, []);
    if (props.devices.length > 0) {
        return props.devices
            .map((device, i) =>
                <Device mode={props.mode} key={device["device"]["id"]} deviceData={device} checked={checked} delay={i * 50}/>
            )
    } else {
        return <Typography>No devices</Typography>
    }
}

function DashboardPage(props) {
    const classes = useStyles();
    const [group, setGroup] = useState("");
    const [devices, setDevices] = useState([]);
    const [groups, setGroups] = useState([]);
    const [product, setProduct] = useState([]);
    const [products, setProducts] = useState([]);
    const [sortby, setSortby] = useState("id");
    const [visualization, setVisualization] = useState(
        window.innerWidth < 620 ? "compact" : "wide"
    );

    const customerContext = useContext(CustomerContext);

    if (customerContext.isLoggedIn === undefined) {
        console.log("Waiting to know if customer is logged in");
    } else if (!customerContext.isLoggedIn) {
        props.history.push('/signin');
    }

    useEffect(() => {
        // get user's groups
        axios.get("/groups")
            .then(res => {
                setGroups(res.data)
            })
    }, []);

    useEffect(() => {
        // get user's products
        axios.get("/products")
            .then(res => {
                setProducts(res.data)
            })
    }, []);

    useEffect(() => {
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

    function handleVisualization(e) {
        setVisualization(e.target.value);
    }

    return (
        <div className={classes.dashboard}>
            <FormControl component="fieldset">
                <FormLabel component="legend">View</FormLabel>
                <RadioGroup row aria-label="gender"
                            name="visualization"
                            value={visualization}
                            onChange={handleVisualization}
                >
                    <FormControlLabel value="wide" control={<Radio />} label="Wide" />
                    <FormControlLabel value="compact" control={<Radio />} label="Compact" />
                </RadioGroup>
            </FormControl>
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
            </div>
            <div className={classes.devices}>
                <Devices mode={visualization} devices={devices.sort(sortByItems[sortby])}/>
            </div>
        </div>
    );
}

export default DashboardPage