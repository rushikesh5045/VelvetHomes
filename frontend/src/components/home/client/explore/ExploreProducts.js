import React, { useState, useEffect } from "react";
import { Grid, Typography, CircularProgress, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";
import CustomAppBarComponent from "../AppBar/CustomAppBar";
import FilterComponent from "./FilterComponent";
import SortComponent from "./SortComponent";

const ExplorePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleProducts, setVisibleProducts] = useState({});
  const [categories, setCategories] = useState([]);
  const [uniqueCompanies, setUniqueCompanies] = useState([]);
  const [globalFilter, setGlobalFilter] = useState({
    minPrice: "",
    maxPrice: "",
    company: "",
  });
  const [globalSort, setGlobalSort] = useState({
    sortBy: "price",
    sortOrder: "asc",
  });
  const [companyDetails, setCompanyDetails] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://velvethomes-bpj4.onrender.com/input/products"
        );
        setProducts(response.data);
        setLoading(false);
        const uniqueCategories = [
          ...new Set(response.data.map((product) => product.cat)),
        ];
        setCategories(uniqueCategories);

        const initialVisibleProducts = {};
        uniqueCategories.forEach((category) => {
          initialVisibleProducts[category] = 4;
        });
        setVisibleProducts(initialVisibleProducts);

        const uniqueCompanies = [
          ...new Set(response.data.map((product) => product.company)),
        ];
        setUniqueCompanies(uniqueCompanies);

        const companyDetailsMap = {};
        await Promise.all(
          uniqueCompanies.map(async (companyId) => {
            const companyResponse = await axios.get(
              `https://velvethomes-bpj4.onrender.com/company/${companyId}`
            );
            companyDetailsMap[companyId] = companyResponse.data.companyName;
          })
        );
        setCompanyDetails(companyDetailsMap);
      } catch (error) {
        console.error("Error fetching products:", error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGlobalFilterChange = ({ minPrice, maxPrice, company }) => {
    setGlobalFilter({ minPrice, maxPrice, company });
  };

  const handleGlobalSortChange = ({ sortBy, sortOrder }) => {
    setGlobalSort({ sortBy, sortOrder });
  };

  const handleSeeMore = (category) => {
    setVisibleProducts((prevVisibleProducts) => ({
      ...prevVisibleProducts,
      [category]: prevVisibleProducts[category] + 10,
    }));
  };

  return (
    <>
      <CustomAppBarComponent />
      <div>
        <Box display="flex" justifyContent="space-around" alignItems="center">
          <Typography mt={2}>Filter</Typography>
          <Typography mt={2}>Sort</Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-evenly"
          alignItems="start"
          mb={3}
        >
          <FilterComponent
            onFilterChange={handleGlobalFilterChange}
            uniqueCompanies={uniqueCompanies}
            companyDetailsMap={companyDetails}
          />
          <SortComponent onSortChange={handleGlobalSortChange} />
        </Box>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress style={{ color: "black" }} />
          </div>
        ) : (
          <div>
            {categories
              .filter((category) =>
                products.some(
                  (product) =>
                    product.cat === category &&
                    (globalFilter.minPrice === "" ||
                      product.price >= globalFilter.minPrice) &&
                    (globalFilter.maxPrice === "" ||
                      product.price <= globalFilter.maxPrice) &&
                    (globalFilter.company === "" ||
                      product.company === globalFilter.company)
                )
              )
              .map((category) => (
                <div key={category}>
                  <Typography
                    variant="h5"
                    style={{ textAlign: "center", marginTop: "20px" }}
                  >
                    {category}
                  </Typography>
                  <hr />
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    spacing={3}
                  >
                    {products
                      .filter((product) => product.cat === category)
                      .filter((product) => {
                        const { minPrice, maxPrice, company } = globalFilter;
                        return (
                          (minPrice === "" || product.price >= minPrice) &&
                          (maxPrice === "" || product.price <= maxPrice) &&
                          (company === "" || product.company === company)
                        );
                      })
                      .sort((a, b) => {
                        const { sortBy, sortOrder } = globalSort;
                        if (sortOrder === "asc") {
                          return a[sortBy] - b[sortBy];
                        } else {
                          return b[sortBy] - a[sortBy];
                        }
                      })
                      .slice(0, visibleProducts[category])
                      .map((product) => (
                        <Grid item key={product._id}>
                          <Link
                            to={`/products/${product._id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            <ProductCard
                              product={{
                                ...product,
                                company: companyDetails[product.company],
                              }}
                            />
                          </Link>
                        </Grid>
                      ))}
                  </Grid>
                  {visibleProducts[category] <
                    products
                      .filter((product) => product.cat === category)
                      .filter((product) => {
                        const { minPrice, maxPrice, company } = globalFilter;
                        return (
                          (minPrice === "" || product.price >= minPrice) &&
                          (maxPrice === "" || product.price <= maxPrice) &&
                          (company === "" || product.company === company)
                        );
                      }).length && (
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                      <Button
                        variant="outlined"
                        onClick={() => handleSeeMore(category)}
                        style={{
                          backgroundColor: "black",
                          color: "whitesmoke",
                        }}
                      >
                        See More
                      </Button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ExplorePage;
