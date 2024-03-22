const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const User = require('../models/User')
const Object = require('../models/Object')
const mongoose = require('mongoose')



router.get('/:companyId', async (req, res) => {
 try {

   const companyId = req.params.companyId;
   const company = await Company.findById(companyId);
   if (!company) {
     return res.status(404).json({ error: 'Company not found' });
   }
   res.json({
     companyId: company._id,
     companyName: company.companyName,
   });
 } catch (error) {
 
   console.error(error);
   res.status(500).json({ error: 'Internal Server Error' });
 }
});



router.get('/details/:companyId', async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const company = await Company.findById(companyId).populate('products').populate('users');

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({
      companyId: company._id,
      companyName: company.companyName,
      email: company.email,
      phone: company.phone,
      
      products: company.products, 
      users: company.users,       
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/product/:productId', async (req, res) => {
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


router.put('/products/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    // Find the product by ID
    const product = await Object.findByIdAndUpdate(productId, req.body, { new: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Respond with the updated product
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/products/:companyId', async (req, res) => {
  try {
    const companyId = req.params.companyId;

    const company = await Company.findById(companyId).populate('products');

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({ products: company.products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



router.put('/update-product/:companyId/:productId', async (req, res) => {
  const { companyId, productId } = req.params;
  try {
    // Find the company by ID
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Find the product by ID
    const product = await Object.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product with the new data
    product.title = req.body.title;
    product.price = req.body.price;
    product.cat = req.body.cat;
    product.dispimg = req.body.dispimg;
    product.description = req.body.description;

    // Save the updated product
    await product.save();

    // Respond with the updated product
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get('/purchases/:companyId', async (req, res) => {
  try {
    const companyId = req.params.companyId;

    // Find users who have purchased from the company
    const users = await User.find({
      'orderHistory.products.productId': { $in: await Company.findById(companyId).distinct('products') }
    });

    // Extract relevant user and product information
    const userPurchases = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      purchases: user.orderHistory.map(order => ({
        date: order.date,
        products: order.products.map(product => ({
          productId: product.productId,
          quantity: product.quantity
        }))
      }))
    }));

    res.json(userPurchases);
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/sales/:companyId', async (req, res) => {
  try {
    const companyId = req.params.companyId;

    // Find all users who have purchased from the company
    const users = await User.find({
      'orderHistory.products.productId': { $in: await Company.findById(companyId).distinct('products') }
    });

    // Extract sales data for each user
    const allProducts = [];

    for (const user of users) {
      user.orderHistory.forEach(order => {
        order.products.forEach(product => {
          allProducts.push({
            productId: product.productId,
            quantity: product.quantity,
          });
        });
      });
    }

    // Filter products that belong to the specified company
    const companyProducts = await Promise.all(allProducts.map(async product => {
      // Find the company of the product using the productId
      const object = await Object.findById(product.productId);
      
      // Check if the company of the product matches the specified company
      if (object && object.company && object.company.equals(companyId)) {
        return {
          productId: product.productId,
          sales: product.quantity,
          title: object.title,
          price:object.price
        };
      } else {
        return null;
      }
    }));

    // Remove null values from the array
    const validCompanyProducts = companyProducts.filter(product => product !== null);

    // Calculate sales data by summing up quantities for each product
    const salesData = [];
    validCompanyProducts.forEach(product => {
      const existingProduct = salesData.find(p => p.productId.equals(product.productId));

      if (existingProduct) {
        // If product already exists in salesData, update the quantity
        existingProduct.sales += product.sales;
      } else {
        // If product doesn't exist, add it to salesData
        salesData.push(product);
      }
    });

    res.json(salesData);
  } catch (error) {
    console.error('Error fetching product sales:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






module.exports = router;
