import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import { Typography, Grid } from "@mui/material";
import CustomAppBarComponent from "../client/AppBar/CustomAppBar";
import ProductCard from "../client/explore/ProductCard";

const HomeButton = styled(Link)`
  position: absolute;
  top: 12vh;
  left: 20px;
  display: block;
  text-decoration: none;
  width: 50px;
  padding: 5px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
`;

const StyledProductCard = styled(ProductCard)`
  max-width: 300px;
  margin: 20px;
  transition: transform 0.5s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProductListPage = () => {
  const { subCategory } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://velvethomes-bpj4.onrender.com/input/products/category/${subCategory}`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [subCategory]);

  return (
    <>
      <CustomAppBarComponent />

      <div style={{ padding: "20px" }}>
        <Typography
          variant="h2"
          style={{
            marginBottom: "20px",
            fontFamily: "Sometype mono",
            textAlign: "center",
          }}
        >
          {subCategory}
        </Typography>
        <hr />
        <Grid container spacing={3}>
          {products.map((product, index) => (
            <Grid item key={index} xs={12} md={3}>
              <Link
                to={`/products/${product._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <StyledProductCard product={product} />
              </Link>
            </Grid>
          ))}
        </Grid>
        <HomeButton to="/">← </HomeButton>
      </div>
    </>
  );
};

export default ProductListPage;
