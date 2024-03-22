import React from "react";
import {  Typography, Link, Grid, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <>
    <div style={{margin:"8px",backgroundColor:"#222",color:"#f0f0f0",padding:"6px"}}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="div" sx={{textAlign:"center"}}>
            Velvet Homes
          </Typography>
          <Typography variant="body2" sx={{textAlign:"center"}}>
            © {new Date().getFullYear()} All rights reserved.
          </Typography>
        </Grid>
        <Grid item xs={4} md={6} sx={{ textAlign: "right" }}>
          <Link href="/" color="inherit" sx={{ mx: 1, textDecoration: "none" }}>
            Home
          </Link>
          <Link href="#" color="inherit" sx={{ mx: 1, textDecoration: "none" }}>
            About
          </Link>
          <Link href="#" color="inherit" sx={{ mx: 1, textDecoration: "none" }}>
            Contact
          </Link>
          <IconButton href="#" color="inherit">
            <FacebookIcon />
          </IconButton>
          <IconButton href="#" color="inherit">
            <TwitterIcon />
          </IconButton>
          <IconButton href="#" color="inherit">
            <InstagramIcon />
          </IconButton>
        </Grid>
      </Grid>
      </div>
    </>
  );
};

export default Footer;
