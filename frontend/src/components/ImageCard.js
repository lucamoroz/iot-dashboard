import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { CardActionArea, Collapse } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link as RouterLink } from 'react-router-dom';



const useStyles = makeStyles({
  root: {
    maxWidth: 645,
    background: 'rgba(0,0,0,0.5)',
    margin: '20px'
  },
  media: {
    height: 440,
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: '2rem',
    color: '#fff'
  },
  description: {
    fontFamily: 'Roboto',
    fontWeight: 'regular',
    fontSize: '1.1rem',
    color: '#ddd'
  },
  price: {
    fontFamily: 'Roboto',
    fontWeight: 'regular',
    fontSize: '1.1rem',
    color: '#fff'
  },
  buttonText: {
    color: 'white',
    fontSize: '1rem'
  },
  buttonIcon: {
    color: 'white',
    marginLeft: '10px'
  },
  addToCartButton: {
    backgroundColor: 'blue',
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  }
});

export default function ImageCard({ sensor, checked, onAddToCart, onClick }) {
  const classes = useStyles();
  const [raiseState, setRaiseState] = useState({
    raised: false,
    shadow: 0,
  })
  // Not good. Get the image id or the image directly from backend
  const imageUrl = sensor.id === 1 ? process.env.PUBLIC_URL + '/assets/temp_sensor.jpg' : process.env.PUBLIC_URL + '/assets/wind_sensor.jpg';
  return (
    <Collapse in={checked}>
      <Card className={classes.root}
        onMouseOver={() => setRaiseState({ raised: true, shadow: 5 })}
        onMouseOut={() => setRaiseState({ raised: false, shadow: 1 })}
        raised={raiseState.raised}
        zdepth={raiseState.shadow}>
        <CardActionArea component={RouterLink} to={"product/" + sensor.id}>
          <CardMedia
            className={classes.media}
            component="img"
            height="140"
            image={imageUrl}
            onClick={onClick}
          />
          <CardContent className={classes.cardContent}>
          <Typography
                gutterBottom
                variant="h5"
                component="h1"
                className={classes.title}>
                {sensor.name}
              </Typography>
              <Typography className={classes.price}>
                {sensor.price}$
              </Typography>

            {/*<Button className={classes.addToCartButton} onClick={() => onAddToCart(sensor.id)}>
                <Typography className={classes.buttonText}>
                  Add to cart
                </Typography>
              </Button>*/}
          </CardContent>
        </CardActionArea>

      </Card>
    </Collapse>
  );
}