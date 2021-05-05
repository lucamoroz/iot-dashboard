import React, {useState} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import ImageCard from './ImageCard';
import sensors from '../static/Sensors'
import useWindowPosition from '../hook/useWindowPosition';

const axios = require('axios').default

/*const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    }
  }
}));*/

const styles = theme => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    }
  }
});

class SensorsToBuy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sensors: [],
    };
    //this.checked = useWindowPosition('header');
    this.onAddToCart = this.onAddToCart.bind(this);
    
  }

  componentDidMount() {
    axios.get("/products")
      .then((res) => {
        this.setState({
          sensors: res.data,
        });
        console.log(res);
      });
  }

  onAddToCart(id) {
    const params = new URLSearchParams();
    params.append('productId', id);
    axios.post("/order/addProductToCart", params)
      .then((res) => {
        console.log(res)
      });
  }

  render() {
    const {classes} = this.props
    const {sensors} = this.state
    return (
      <div className={classes.root} id='sensors-to-buy'>
        {
          sensors.map((sensor, i) => {
            return <ImageCard sensor={sensor} key={sensor.id} checked={true} onAddToCart={this.onAddToCart}/>
          })
        }
        
      </div>
    );
  }
}

/*export default function SensorsToBuy() {
  const classes = useStyles();
  const  checked = useWindowPosition('header');
  const [sensorState, updateSensorState] = useState([])
  axios.get("/products")
    .then((res) => {
      updateSensorState(res.data)
      console.log(res);
    })
  return (
    <div className={classes.root} id='sensors-to-buy'>
      {
        sensorState.map((sensor, i) => {
          return <ImageCard sensor={sensor} checked={checked}/>
        })
      }
      
    </div>
  );
}*/

//export default SensorsToBuy;
export default withStyles(styles, { withTheme: true })(SensorsToBuy);