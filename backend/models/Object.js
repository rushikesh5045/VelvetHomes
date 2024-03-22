const mongoose = require("mongoose");

const objectSchema = new mongoose.Schema({
  images: [
     
        {
            type: String,
          },
  ],
  buyers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  title: {
    type: String,
  },
  price: {
    type: Number,
  },
  cat: {
    type: String,
  },
  dispimg: {
    type: String,
  },
  description: {
    type: String,
  },
  company:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  }
});

const Object = mongoose.model("Object",objectSchema);
module.exports = Object;