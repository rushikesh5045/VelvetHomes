import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

import { useInView } from 'react-intersection-observer';

const NewProductCard = ({ product }) => {


  const [ref, inView] = useInView({
    triggerOnce: true, // Trigger the animation only once
    threshold: 0.2, // You can adjust this threshold value
  });
  const shouldAnimate = inView;

  const cardStyles = {
    minWidth:250,
    maxWidth: 250,
    margin: '15px',
    transition: 'transform 0.5s ease-in-out',
    '&:hover': {
      transform: 'scale(2.05)',
    },
    ...(shouldAnimate && { transform: 'scale(1.05)' }), // Apply animation if in view
  };

  const imageStyles = {
    width: '250px',
    height: '180px',
    // objectFit: 'cover',
  };

  const titleStyles = {
    fontSize: '1rem',
    height: '3.5rem', // Set a fixed height for the title
    overflow: 'hidden',
    textOverflow: 'ellipsis',

    fontFamily: "'Sometype Mono', monospace", // Apply the font
  };

  const priceStyles = {
    display: 'flex',
    alignItems: 'center',
    fontFamily: "'Sometype Mono', monospace",
  };



  return (
    <Card style={cardStyles} ref={ref}>
      <img src={product.dispimg} alt={product.title} style={imageStyles} />
      <CardContent>
        <Typography variant="h6" component="div" style={titleStyles}>
          {product.title}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {product.cat}
        </Typography>
        <div style={priceStyles}>
          <Typography variant="body1" color="textPrimary" style={{ marginRight: '10px' }}>
            Rs.{product.price}
          </Typography>
        </div>

      </CardContent>
    </Card>
  );
};

export default NewProductCard;
