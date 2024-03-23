const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Company = require("../models/Company");
const Admin = require("../models/Admin");
const jwtSecretKey = "GV^%&ghTF556756787686tghghvGFH";

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, address, pincode, password, confirmPassword } =
      req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      phone,
      address,
      pincode,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/register/company", async (req, res) => {
  try {
    const { companyName, email, phone, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ error: "Company already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = new Company({
      companyName,
      email,
      phone,
      password: hashedPassword,
    });

    await company.save();

    res.json({ message: "Company registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/register/admin", async (req, res) => {
  try {
    const { adminName, email, phone, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      adminName,
      email,
      phone,
      password: hashedPassword,
    });

    await admin.save();

    res.json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const company = await Company.findOne({ email });
    const admin = await Admin.findOne({ email });

    const role = user ? "user" : company ? "company" : admin ? "admin" : null;

    if (!role) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userToCheck =
      role === "user" ? user : role === "company" ? company : admin;
    const passwordMatch = await bcrypt.compare(password, userToCheck.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const username =
      userToCheck.name || userToCheck.companyName || userToCheck.adminName;

    const token = jwt.sign(
      { userId: userToCheck._id, role, username },
      jwtSecretKey,
      { expiresIn: "1h" }
    );
    const finalId = userToCheck._id;
    res.status(200).json({ token, role, username, finalId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
