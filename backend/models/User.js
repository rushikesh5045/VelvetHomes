
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone:{
    type: Number,
    required : true
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    postalCode: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
  },
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Object',
    },
    quantity: {
      type: Number,
      default: 1,
    },
  }],
  orderHistory: [{
    products: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Object',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    }],
    date: {
      type: Date,
      default: Date.now,
    },
  }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
