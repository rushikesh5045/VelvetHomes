// components/LandingPage/CategoriesSection.js
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './CategoriesSection.css'
const CategoriesSection = () => {
  const autoplaySpeed = 1500;
  const categories = [
    {
      title: "Furniture",
      description: "Explore our collection of stylish furniture.",
      image: "https://images2.alphacoders.com/270/270990.jpg",
    },
    {
      title: "Artifacts",
      description: "Discover unique artifacts for your home.",
      image:
        "https://www.bhg.com/thmb/mlI9QGGHXOesassCyoxhl0mB7Rs=/1244x0/filters:no_upscale():strip_icc()/green-shelves-books-coral-butterflies-jars-1ax21zg7aP-8-HPSI6yOyw-4d2630b5dd824c95b2000a2ef7ad9d4e.jpg",
    },
    {
      title: "Paints",
      description: "Find the perfect paint colors for your walls.",
      image:
        "https://www.housedigest.com/img/gallery/the-best-way-to-paint-over-dark-walls-and-lighten-up-your-home/l-intro-1659203809.jpg",
    },
    {
      title: "Sanitary",
      description: "Upgrade your bathroom with our sanitary products.",
      image:
        "https://www.lycosceramic.com/wp-content/uploads/2021/08/Stunning-Sanitary-ware-to-update-your-Bathroom.jpg",
    },
    {
      title:"Tiles",
      description:"Picture-Perfect tiles for your walls.",
      image:"https://www.kajariaceramics.com/concept-picture/high002327.jpg"
    }
  ];

  return (
    <section className="categories">
      <Carousel
        showStatus={false}
        showThumbs={false}
        infiniteLoop
        autoPlay
        interval={autoplaySpeed}
      >
        {categories.map((category, index) => (
          <div className="categoryItem"
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <img className="categoryImage"
              src={category.image}
              alt={category.title}
              style={{ maxWidth: "100%", height: "90vh" }}
            />
            <div className="categoryOverlay"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                color: "#e8dcdc",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <div className="categoryContent">
                <h3 className="categoryTitle"
                  style={{
                    fontFamily: "Sometype Mono",
                    fontSize: "8rem",
                    marginBottom: "10px",
                  }}
                >
                  {category.title}
                </h3>
                <p className="categoryDescription" style={{ fontSize: "1.2rem" }}>{category.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default CategoriesSection;
