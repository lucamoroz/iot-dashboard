import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { CardActionArea, Zoom } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {capitalized} from '../hook/util';



const useStyles = makeStyles({
  root: {
    //width: '40%',//`calc(100% - 20px)`,
    width: `calc(max(240px, min(50%, 380px)))`,
    margin: '1%',
    borderRadius: 15,
    //flexBasis: '50%',
  },
  media: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: '1rem',
    color: 'rgba(0,0,0,0.8)',
    marginRight: '0.5vw',
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
    fontSize: '0.9rem',
    color: 'black'
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
    justifyContent: 'flex-start',
    alignItems: 'center',

  }
});

export default function ImageCard({ sensor, checked, onAddToCart, onClick, component, to, delay }) {
  const classes = useStyles();
  const [raiseState, setRaiseState] = useState({
    raised: false,
    shadow: 0,
  })
  // Not good. Get the image id or the image directly from backend
  const imageUrl = sensor.image;
  return (
    <Zoom in={checked} style={{ transitionDelay: checked ? delay : '0ms' }}>
      <Card className={classes.root}
        onMouseOver={() => setRaiseState({ raised: true, shadow: 5 })}
        onMouseOut={() => setRaiseState({ raised: false, shadow: 1 })}
        raised={raiseState.raised}
        zdepth={raiseState.shadow}>
        <CardActionArea component={component} to={to}>
          <CardMedia
            className={classes.media}
            component="img"
            width="10"
            image={imageUrl}
            onClick={onClick}
          />
          <CardContent className={classes.cardContent}>
          <Typography
                gutterBottom
                className={classes.title}>
                {capitalized(sensor.name)}
              </Typography>
              <Typography className={classes.price}>
                {sensor.price.toFixed(2)}$
              </Typography>
          </CardContent>
        </CardActionArea>

      </Card>
    </Zoom>
  );
}