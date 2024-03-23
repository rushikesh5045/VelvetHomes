import React from "react";
import { Card, Typography, CardMedia, Grid } from "@mui/material";

const SubCateCard = ({ subCategory }) => {
  const { name, image } = subCategory;

  return (
    <Grid item xs={12} md={3} sx={{ margin: "10px", textAlign: "center" }}>
      <Card
        sx={{
          width: "150px",
          height: "min-content",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "2px solid transparent",
          borderRadius: "5px",
          transition:
            "border-color 0.3s ease-in-out, transform 0.5s ease-in-out",
          "&:hover": {
            transform: "scale(1.3)",
          },
        }}
      >
        <CardMedia
          component="img"
          alt={name}
          src={image}
          sx={{ height: "100px", width: "100%", objectFit: "cover" }}
        />

        <Typography
          sx={{ fontSize: "14px", padding: "2px", fontWeight: "bold" }}
          color="textSecondary"
        >
          {name}
        </Typography>
      </Card>
    </Grid>
  );
};

export default SubCateCard;
