const express = require("express");
const router = express.Router();
const Object = require("../models/Object");

router.get("/product/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Object.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
