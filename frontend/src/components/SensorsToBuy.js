import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ImageCard from './ImageCard';
import ImageCardExpanded from './ImageCardExpanded';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Zoom } from '@material-ui/core';
import { useState } from 'react';
import { useEffect } from 'react';

const axios = require('axios').default

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

/*class SensorCards extends React.Component {
  constructor(props) {
    super(props);
    this.onAddToCart = props.onAddToCart.bind(this);
  }

  render() {
    const { className } = this.props
    const { sensors } = this.props
    return (
      <div className={className} id='sensors-to-buy'>
        {
          sensors.map((sensor, i) => {
            return <Zoom
            in={true} style={{ transitionDelay: i *100 }}>
              <ImageCard
              sensor={sensor}
              key={sensor.id}
              checked={true}
              onAddToCart={this.onAddToCart}
              component={RouterLink} to={"/dashboard/shop/product/" + sensor.id} />
            </Zoom>
          })
        }

      </div>
    );
  }
}*/

function SensorCards(props) {
  const [checked, setChecked] = useState(false);
  const { className } = props;
  const { sensors } = props;
  useEffect(() => {
    setChecked(true);
  }, []);
  return (
    <Grid className={className} container id='sensors-to-buy'>
      {
        sensors.map((sensor, i) => {
          return <ImageCard
          sensor={sensor}
          key={sensor.id}
          checked={checked}
          delay={i * 100}
          onAddToCart={props.onAddToCart}
          component={RouterLink} to={"/dashboard/shop/product/" + sensor.id} />
        })
      }

    </Grid>
  );
}

class SensorsToBuy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sensors: [],
      isLoading: true,
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
          isLoading: false,
        });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { classes } = this.props;
    const { sensors } = this.state;
    const { isLoading } = this.state;
    const quantity = 1; // Use this field if in future the user can choose the quantity directly in the card
    if (isLoading == null) {
      return (
        <div>
          Loading Data
        </div>
      );
    }
    return (
      <div id="products-to-buy">
        <SensorCards
          className={classes.root}
          sensors={sensors}
          onAddToCart={(id) => { this.onAddToCart(id); this.onProductAdded(quantity); }}
        />
      </div>

    );
  }
}

//export default SensorsToBuy;
export default withStyles(styles, { withTheme: true })(SensorsToBuy);