import React from "react";
import { Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import MainCategoryCard from "./MainCategoryCard";
import SubCateCard from "./SubCateCard";
import Arrays from "./Arrays";
const MainCategorySection = () => {
  const categories = Arrays;

  const categoriesStyles = {
    padding: "40px 0",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  };

  const categoriesTitleStyles = {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "30px",
  };

  const mainCategoryContainerStyles = {
    display: "flex",
    width: "100%",
    justifyContent: "space-evenly",
  };

  const subCategoriesContainerStyles = {
    width: "50%",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <section style={categoriesStyles}>
      <Typography variant="h2" style={categoriesTitleStyles}>
        All Categories
      </Typography>
      <hr />
      <Grid container spacing={3}>
        {categories.map((category, index) => (
          <Grid item key={index} xs={12} md={12}>
            <div style={mainCategoryContainerStyles}>
              <Link
                to={`/category/${category.label}`}
                color="inherit"
                underline="none"
              >
                <MainCategoryCard {...category} />
              </Link>
              <div style={subCategoriesContainerStyles}>
                {category.subMenuItems &&
                  category.subMenuItems.map((subCategory, subIndex) => (
                    <Link
                      to={`/catList/${subCategory.name}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {" "}
                      <SubCateCard
                        key={subIndex + 1}
                        subCategory={subCategory}
                      />
                    </Link>
                  ))}
              </div>
            </div>

            <hr />
          </Grid>
        ))}
      </Grid>
    </section>
  );
};

export default MainCategorySection;
