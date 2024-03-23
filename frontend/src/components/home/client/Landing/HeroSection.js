import React from "react";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const heroStyles = {
    backgroundColor: "#f4f4f4",
    padding: "60px 0",
    textAlign: "center",
  };

  const heroTitleStyles = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const heroTextStyles = {
    fontSize: "1.25rem",
    marginBottom: "20px",
  };

  const heroButtonStyles = {
    fontSize: "1rem",
    backgroundColor: "#000",
  };

  const navigate = useNavigate();
  const exploreButtonHandler = () => {
    navigate("/explore-page");
  };

  return (
    <section style={heroStyles}>
      <Typography variant="h3" component="h1" style={heroTitleStyles}>
        Welcome to Velvet Homes
      </Typography>
      <Typography variant="body1" component="p" style={heroTextStyles}>
        Discover the perfect interior products for your home.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        style={heroButtonStyles}
        onClick={exploreButtonHandler}
      >
        Explore Products
      </Button>
    </section>
  );
};

export default HeroSection;
