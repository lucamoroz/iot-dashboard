import {NavLink, Route, Switch} from "react-router-dom";
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles';

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import ShopCart from "./pages/ShopCart";
import OrderList from "./pages/OrderList";
import Order from "./pages/Order";

// Allow to customize theme (e.g. change primary, secondary colors, ... )
const theme = createMuiTheme();

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
                <Navbar />
                <Main />
                <Footer />
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
            <li><NavLink to='/shop/cart'>Shop Cart</NavLink></li>
            <li><NavLink to='/shop/orders'>Order List</NavLink></li>

        </ul>
    </nav>
);

const Main = () => (
    <Switch>  { /* Render only the first Route that matches the URL */ }
        <Route exact path='/' component={Home} /> { /* Render component Home when the URL matches the path '/' */ }
        <Route exact path='/signup' component={Signup} /> { /* Note: removing 'exact' we could have a Rout with path='/device' that matches child paths e.g. '/device/status' */ }
        <Route exact path='/signin' component={Signin} />
        <Route exact path='/shop/cart' component={ShopCart} />
        <Route exact path='/shop/orders' component={OrderList} />
        <Route exact path='/shop/order/:id' component={Order} />
    </Switch>
);

const Footer = () => (
    <div>This is the footer</div>
);


export default App;
