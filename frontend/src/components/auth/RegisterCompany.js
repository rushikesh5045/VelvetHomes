import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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
  font-size: 2em;
`;

const Input = styled.input`
  width: 90%;
  margin-bottom: 10px;
  padding: 8px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 2px;
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

const CompanySignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    companyName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    switch (name) {
      case "companyName":
        errorMessage =
          value.trim() === "" ? "Company Name must not be empty." : "";
        break;
      case "email":
        errorMessage = !validateEmail(value) ? "Invalid email format." : "";
        break;
      case "phone":
        errorMessage = !validatePhone(value)
          ? "Phone number must be 10 digits."
          : "";
        break;
      case "password":
        errorMessage = !validatePassword(value)
          ? "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 digit, and 1 special symbol."
          : "";
        break;
      case "confirmPassword":
        errorMessage =
          value !== formData.password ? "Passwords do not match." : "";
        break;
      default:
        break;
    }

    setErrors({ ...errors, [name]: errorMessage });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key in formData) {
      handleBlur({ target: { name: key, value: formData[key] } });
    }

    if (Object.values(errors).some((error) => error !== "")) {
      console.log("Company Signup Form has errors:", errors);
    } else {
      try {
        await axios.post(
          "https://velvethomes-bpj4.onrender.com/api/auth/register/company",
          formData
        );

        console.log("Company Signup Form submitted successfully!");
        navigate("/login");
      } catch (error) {
        console.error("Error submitting Company Signup Form:", error);
      }
    }
  };

  return (
    <Container>
      <LeftDiv>
        <img
          style={{
            height: "500px",
            width: "90%",
            borderRadius: "15px",
          }}
          src={require("./logo.png")}
          alt="logo"
        />
      </LeftDiv>

      <FormContainer
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Company Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <Input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.companyName && (
              <ErrorMessage>{errors.companyName}</ErrorMessage>
            )}
          </div>
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
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
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
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </div>
          <div>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.confirmPassword && (
              <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
            )}
          </div>
          <Button type="submit">Sign Up</Button>
        </form>
        <Button onClick={() => navigate("/login")}>
          Have an account? Login
        </Button>
        <Button onClick={() => navigate("/register/customer")}>
          Sign Up as Customer
        </Button>
        <Button onClick={() => navigate("/register/admin")}>
          Sign Up as Admin
        </Button>
      </FormContainer>
      <HomeButton to="/">← Home</HomeButton>
    </Container>
  );
};

export default CompanySignup;
