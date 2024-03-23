import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f4;
  font-family: "Poppins", sans-serif;
`;

const LeftDiv = styled.div`
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  border-radius: 10px;

  @media (max-width: 768px) {
    img {
      display: none;
    }
  }
`;

const FormContainer = styled(motion.div)`
  width: 300px;
  padding: 20px;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Input = styled.input`
  width: 90%;
  margin-bottom: 10px;
  padding: 8px;
`;

const Button = styled.button`
  width: 100%;
  height: max-content;
  padding: 10px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 5px;
  font-size: 0.9rem;
`;

const HomeButton = styled(Link)`
  position: absolute;
  top: 10px;
  left: 10px;
  display: block;
  text-decoration: none;
  width: 100px;
  padding: 10px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
`;
const ErrorMessage = styled.p`
  color: red;
  font-size: 0.8rem;
  margin-top: 4px;
`;

const Login = () => {
  const navigate = useNavigate();
  const [, setRedirectingToSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    switch (name) {
      case "email":
        errorMessage = !validateEmail(value) ? "Invalid email format." : "";
        break;
      case "password":
        errorMessage = value.trim() === "" ? "Password must not be empty." : "";
        break;
      default:
        break;
    }

    setErrors({ ...errors, [name]: errorMessage });
  };

  const validateForm = () => {
    let valid = true;

    if (!validateEmail(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format.",
      }));
      valid = false;
    }

    if (formData.password.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must not be empty.",
      }));
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "https://velvethomes-bpj4.onrender.com/api/auth/login",
        formData
      );

      const { token, role, username, finalId } = response.data;

      console.log("Login successful!");
      console.log("JWT Token:", token);
      console.log("Username:", username);
      const successMessage = "Login Successful";

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("successMessage", successMessage);

      if (role === "user") {
        localStorage.setItem("username", username);
        localStorage.setItem("userId", finalId);
      } else if (role === "company") {
        localStorage.setItem("companyName", username);
        localStorage.setItem("companyId", finalId);
      } else if (role === "admin") {
        localStorage.setItem("adminName", username);
      }

      if (role === "user") {
        navigate("/");
      } else if (role === "company") {
        navigate("/home");
      } else if (role === "admin") {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Error logging in:", error);

      toast.error("No User Found. Redirecting to SignUp...", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });

      setRedirectingToSignup(true);

      setTimeout(() => {
        navigate("/register/customer");
      }, 4000);
    }
  };

  return (
    <Container>
      <LeftDiv>
        <img
          style={{
            height: "400px",
            width: "90%",
            objectFit: "cover",
            borderRadius: "20px",
          }}
          src={require("./logo.png")}
          alt="logo"
        />
      </LeftDiv>
      <FormContainer
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </div>
            <div>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password && (
                <ErrorMessage>{errors.password}</ErrorMessage>
              )}
            </div>
            <Button type="submit">Login</Button>
          </form>
        </div>

        <Button onClick={() => navigate("/register/customer")}>
          Don't Have an account? Sign Up
        </Button>
      </FormContainer>
      <HomeButton to="/">← Home</HomeButton>
      <ToastContainer />
    </Container>
  );
};

export default Login;
