import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { CSVLink } from "react-csv";

const UserPurchaseList = ({ companyId, onUserClick }) => {
  const [userPurchases, setUserPurchases] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserPurchases = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/company/purchases/${companyId}`
        );
        setUserPurchases(response.data);

        const productIdArray = response.data.reduce((acc, user) => {
          user.purchases.forEach((purchase) => {
            purchase.products.forEach((product) => {
              acc.push(product.productId);
            });
          });
          return acc;
        }, []);

        const productDetailsArray = await Promise.all(
          productIdArray.map(async (productId) => {
            try {
              const productDetailResponse = await axios.get(
                `http://localhost:8000/input/${productId}`
              );
              return productDetailResponse.data;
            } catch (error) {
              console.error("Error fetching product details:", error);
              return null;
            }
          })
        );

        setProductDetails(productDetailsArray);
        setIsLoading(false); // Set loading state to false after fetching data
      } catch (error) {
        console.error("Error fetching user purchases:", error);
      }
    };

    fetchUserPurchases();
  }, [companyId]);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleUserClick = (user) => {
    setSelectedUser((prevSelectedUser) =>
      prevSelectedUser && prevSelectedUser._id === user._id
        ? null
        : user
    );
    onUserClick(user);
  };

  const handleDownloadCSV = () => {
    // Download CSV logic remains the same...
  };

  return (
    <div style={{ fontFamily: "Arial" }}>
      <h2 style={styles.heading}>Customers</h2>
      {isLoading ? ( // Render CircularProgress if loading
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress  style={{ color: "black" }}/>
        </div>
      ) : (
        userPurchases.map((user, userIndex) => (
          <div key={user._id} style={styles.userItem}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => handleUserClick(user)}
            >
              <div style={{ display: "flex",alignItems:"center",justifyContent:"space-between",width:"100%" }}>
                <div>
                  <p style={{ fontSize: "18px", fontWeight: "bold", margin: "0" }}>
                    {user.name}
                  </p>
                  <p style={{ fontSize: "14px", margin: "0", color: "#757575" }}>
                    {user.email}
                  </p>
                </div>
                <div style={{ }}>
                  {selectedUser && selectedUser._id === user._id ? (
                    <ExpandLessIcon style={{ fontSize: 24, color: "#3f51b5" }} />
                  ) : (
                    <ExpandMoreIcon style={{ fontSize: 24, color: "#3f51b5" }} />
                  )}
                </div>
              </div>
            </div>
            {selectedUser && selectedUser._id === user._id && (
              <div style={styles.orderHistory}>
                <h3>Order History:</h3>
                <TableContainer component={Paper} style={styles.tableContainer}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Product ID</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Product Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {user.purchases.map((purchase, purchaseIndex) => (
                        purchase.products.map((product, productIndex) => {
                          const filteredProductDetails = productDetails.find(
                            (detail) =>
                              detail._id === product.productId &&
                              detail.company === companyId
                          );
                          if (filteredProductDetails) {
                            return (
                              <TableRow
                                key={`${userIndex}-${purchaseIndex}-${productIndex}`}
                              >
                                <TableCell>
                                  {productIndex === 0 ? (
                                    new Date(purchase.date).toLocaleDateString()
                                  ) : (
                                    null
                                  )}
                                </TableCell>
                                <TableCell>{product.productId}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img
                                      src={filteredProductDetails.dispimg} // Access dispimg property directly
                                      alt={filteredProductDetails.title}
                                      style={{ height: "50px", width: "50px", marginRight: '10px' }}
                                    />
                                    <div>
                                      <p><strong>Title:</strong> {capitalizeFirstLetter(filteredProductDetails.title)}</p>
                                      <p><strong>Price:</strong> Rs.{filteredProductDetails.price}</p>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          } else {
                            return null;
                          }
                        })
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </div>
        ))
      )}

      <div>
        <button style={{color:"white",backgroundColor:"green",padding:"10px",border:"none",borderRadius:"10px",cursor:"pointer"}} onClick={handleDownloadCSV}>⬇ Download User Purchases</button>
      </div>
    </div>
  );
};

const styles = {
  heading: {
    fontSize: "24px",
    textAlign: "center",
    marginBottom: "20px",
    fontFamily: "Arial, sans-serif",
  },
  userItem: {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#f8f8f8",
    borderRadius: "6px",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
  },
  userDetail: {
    fontSize: "16px",
    margin: "8px 0",
  },
  orderHistory: {
    marginTop: "15px",
  },
  purchaseItem: {
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "#ebebeb",
    borderRadius: "4px",
    boxShadow: "0 0 3px rgba(0, 0, 0, 0.1)",
  },
  productList: {
    listStyle: "none",
    padding: "0",
    marginLeft: "20px",
  },
  tableContainer: {
    marginTop: "15px",
  },
};

export default UserPurchaseList;
