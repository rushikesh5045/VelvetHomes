import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";

const SmallerProductCard = ({ product, companyId }) => {
  const cardStyles = {
    maxWidth: 300,

    margin: "10px",

    padding: "10px",
    width: "250px",
    borderRadius: "10px",
  };

  const imageStyles = {
    width: "250px",

    height: "250px",
  };

  const titleStyles = {
    fontSize: "10px",

    height: "1rem",

    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const priceStyles = {
    fontSize: "12px",
  };

  const cardContentStyles = {
    padding: "4px",
  };

  return (
    <Card style={cardStyles}>
      <img src={product.dispimg} alt={product.title} style={imageStyles} />
      <CardContent style={cardContentStyles}>
        <Typography variant="body2" component="div" style={titleStyles}>
          {product.title}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          gutterBottom
          style={priceStyles}
        >
          Rs.{product.price}
        </Typography>
        <Link
          to={`/company-edit/${product.company}/editProduct/${product._id}`}
        >
          <p
            style={{
              backgroundColor: "black",
              color: "white",
              padding: "5px",
              borderRadius: "7px",
              fontFamily: "monospace",
              textAlign: "center",
            }}
          >
            Edit Product
          </p>
        </Link>
      </CardContent>
    </Card>
  );
};

export default SmallerProductCard;
