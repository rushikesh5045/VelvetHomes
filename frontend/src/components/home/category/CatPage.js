import React from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import CustomAppBarComponent from "../client/AppBar/CustomAppBar";

const CatPage = ({ categories }) => {
  const { categoryId } = useParams();

  const category = categories.find((cat) => cat.label === categoryId);

  if (!category) {
    return <div>Category not found</div>;
  }

  const otherCategories = categories.filter((cat) => cat.label !== categoryId);

  return (
    <>
      <CustomAppBarComponent />
      <div style={{ padding: "20px" }}>
        <Typography
          variant="h2"
          style={{ marginBottom: "20px", fontFamily: "Sometype mono" }}
        >
          {category.label}
        </Typography>
        <hr />
        <Grid container spacing={3}>
          {category.subMenuItems &&
            category.subMenuItems.map((subCategory, index) => (
              <Grid item key={index} xs={12} md={3}>
                <Link
                  to={`/catList/${subCategory.name}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s ease-in-out",
                      ":hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      alt={subCategory.name}
                      src={subCategory.image}
                      sx={{ height: "20vh", objectFit: "cover" }}
                    />
                    <CardContent>
                      <Typography
                        variant="body1"
                        sx={{
                          textAlign: "center",
                          fontFamily: "Sometype mono",
                          fontSize: "20px",
                        }}
                      >
                        {subCategory.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
        </Grid>

        <Typography
          variant="h5"
          style={{
            marginBottom: "20px",
            fontFamily: "Sometype mono",
            marginTop: "2rem",
          }}
        >
          Explore Other Categories :
        </Typography>
        <Grid container spacing={3}>
          {otherCategories.map((otherCategory, index) => (
            <Grid item key={index} xs={12} md={3}>
              <Link
                to={`/category/${otherCategory.label}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s ease-in-out",
                    ":hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={otherCategory.label}
                    src={otherCategory.labelImage}
                    sx={{ height: "20vh", objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography
                      variant="body1"
                      sx={{
                        textAlign: "center",
                        fontFamily: "Sometype mono",
                        fontSize: "20px",
                      }}
                    >
                      {otherCategory.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
};

export default CatPage;
