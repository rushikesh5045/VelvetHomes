const express = require('express');
const router = express.Router();
const Object = require("../models/Object");
const User = require('../models/User');
const Company = require('../models/Company')
const mongoose = require('mongoose');
router.post('/product', async (req, res) => {
  try {
    const { title, price, cat, dispimg, description, images, companyId } = req.body;

    // Create a new product
    const product = new Object({
      title,
      price,
      cat,
      dispimg,
      description,
      images,
      company: companyId, 
    });


    await product.save();

    // Update the company's products array with the new product
    await Company.findByIdAndUpdate(
      companyId,
      { $push: { products: product._id } },
      { new: true }
    );

    res.status(201).json({ message: 'Product registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// GET request to fetch all products
router.get('/products', async (req, res) => {
  try {
    const products = await Object.find();
    const data= res.json(products);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Object.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/products/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Object.find({ cat: category });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/user/clearCart', async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user by ID and clear the cart
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { cart: [] } },
      { new: true }
    );

    res.json({ message: 'Cart cleared successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/user/updateCart', async (req, res) => {
  try {
    const { userId, cart } = req.body;

    // Find the user by ID and update the cart
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { cart: cart } },
      { new: true }
    );

    res.json({ message: 'Cart updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to update the products array of all companies


router.post('/user/placeOrder', async (req, res) => {
  try {
    const { userId, cart } = req.body;

    // Extract product information from the cart
    const orderDetails = cart.map(cartItem => ({
      productId: cartItem.product,
      quantity: cartItem.quantity,
    }));

    // Update the user's orderHistory in the database
    const order = {
      products: orderDetails,
      date: new Date(),
    };

    // Use $push to add the new order to the orderHistory array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { orderHistory: order }, $set: { cart: [] } },
      { new: true }
    );

    // Update the buyers array in the Object model
    const productIds = orderDetails.map(orderItem => orderItem.productId);
    await Object.updateMany(
      { _id: { $in: productIds } },
      { $push: { buyers: userId } }
    );

    // Update the users array in the Company model
    const products = await Object.find({ _id: { $in: productIds } });
    const companyId = products[0].company;
    await Company.findByIdAndUpdate(
      companyId,
      { $push: { users: userId } }
    );

    res.status(200).json({ message: 'Order placed successfully', order, updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// router.get('/order/:orderId', ...)
router.get('/orders/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate if the userId is a valid ObjectId
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    // Fetch the user details from the database
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user || !user.orderHistory) {
      return res.status(404).json({ error: 'User not found or no orders placed' });
    }

    // Send the response with all orders placed by the user
    res.status(200).json({ orders: user.orderHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




//PRODUCTS
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}); 



router.post('/updateProductsArray', async (req, res) => {
  try {
    // Get all company IDs
    const companyIds = await Company.find().distinct('_id');

    // Iterate through each company
    for (const companyId of companyIds) {
      // Find all Objects with the given company ID
      const objects = await Object.find({ company: companyId });

      // Extract the IDs of the found Objects
      const objectIds = objects.map((object) => object._id);

      // Update the products array for the current company
      await Company.findByIdAndUpdate(companyId, { $set: { products: objectIds } });
    }

    res.json({ message: 'Products array updated for all companies' });
  } catch (error) {
    console.error('Error updating products array:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to fetch cart items for a specific user
router.get('/user/cart/:userId', async (req, res) => {
  try {
    // Find the user by userId
    const user = await User.findById(req.params.userId).populate('cart.product', 'name price'); // Assuming your product model has 'name' and 'price' fields

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the cart items
    res.json({ cart: user.cart });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
