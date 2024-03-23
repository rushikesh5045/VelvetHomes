import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import CustomAppBarComponent from "../AppBar/CustomAppBar";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";

import PhoneIcon from "@mui/icons-material/Phone";
import CircularProgress from "@mui/material/CircularProgress";

const styles = {
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#fff",

    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "20px",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  userInfo: {
    marginBottom: "20px",
    padding: "20px",
    backgroundColor: "#f8f8f8",

    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
  },
  userDetailsText: {
    color: "#000",
    fontSize: "16px",
    margin: "8px 0",
  },
  orderHistoryHeading: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#333",

    fontFamily: "sans-serif",
  },
  orderContainer: {
    fontFamily: "monospace",
    fontWeight: "lighter",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginBottom: "20px",
    padding: "10px",
    transition: "box-shadow 0.3s ease-in-out",

    ":hover": {
      boxShadow: "5 5 15px rgba(0, 0, 0, 0.2)",
    },
  },
  orderText: {
    color: "#000",
    fontSize: "10px",
    margin: "8px 0",
  },
  productList: {
    listStyle: "none",
    padding: 0,
    marginLeft: "20px",
  },
  productItem: {
    listStyle: "none",

    color: "#333",

    borderBottom: "1px solid #ccc",
    padding: "10px",
    transition: "background-color 0.3s ease-in-out",

    ":hover": {
      backgroundColor: "#f8f8f8",
    },
  },
};

const UserProfilePage = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState();
  const [orderDetails, setOrderDetails] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(orderDetails);

  const handleSearch = () => {
    const filtered = orderDetails.filter((order) =>
      order.products.some((product) =>
        product.details.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    setFilteredOrders(filtered);
  };

  const highlightText = (text, query) => {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      (match) => `<span style="background-color: yellow">${match}</span>`
    );
  };

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredOrders(orderDetails);
    } else {
      handleSearch();
    }
  }, [searchQuery, orderDetails]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) {
      navigate("/login");
    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `https://velvethomes-bpj4.onrender.com/input/user/${userId}`
        );
        setUserDetails(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserDetails();
  }, [userId, navigate]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (userDetails) {
        try {
          const ordersWithDetails = await Promise.all(
            userDetails.orderHistory.map(async (order) => {
              const productsWithDetails = await renderProductDetails(
                order.products
              );
              return { ...order, products: productsWithDetails };
            })
          );

          const sortedOrders = ordersWithDetails.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );

          setOrderDetails(sortedOrders);
        } catch (error) {
          console.error("Error fetching order details:", error);
        } finally {
          setLoadingOrders(false);
        }
      }
    };

    fetchOrderDetails();
  }, [userDetails]);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(
        `https://velvethomes-bpj4.onrender.com/details/product/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  };

  const renderProductDetails = async (products) => {
    const productDetails = await Promise.all(
      products.map(async (product) => {
        const details = await fetchProductDetails(product.productId);
        return { ...product, details };
      })
    );

    return productDetails;
  };

  const calculateTotalAmount = (order) => {
    if (order.products && order.products.length > 0) {
      return order.products.reduce((total, product) => {
        if (product.details) {
          return total + product.details.price * product.quantity;
        } else {
          return total;
        }
      }, 0);
    } else {
      return 0;
    }
  };

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (loadingUser || loadingOrders) {
    return (
      <div style={{ textAlign: "center", marginTop: "25%" }}>
        <CircularProgress style={{ color: "black" }} />
        <p style={{ color: "black", fontFamily: "monospace" }}>
          Getting User Details...
        </p>
      </div>
    );
  }

  return (
    <>
      <CustomAppBarComponent />
      <div style={styles.container}>
        <h1 style={styles.heading}>My Profile</h1>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <input
            type="text"
            placeholder="Search for Orders"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: "black 1 px solid",
              borderRadius: "10px",
              height: "30px",
              width: "400px",
              textAlign: "center",
              margin: "5px",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              fontSize: "10px",
              fontFamily: "monospace",
              backgroundColor: "black",
              color: "white",
              borderRadius: "5px",
              padding: "8px",
            }}
          >
            Search
          </button>
        </div>

        {userDetails && (
          <div style={styles.userInfo}>
            <p style={styles.userDetailsText}>
              <PersonIcon style={{ marginLeft: "35%", marginTop: "1px" }} />
              <span
                style={{
                  fontFamily: "Sometype mono",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Name:{" "}
                {userDetails.name.charAt(0).toUpperCase() +
                  userDetails.name.slice(1)}
              </span>
            </p>
            <p style={styles.userDetailsText}>
              <EmailIcon style={{ marginLeft: "35%", marginTop: "1px" }} />
              <span
                style={{
                  fontFamily: "Sometype mono",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Email: {userDetails.email}
              </span>
            </p>
            <p style={styles.userDetailsText}>
              <PhoneIcon style={{ marginLeft: "35%", marginTop: "1px" }} />
              <span
                style={{
                  fontFamily: "Sometype mono",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Phone: {userDetails.phone}
              </span>
            </p>
          </div>
        )}

        <h2 style={styles.orderHistoryHeading}>Order History</h2>
        {filteredOrders.length > 0 ? (
          <ul style={styles.orderList}>
            {filteredOrders.map((order) => (
              <li key={order._id} style={styles.orderContainer}>
                <p style={styles.orderText}>Order ID: {order._id}</p>
                <p style={styles.orderText}>
                  Date: {new Date(order.date).toLocaleString()}
                </p>
                <ul style={styles.productList}>
                  {order.products.map((product) => (
                    <li key={product.productId} style={styles.productItem}>
                      <Link
                        to={`/products/${product.productId}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={product.details.dispimg}
                            alt={product.details.title}
                            style={{
                              height: "150px",
                              width: "25%",
                              justifyContent: "flex-start",
                            }}
                          />
                          <div style={{ marginLeft: "2rem" }}>
                            <p style={styles.userDetailsText}>
                              <span style={{ fontWeight: "bold" }}>Title:</span>{" "}
                              <span
                                style={{
                                  color: "#717171f8",
                                  fontSize: "0.9rem",
                                }}
                              >
                                {capitalizeWords(product.details.title)}
                              </span>
                            </p>
                            <p style={styles.userDetailsText}>
                              <span style={{ fontWeight: "bold" }}>Price:</span>{" "}
                              <span
                                style={{
                                  color: "#717171f8",
                                  fontSize: "0.9rem",
                                }}
                              >
                                Rs.{product.details.price}
                              </span>
                            </p>
                            <p style={styles.userDetailsText}>
                              <span style={{ fontWeight: "bold" }}>
                                Quantity:
                              </span>{" "}
                              <span
                                style={{
                                  color: "#717171f8",
                                  fontSize: "0.9rem",
                                }}
                              >
                                {product.quantity}
                              </span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div style={styles.userDetailsText}>
                  <p
                    style={{
                      fontFamily: "sans-serif",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Bought For:{" "}
                    <span style={{ color: "green" }}>
                      Rs.{calculateTotalAmount(order)}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div style={styles.userDetailsText}>
            {userDetails
              ? "No matching orders found for this user"
              : "User details not available"}
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfilePage;
