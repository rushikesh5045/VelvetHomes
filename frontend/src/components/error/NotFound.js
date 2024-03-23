import React from "react";
import { Link } from "react-router-dom";
import { Typography, Button, Container } from "@mui/material";
import CustomAppBarComponent from "../home/client/AppBar/CustomAppBar";

const NotFound = () => {
  return (
    <>
      <CustomAppBarComponent />
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "20px" }}>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "20px" }}>
          The page you are looking for does not exist.
        </Typography>
        <Button
          variant="contained"
          style={{ backgroundColor: "black", color: "white" }}
          component={Link}
          to="/"
        >
          Go to Home
        </Button>
      </Container>
    </>
  );
};

export default NotFound;
