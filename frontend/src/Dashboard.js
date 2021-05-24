import React, {useContext, useState} from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Link as RouterLink, Link, Route, Switch, useRouteMatch} from "react-router-dom";
import Profile from "./pages/Profile";
import DashboardIcon from '@material-ui/icons/Dashboard';
import DashboardPage from "./pages/DashboardPage";
import MapPage from "./pages/MapPage";
import CustomerContext from "./CustomerContext";
import MapIcon from '@material-ui/icons/Map';
import ShopIcon from '@material-ui/icons/Shop';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import Device from "./pages/Device";
import ShopPage from "./pages/ShopPage";
import ShopCart from "./pages/ShopCart";
import OrderList from "./pages/OrderList";
import Order from "./pages/Order";
import DeviceConfig from "./pages/DeviceConfig";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import HistoryIcon from '@material-ui/icons/History';
import {Badge, Button} from "@material-ui/core";
import Product from './pages/Product';
import SnackbarAlert from "./components/SnackbarAlert";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import {ExitToApp} from "@material-ui/icons";

const axios = require('axios').default

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
        [theme.breakpoints.down('xs')]: {
            width: 0,
            display:'none',
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    colorText: {
        color: '#5AFF3D'
    },
    title: {
        flexGrow: '1',
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
}));

function Dashboard(props) {

    const customerContext = useContext(CustomerContext);
    if (customerContext.isLoggedIn === undefined) {
        // Waiting to know if customer is logged in
    } else if (!customerContext.isLoggedIn) {
        props.history.push('/signin');
    }

    const classes = useStyles();
    const theme = useTheme();
    let match = useRouteMatch();
    const [open, setOpen] = React.useState(window.innerWidth >= 620);
    const [cartCount, setCartCount] = React.useState(0);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleSetCartCount = (count) => {
        setCartCount(count);
    };

    function logoutCustomer() {
        axios.post('/customer/logout')
            .then((res) => {
                customerContext.setIsLoggedIn(false);
            })
            .catch((err) => {
                const errorMsg = err.response ? err.response.data.description : "No response from backend";
                setError(errorMsg);
            })
    }

    // Content of drawer, i.e. the sidebar menu
    const drawer = (
        <div>
            <div className={classes.toolbar}>
                <List>
                    <ListItem button key="home" component={Link} to="/">
                        <ListItemIcon><HomeIcon/></ListItemIcon>
                        <ListItemText primary="Home page" />
                    </ListItem>
                </List>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </div>
            <Divider />
            <List>
                <ListItem button key="Dashboard" component={Link} to={`${match.url}`}>
                    <ListItemIcon><DashboardIcon/></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button key="Map" component={Link} to={`${match.path}/map`}>
                    <ListItemIcon><MapIcon/></ListItemIcon>
                    <ListItemText primary="Map" />
                </ListItem>
                <Divider />
                <ListItem button key="Shop" component={Link} to="/dashboard/shop">
                    <ListItemIcon><ShopIcon/></ListItemIcon>
                    <ListItemText primary="Shop" />
                </ListItem>
                <ListItem button key="ShopCart" component={Link} to="/dashboard/shop/cart">
                    <ListItemIcon><ShoppingCartIcon/></ListItemIcon>
                    <ListItemText primary="Shopping cart" />
                </ListItem>
                <ListItem button key="Orders" component={Link} to="/dashboard/shop/orders">
                    <ListItemIcon><HistoryIcon/></ListItemIcon>
                    <ListItemText primary="Orders history" />
                </ListItem>
                <Divider />
                <ListItem button key="Profile" component={Link} to={`${match.path}/profile`}>
                    <ListItemIcon><AccountCircleIcon/></ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button key="Logout" onClick={() => setOpenLogoutDialog(true)}>
                    <ListItemIcon><ExitToApp/></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    );

    // Main content of the dashboard displayed using nested routing
    const main = (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <Switch>
                <Route exact path={`${match.path}`}  component={DashboardPage} />
                <Route exact path={`${match.path}/profile`}  component={Profile} />
                <Route exact path={`${match.path}/map`} component={MapPage} />
                <Route exact path={`${match.path}/device/:id`} component={Device} />
                <Route exact path={`${match.path}/shop`} render={(props) => (
                       <ShopPage {...props} handleSetCartCount={handleSetCartCount}/>
                   )}
                />
                <Route exact path={`${match.path}/shop/cart`} component={ShopCart} />
                <Route exact path={`${match.path}/shop/orders`} component={OrderList} />
                <Route exact path={`${match.path}/shop/order/:id`} component={Order} />
                <Route exact path={`${match.path}/shop/product/:id`} render={(props) => (
                    <Product {...props} handleSetCartCount={handleSetCartCount} />
                )} />
                <Route exact path={`${match.path}/device/:id/config`} component={DeviceConfig} />
            </Switch>
        </main>
    );

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        IoT<span className={classes.colorText}>-Dash</span>
                    </Typography>
                    <IconButton component={RouterLink} to="/dashboard/shop/cart"
                                aria-label="shopping cart" color="inherit">
                        <Badge badgeContent={cartCount} color="secondary">
                            <ShoppingCartIcon/>
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                {drawer}
            </Drawer>

            {main}

            <SnackbarAlert
                open={error !== ""}
                autoHideDuration={3000}
                onTimeout={() => setError("")}
                severity="error"
                message={error}
            />
            <SnackbarAlert
                open={message !== ""}
                autoHideDuration={3000}
                onTimeout={() => setMessage("")}
                severity="success"
                message={message}
            />

            <Dialog
                open={openLogoutDialog}
                onClose={() => setOpenLogoutDialog(false)}
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to log out?"}</DialogTitle>

                <DialogActions>
                    <Button onClick={() => setOpenLogoutDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={logoutCustomer} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Dashboard;