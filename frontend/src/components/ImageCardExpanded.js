import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { Collapse, IconButton} from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    background: 'rgba(0,0,0,0.5)',
  },
  media: {
      height: 440,
      display: 'flex',
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
  },
  closeButton: {
      color: 'white',
  }
});

export default function ImageCardExpanded( { sensor, checked, onAddToCart, onClick, onClose } ) {
  const classes = useStyles();
  const [raiseState, setRaiseState] = useState({
    raised: false,
    shadow: 0,
  })
  // Not good. Get the image id or the image directly from backend
  const imageUrl = sensor.id == 1 ? process.env.PUBLIC_URL + '/assets/temp_sensor.jpg' : process.env.PUBLIC_URL + '/assets/wind_sensor.jpg';
  return (
      <Collapse in={checked}>
        <Card className={classes.root} >


            <CardContent className={classes.cardContent}>
                <Typography className={classes.title}>
                    {sensor.name}
                </Typography>

                <IconButton className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </CardContent>

            

            <CardMedia
                className={classes.media}
                component="img"
                height="80"
                image={imageUrl}
                onClick={onClick}
            />
            
            <CardContent className={classes.cardContent}>
              <Typography 
                  gutterBottom 
                  variant="h5" 
                  component="h1" 
                  className={classes.title}>
                      {sensor.description}
              </Typography>
              <Button className={classes.addToCartButton} onClick={() => onAddToCart(sensor.id)}>
                <Typography className={classes.buttonText}>
                  Add to cart
                </Typography>
              </Button>
              <Button className={classes.addToCartButton}>
                <Typography className={classes.buttonText}>
                  Price {sensor.price}
                </Typography>
              </Button>
            </CardContent>
        </Card>
      </Collapse>
  );
}