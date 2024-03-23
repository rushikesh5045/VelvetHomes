
import React, { useState } from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const MainCategoryCard = ({ label, labelImage }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ position: "relative" }}
    >
      <CardMedia
        component="img"
        alt={label}
        src={labelImage}
        sx={{
          height: "100%",
          width: "600px",
          objectFit: "cover",
        }}
      />
      <Typography
        variant="h2"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "#fff",
          width: "100%",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          animation: isHovered ? `${fadeIn} 0.5s ease-in-out` : "none",
          textShadow: isHovered ? "2px 2px 4px rgba(0, 0, 0, 0.8)" : "none",
          fontFamily: isHovered ? "Sometype Mono":"Sometype Mono",
          backgroundColor:"#2222227a",
          borderRadius:"25px"

        }}
      >
        {label}
      </Typography>
      <CardContent>

      </CardContent>
    </Card>
  );
};

export default MainCategoryCard;
