import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

import { useInView } from "react-intersection-observer";

const ProductCard = ({ product }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,

    threshold: 0.2,
  });
  const shouldAnimate = inView;

  const cardStyles = {
    maxWidth: 300,
    margin: "20px",
    transition: "transform 0.5s ease-in-out",
    "&:hover": {
      transform: "scale(2.05)",
    },
    ...(shouldAnimate && { transform: "scale(1.05)" }),
  };

  const imageStyles = {
    width: "300px",
    height: "250px",
  };

  const titleStyles = {
    fontSize: "1rem",
    height: "3.5rem",
    overflow: "hidden",
    textOverflow: "ellipsis",

    fontFamily: "'Sometype Mono', monospace",
  };

  const priceStyles = {
    display: "flex",
    alignItems: "center",
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
          <Typography
            variant="body1"
            color="textPrimary"
            style={{ marginRight: "10px" }}
          >
            Rs.{product.price}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
