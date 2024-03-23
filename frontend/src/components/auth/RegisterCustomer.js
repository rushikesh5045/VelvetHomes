import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Container = styled.div`
  display: flex;
  position: relative;
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
  z-index: 1;
  @media (max-width: 768px) {
    img {
      display: none;
    }
  }
`;

const FormContainer = styled(motion.div)`
  position: relative;
  width: 300px;
  padding: 20px;
  margin-bottom: 20px;
  font-size: 2em;

  @media (max-width: 768px) {
    text-align: center;
    margin-top: 40px;
  }
`;

const Input = styled.input`
  width: 90%;
  margin-bottom: 10px;
  padding: 8px;

  height: 2em;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 2px;
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

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    pincode: "",
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

  const validatePincode = (pincode) => {
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(pincode);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    switch (name) {
      case "name":
        errorMessage = value.trim() === "" ? "Name must not be empty." : "";
        break;
      case "email":
        errorMessage = !validateEmail(value) ? "Invalid email format." : "";
        break;
      case "phone":
        errorMessage = !validatePhone(value)
          ? "Phone number must be 10 digits."
          : "";
        break;
      case "pincode":
        errorMessage = !validatePincode(value)
          ? "Pincode must be 6 digits."
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
      console.log("Form has errors:", errors);
    } else {
      try {
        await axios.post(
          "https://velvethomes-bpj4.onrender.com/api/auth/register",
          formData
        );

        console.log("Form submitted successfully!");

        navigate("/login");
      } catch (error) {
        console.error("Error submitting form:", error);
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
        className="form"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
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
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <Input
              type="text"
              name="pincode"
              placeholder="Pin Code"
              value={formData.pincode}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.pincode && <ErrorMessage>{errors.pincode}</ErrorMessage>}
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
        <Button onClick={() => navigate("/register/company")}>
          Sign Up as Company
        </Button>
        <Button onClick={() => navigate("/register/admin")}>
          Sign Up as Admin
        </Button>
      </FormContainer>
      <HomeButton to="/">← Home</HomeButton>
    </Container>
  );
};

export default Signup;
