import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import ImageCard from './ImageCard';
import ImageCardExpanded from './ImageCardExpanded';

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
  },
});

class SensorCards extends React.Component {
  constructor(props) {
    super(props);
    this.onAddToCart = props.onAddToCart.bind(this);
  }

  render() {
    const {className} = this.props
    const {sensors} = this.props
    return (
      <div className={className} id='sensors-to-buy'>
        {
          sensors.map((sensor, i) => {
            return <ImageCard sensor={sensor} key={sensor.id} checked={true} onAddToCart={this.onAddToCart} onClick={()=> this.props.onSensorClicked(sensor)}/>
          })
        }
        
      </div>
    );
  }
}

class SensorsToBuy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sensors: [],
      sensorToExpand: null
    };
    //this.checked = useWindowPosition('header');
    this.onAddToCart = this.onAddToCart.bind(this);
    this.onProductAdded = this.props.onProductAdded.bind(this);
    
  }

  onAddToCart(id) {
    const params = new URLSearchParams();
    params.append('productId', id);
    axios.post("/order/addProductToCart", params)
      .then((res) => {
        console.log(res)
      });
  }

  componentDidMount() {
    axios.get("/products")
      .then((res) => {
        this.setState({
          sensors: res.data,
          sensorToExpand: null
        });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const {classes} = this.props;
    const {sensors} = this.state;
    const {sensorToExpand} = this.state;
    const quantity = 1; // Use this field if in future the user can choose the quantity directly in the card
    if (sensorToExpand == null) {
      return (
        <SensorCards 
          className={classes.root} 
          sensors={sensors} 
          onAddToCart={(id) => {this.onAddToCart(id); this.onProductAdded(quantity); }} 
          onSensorClicked={ (sensor) => {this.setState({sensors: sensors, sensorToExpand: sensor})} }
        />
      );
    }
    return (
      <div className={classes.root} id='sensors-to-buy'>
          <ImageCardExpanded
            sensor={sensorToExpand} 
            key={sensorToExpand.id} 
            checked={true} 
            onAddToCart={(id) => {this.onAddToCart(id); this.onProductAdded(quantity); }} 
            onClose={() => {this.setState({sensors: sensors, sensorToExpand: null})}}
          />
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