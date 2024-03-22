import React, { useState, useEffect } from "react";
import { useParams, useNavigate,Link } from "react-router-dom";
import styled from 'styled-components';
import { toast,ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Typography,
  CircularProgress,
  Button,
  Grid,
  Card,
  CardMedia,
  Paper,
  Divider,
} from "@mui/material";
import axios from "axios";
import CustomAppBarComponent from "../AppBar/CustomAppBar";
import { useCart } from "../../../../context/CartContext";

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

const ProductDescriptionPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const { addToCart } = useCart(); // Use the addToCart function from the context

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/input/${productId}`
        );
        setProduct(response.data);
        setLoading(false);

        // Fetch company details using the company ID from the product
        const companyResponse = await axios.get(
          `http://localhost:8000/company/${response.data.company}`
        );
        setCompanyName(companyResponse.data.companyName);
        // Set the initial selected image as the first image in the product's images array
        setSelectedImage(response.data.images[0]);
      } catch (error) {
        console.error("Error fetching product details:", error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  

  const handleAddToCart = () => {
    const isLoggedIn =
      localStorage.getItem("token") && localStorage.getItem("role") === "user";
  
    if (isLoggedIn) {
      addToCart({
        productId: product._id,
        title: product.title,
        price: product.price,
        displayImage: product.images[0],
        quantity: 1,
      });
      // Show toast message
      toast.success("Product added to cart", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(`Added ${product.title} to the cart.`);
      console.log(`Added ${product.title} to the cart with id ${productId}.`);
    } else {
      navigate("/login");
    }
  };

  const handleBuyNow = () => {
    // Add your logic to handle the "Buy Now" action
    console.log(`Buying ${product.title} now.`);
  };

  return (
    <>
      <ToastContainer />
      <CustomAppBarComponent />
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          textAlign: "center",
          margin: "20px auto",
          maxWidth: "800px",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              {capitalizeWords(product.title)}
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              style={{ marginBottom: "20px" }}
            >
              Category: {product.cat}
            </Typography>

            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} md={4}>
                {/* Column of small images */}
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product ${index + 1}`}
                    style={{
                      maxWidth: "100%",
                      width: "80px",
                      height: "80px",
                      marginBottom: "10px",
                      cursor: "pointer",
                      border: `2px solid ${
                        selectedImage === image ? "blue" : "transparent"
                      }`,
                      borderRadius: "5px",
                    }}
                    onClick={() => handleImageClick(image)}
                  />
                ))}
              </Grid>
              <Grid item xs={12} md={8} style={{ textAlign: "left" }}>
                {/* Larger image */}
                <Card>
                  <CardMedia
                    component="img"
                    alt="Selected Product"
                    height="400"
                    image={selectedImage}
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                      border: "2px solid #ccc",
                      borderRadius: "5px",
                    }}
                  />
                </Card>
              </Grid>
            </Grid>

            <Divider style={{ margin: "20px 0" }} />

            {/* Description Section */}
            <div
              style={{
                textAlign: "left",
                padding: "0 20px",
                fontFamily: "sans-serif",
              }}
            >
              <Typography variant="body1" color="textPrimary" gutterBottom>
                Description:
              </Typography>
              <ul style={{ padding: 0 }}>
                {product.description.split(".").map(
                  (sentence, index) =>
                    sentence.trim() && (
                      <Typography key={index} color="textSecondary">
                        <li style={{ marginBottom: "8px" ,fontSize:"10px"}}>
                          {sentence.trim()}
                        </li>
                      </Typography>
                    )
                )}
              </ul>
            </div>

            <Divider style={{ margin: "20px 0" }} />

            <Typography variant="body1" color="textPrimary">
              Company: {companyName}
            </Typography>
            <Typography
              variant="body1"
              color="textPrimary"
              style={{ marginBottom: "20px" }}
            >
              Price: Rs.{product.price}
            </Typography>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <Button
                  variant="contained"
                  onClick={handleAddToCart}
                  style={{ backgroundColor: "black", color: "white" }}
                >
                  Add to Cart
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={handleBuyNow}
                  style={{  color: "white",backgroundColor:"chocolate" }}
                >
                  Buy Now
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Paper>
    <HomeButton to="/">← </HomeButton>

    </>
  );
};

export default ProductDescriptionPage;
