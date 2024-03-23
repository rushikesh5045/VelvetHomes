import React from "react";
import { Container, Typography } from "@mui/material";

import CategoriesSection from "./CategoriesSection";
import HeroSection from "./HeroSection";

import CustomAppBar from "../AppBar/CustomAppBar";
import MainCategorySection from "../../category/MainCategorySection";
import Footer from "../footer/Footer";

const useStyles = {
  hero: {
    backgroundColor: "#f4f4f4",
    padding: "60px 0",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  heroText: {
    fontSize: "1.25rem",
    marginBottom: "20px",
  },
  heroButton: {
    fontSize: "1rem",
    backgroundColor: "#000",
  },
  testimonial: {
    backgroundColor: "#f4f4f4",
    padding: "40px 0",
    textAlign: "center",
  },
  testimonialTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "30px",
  },
};

const LandingPage = () => {
  return (
    <div style={{ fontFamily: "Poppins, sans-serif !important" }}>
      <CustomAppBar />
      <Container>
        <main>
          <CategoriesSection />
          <HeroSection />
          <MainCategorySection />
          <section style={useStyles.testimonial}>
            <Typography variant="h2" style={useStyles.testimonialTitle}>
              What Our Customers Say
            </Typography>
            <div className="testimonial">
              <Typography variant="body2" color="textSecondary">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua."
              </Typography>
              <Typography variant="body2" color="textPrimary">
                - Customer Name 1
              </Typography>
            </div>
          </section>
        </main>
      </Container>
      <Footer />
    </div>
  );
};

export default LandingPage;
