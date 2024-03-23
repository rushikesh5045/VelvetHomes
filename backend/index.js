require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/products");
const companyRoutes = require("./routes/company");
const detailRoutes = require("./routes/details");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const bodyParser = require("body-parser");

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Database Connected");
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/details", detailRoutes);
app.use("/api/auth", authRoutes);
app.use("/input", productRoutes);
app.use("/company", companyRoutes);
app.use("/user", userRoutes);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
