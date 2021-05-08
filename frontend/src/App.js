import {NavLink, Route, Switch} from "react-router-dom";
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles';

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import ShopPage from "./pages/ShopPage";
import Cart from "./pages/Cart";
import LandingPage from './pages/LandingPage';
import MapPage from "./pages/MapPage";
import Dashboard from "./pages/Dashboard";

// Allow to customize theme (e.g. change primary, secondary colors, ... )
const theme = createMuiTheme()

const useStyles = makeStyles({
    root: {
        display: "inline"
    }
});

function App() {
    const classes = useStyles();
    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                
                <Main />
                
            </div>
        </ThemeProvider>
    );
}

const Navbar = () => (
    <nav>
        <ul>
            <li><NavLink to='/'>Home</NavLink></li>
            <li><NavLink to='/signup'>Signup</NavLink></li>
            <li><NavLink to='/signin'>Signin</NavLink></li>
            <li><NavLink to='/shop'>Shop</NavLink></li>
            <li><NavLink to='/landing'>Landing</NavLink></li>
            <li><NavLink to='/dashboard'>Dashboard</NavLink></li>
        </ul>
    </nav>
);

const Main = () => (
    <Switch>  { /* Render only the first Route that matches the URL */ }
        <Route exact path='/' component={LandingPage} /> { /* Render component Home when the URL matches the path '/' */ }
        <Route exact path='/signup' component={Signup} /> { /* Note: removing 'exact' we could have a Rout with path='/device' that matches child paths e.g. '/device/status' */ }
        <Route exact path='/signin' component={Signin} />
        <Route exact path='/cart' component={Cart} />
        <Route exact path='/shop' component={ShopPage} />
        <Route exact path='/landing' component={LandingPage} />
        <Route exact path='/map' component={MapPage} />
        <Route exact path='/dashboard' component={Dashboard} />
    </Switch>
);

const Footer = () => (
    <div>This is the footer</div>
);


export default App;
