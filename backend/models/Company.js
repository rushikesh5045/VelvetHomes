const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Object',
    },
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});


companySchema.post('save', async function (doc, next) {
  const Object = require('./Object'); 


  const objects = await Object.find({ company: this._id });


  const objectIds = objects.map((object) => object._id);

  
  await this.updateOne({ $set: { products: objectIds } });

  next();
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
