import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import NewProductCard from "./NewProductCard";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardActions from "@mui/joy/CardActions";
import Typography from "@mui/joy/Typography";
import SvgIcon from "@mui/joy/SvgIcon";

const CompanyHome = () => {
  const { companyId } = useParams();
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productSales, setProductSales] = useState([]);
  const [buyersArray, setBuyersArray] = useState([]);
  const [lastPurchaseDate, setLastPurchaseDate] = useState([]);

  useEffect(() => {
    const fetchRecentPurchases = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://velvethomes-bpj4.onrender.com/company/purchases/${companyId}`
        );
        const allPurchases = response.data
          .flatMap((user) => user.purchases)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        const top10Purchases = allPurchases.slice(0, 10);
        const productIdArray = top10Purchases.flatMap((purchase) =>
          purchase.products.map((product) => product.productId)
        );
        const productDetailsArray = await Promise.all(
          productIdArray.map(async (productId) => {
            try {
              const productDetailResponse = await axios.get(
                `https://velvethomes-bpj4.onrender.com/input/${productId}`
              );
              return productDetailResponse.data;
            } catch (error) {
              console.error("Error fetching product details:", error);
              return null;
            }
          })
        );
        const filteredProductDetails = productDetailsArray.filter(
          (productDetail, index, array) =>
            productDetail &&
            productDetail.company === companyId &&
            array.findIndex(
              (item) => item && item._id === productDetail._id
            ) === index
        );
        setRecentPurchases(top10Purchases);
        setProductDetails(filteredProductDetails);
      } catch (error) {
        console.error("Error fetching recent purchases:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProductSales = async () => {
      try {
        const response = await axios.get(
          `https://velvethomes-bpj4.onrender.com/company/sales/${companyId}`
        );
        setProductSales(response.data);
      } catch (error) {
        console.error("Error fetching product sales:", error);
      }
    };

    fetchRecentPurchases();
    fetchProductSales();
  }, [companyId]);

  const productsWithSales = productSales.filter((sale) => sale.sales > 0);
  const [seeBreakDown, setSeeBreakDown] = useState(false);
  const seeBreakDownHandler = () => {
    setSeeBreakDown(!seeBreakDown);
  };
  const totalRevenue = productsWithSales.reduce((total, product) => {
    return total + product.sales * product.price;
  }, 0);
  const sortedProductsWithSales = productsWithSales.sort(
    (a, b) => b.sales - a.sales
  );
  const mostSold = sortedProductsWithSales[0];
  const mostSoldProductDetails = productDetails.find(
    (product) => product._id === mostSold?.productId
  );

  useEffect(() => {
    if (mostSoldProductDetails) {
      setBuyersArray(mostSoldProductDetails.buyers);
    }
    if (mostSoldProductDetails) {
      const fetchBuyers = async () => {
        try {
          const response = await axios.get(
            `https://velvethomes-bpj4.onrender.com/user/${
              buyersArray[buyersArray.length - 1]
            }`
          );
          const userData = response.data.user;
          const userOrderHistory = userData.orderHistory;
          setLastPurchaseDate(
            userData.orderHistory[userOrderHistory.length - 1].date
          );
        } catch (error) {
          console.error("Error fetching buyer details:", error);
        }
      };

      if (buyersArray[buyersArray.length - 1]) {
        fetchBuyers();
      }
    }
  }, [mostSoldProductDetails, buyersArray]);

  return (
    <>
      <div className="home">
        <h1 style={{ fontFamily: "monospace", color: "rgb(110 27 27)" }}>
          Recently bought products
        </h1>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress style={{ color: "black" }} />
          </div>
        ) : (
          <div className="recent-purchases-container">
            {productDetails.map((purchase, index) => (
              <NewProductCard
                key={purchase._id}
                product={{
                  dispimg: purchase.dispimg,
                  title: purchase.title,
                  cat: purchase.cat,
                  price: purchase.price,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="home">
        <h1 style={{ fontFamily: "monospace", color: "rgb(110 27 27)" }}>
          Most bought products
        </h1>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress style={{ color: "black" }} />
          </div>
        ) : (
          <div className="most-purchases-container">
            <div>
              {mostSoldProductDetails && (
                <NewProductCard
                  key={mostSoldProductDetails._id}
                  product={{
                    dispimg: mostSoldProductDetails.dispimg,
                    title: mostSoldProductDetails.title,
                    cat: mostSoldProductDetails.cat,
                    price: mostSoldProductDetails.price,
                  }}
                />
              )}
            </div>
            <div className="most-sold-details">
              {mostSoldProductDetails && (
                <>
                  <p
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      fontSize: "larger",
                      padding: "1rem",
                    }}
                  >
                    Last purchased:{" "}
                    {lastPurchaseDate
                      ? new Date(lastPurchaseDate).toLocaleString()
                      : "N/A"}
                  </p>
                  <p
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      fontSize: "larger",
                      padding: "1rem",
                    }}
                  >
                    Total items sold: {mostSold ? mostSold.sales : 0}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="home">
        <h1 style={{ fontFamily: "monospace", color: "rgb(110 27 27)" }}>
          Sales
        </h1>
        <div>
          <div style={{ display: "flex", gap: "20px" }}>
            <div>
              <Card
                variant="solid"
                invertedColors
                style={{ width: "200px", backgroundColor: "black" }}
              >
                <CardContent orientation="horizontal">
                  <CircularProgress size="lg" determinate value={20}>
                    <SvgIcon>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                        />
                      </svg>
                    </SvgIcon>
                  </CircularProgress>
                  <CardContent>
                    <Typography level="body-md">Total Revenue</Typography>
                    <Typography level="h2">₹ {totalRevenue}</Typography>
                  </CardContent>
                </CardContent>
                <CardActions>
                  <Button
                    variant="solid"
                    size="sm"
                    onClick={seeBreakDownHandler}
                  >
                    See breakdown
                  </Button>
                </CardActions>
              </Card>
            </div>
            <div>
              {seeBreakDown && (
                <table className="product-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Sales</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsWithSales.map((product) => (
                      <tr key={product.productId}>
                        <td>{product.title}</td>
                        <td>₹ {product.price.toFixed(2)}</td>
                        <td>{product.sales}</td>
                        <td>₹ {(product.price * product.sales).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        <h1 style={{ fontFamily: "monospace", color: "rgb(110 27 27)" }}>
          Last Month Sales
        </h1>
        <h1 style={{ fontFamily: "monospace", color: "rgb(110 27 27)" }}>
          LifeTimeSales(a graph with filter of finanicial year) a axis months y
          axis amount.
        </h1>
      </div>
    </>
  );
};

export default CompanyHome;
