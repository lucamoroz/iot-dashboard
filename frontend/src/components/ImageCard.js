import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { Collapse} from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
      fontFamily: 'Nunito',
      fontWeight: 'bold',
      fontSize: '2rem',
      color: '#fff'
  },
  description: {
    fontFamily: 'Nunito',
    fontWeight: 'regular',
    fontSize: '1.1rem',
    color: '#ddd'
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
    width: '80%'
  }
});

export default function ImageCard( { sensor, checked, onAddToCart, onClick } ) {
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
        onMouseOver={() => setRaiseState({ raised:true, shadow:5 })} 
        onMouseOut={()=>setRaiseState({ raised:false, shadow:1 })} 
        raised= {raiseState.raised}
        zdepth={raiseState.shadow}>
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
              <Button className={classes.addToCartButton} onClick={() => onAddToCart(sensor.id)}>
                <Typography className={classes.buttonText}>
                  Add to cart
                </Typography>
              </Button>
            </CardContent>
        </Card>
      </Collapse>
  );
}