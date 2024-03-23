import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Fade,
  Paper,
  Grow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate, Link } from "react-router-dom";
import "./CustomAppBar.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DialogContentText from "@mui/material/DialogContentText";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useCart } from "../../../../context/CartContext";
import MenuArray from "./MenuArray";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CustomAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#000",
}));
const menuStyles = {
  fontSize: "14px",
  padding: "12px 16px",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "#f1f1f1",
  },
};

const CustomAppBarComponent = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const userId = localStorage.getItem("userId");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    if (token && role === "user") {
      setIsLoggedIn(true);

      if (userName) {
        setUserName(userName);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    const successMessage = localStorage.getItem("successMessage");
    if (successMessage) {
      toast.success(successMessage, {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 2000,
      });
    }

    localStorage.removeItem("successMessage");
  }, [cartItems]);

  const loginHandler = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      localStorage.removeItem("successMessage");
      navigate("/");
      setIsLoggedIn(false);
    } else {
      navigate("/login");
    }
  };
  const handleCartModalOpen = () => {
    setIsCartModalOpen(true);
  };

  const handleCartModalClose = () => {
    setIsCartModalOpen(false);
  };

  const handleIncreaseQuantity = async (index) => {
    addToCart(cartItems[index]);
    await updateCartInDatabase(cartItems);
  };

  const handleDecreaseQuantity = async (index) => {
    removeFromCart(cartItems[index]);
    await updateCartInDatabase(cartItems);
  };

  const handlePlaceOrder = async () => {
    await placeOrderInDatabase(cartItems);

    setOrderSuccess(true);
    clearCart();

    setTimeout(() => {
      setOrderSuccess(false);
      handleCartModalClose();
    }, 3000);
  };

  const updateCartInDatabase = async (updatedCart) => {
    const userId = localStorage.getItem("userId");

    try {
      await fetch(
        "https://velvethomes-bpj4.onrender.com/input/user/updateCart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userId, cart: updatedCart }),
        }
      );

      console.log("Cart updated in the database.");
    } catch (error) {
      console.error("Error updating cart in the database:", error);
    }
  };

  const placeOrderInDatabase = async (cartItems) => {
    const userId = localStorage.getItem("userId");

    try {
      await fetch(
        "https://velvethomes-bpj4.onrender.com/input/user/placeOrder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            cart: cartItems.map((item) => ({
              product: item.productId,
              quantity: item.quantity,
            })),
          }),
        }
      );

      console.log("Order placed, cart items moved to order history.");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const menuItems = MenuArray;
  const [anchorEl, setAnchorEl] = useState({});
  const capitalizedUserName =
    userName.charAt(0).toUpperCase() + userName.slice(1);
  const handleMenuOpen = (event, menuId) => {
    setAnchorEl((prev) => ({ ...prev, [menuId]: event.currentTarget }));
  };

  const handleMenuClose = (menuId) => {
    setAnchorEl((prev) => ({ ...prev, [menuId]: null }));
  };

  const handleMenuItemClick = (item, menuId) => {
    console.log(`Clicked on ${item}`);
    handleMenuClose(menuId);
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <>
      <CustomAppBar position="static" className="custom-app-bar">
        <Toolbar style={{ justifyContent: "space-between" }} className="tool">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6" className="app-title">
              VelvetHomes
            </Typography>
          </Link>
          <div className="menu-buttons">
            {menuItems.map((menu) => (
              <Button
                key={menu.id}
                color="inherit"
                aria-controls={menu.id}
                aria-haspopup="true"
                onClick={(e) => handleMenuOpen(e, menu.id)}
                className="menu-button"
              >
                {menu.label}
              </Button>
            ))}
            {menuItems.map((menu) => (
              <Menu
                key={menu.id}
                anchorEl={anchorEl[menu.id]}
                keepMounted
                open={Boolean(anchorEl[menu.id])}
                onClose={() => handleMenuClose(menu.id)}
                TransitionComponent={Fade}
                PaperComponent={(props) => <Paper {...props} />}
              >
                <div>
                  {menu.subMenuItems.map((item) => (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Link
                        to={`/catList/${item}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <MenuItem
                          key={item}
                          onClick={() => handleMenuItemClick(item, menu.id)}
                          sx={menuStyles}
                        >
                          {item}
                        </MenuItem>
                      </Link>
                    </div>
                  ))}
                </div>
              </Menu>
            ))}
          </div>
          {isLoggedIn && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Link
                to={`/user/${userId}`}
                style={{ display: "flex", alignItems: "center" }}
              >
                <AccountCircleIcon style={{ color: "white" }} />
                <div>
                  <Typography
                    variant="body2"
                    className="user-welcome"
                    style={{ color: "white", marginLeft: "10px" }}
                  >
                    Welcome , {capitalizedUserName}
                  </Typography>
                </div>
              </Link>

              <Button
                color="inherit"
                className="cart-button"
                onClick={handleCartModalOpen}
              >
                <ShoppingCartIcon />

                {cartItems.length > 0 && (
                  <span className="cart-item-count">{cartItems.length}</span>
                )}
              </Button>
            </div>
          )}
          <Button
            onClick={loginHandler}
            color="inherit"
            className="login-button"
            style={{ margin: "2px", textAlign: "center" }}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </Button>
        </Toolbar>
      </CustomAppBar>

      <Dialog
        open={isCartModalOpen}
        onClose={handleCartModalClose}
        maxWidth="md"
      >
        <DialogTitle>
          Shopping Cart
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCartModalClose}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {orderSuccess ? (
            <Grow
              in={orderSuccess}
              style={{ transformOrigin: "0 0 0" }}
              timeout={500}
            >
              <DialogContentText
                sx={{ padding: "16px", textAlign: "center", color: "#4CAF50" }}
              >
                Order placed successfully! ✔
              </DialogContentText>
            </Grow>
          ) : (
            <>
              {cartItems.length === 0 ? (
                <DialogContentText
                  sx={{ padding: "16px", textAlign: "center" }}
                >
                  Your cart is empty.
                </DialogContentText>
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ textAlign: "center" }}>
                            Image
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            Title
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            Price
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            Quantity
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            Total
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cartItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <img
                                src={item.displayImage}
                                alt={`Product ${index + 1}`}
                                style={{ maxWidth: "50px", maxHeight: "50px" }}
                              />
                            </TableCell>
                            <TableCell>{item.title.toLowerCase()}</TableCell>
                            <TableCell>Rs. {item.price}</TableCell>
                            <TableCell>
                              <Button
                                onClick={() => handleDecreaseQuantity(index)}
                              >
                                -
                              </Button>
                              {item.quantity}
                              <Button
                                onClick={() => handleIncreaseQuantity(index)}
                              >
                                +
                              </Button>
                            </TableCell>
                            <TableCell>
                              Rs. {item.price * item.quantity}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <div
                    style={{
                      marginTop: "16px",
                      textAlign: "right",
                      fontFamily: "'Roboto Mono', monospace",
                    }}
                  >
                    <Typography>
                      Total: Rs. {calculateTotal().toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handlePlaceOrder}
                      style={{ marginTop: "8px", backgroundColor: "black" }}
                    >
                      Place Order
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions></DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default CustomAppBarComponent;
