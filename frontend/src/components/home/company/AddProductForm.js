import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './AddProductForm.css'

const AddProductForm = () => {
  const { companyId } = useParams();
  const [productData, setProductData] = useState({
    title: "",
    price: "",
    cat: "",
    dispimg: "",
    description: "",
    images: [],
    companyId: companyId,
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const imagesArray = e.target.value.split(",").map((url) => url.trim());
    setProductData({
      ...productData,
      images: imagesArray,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (productData.price <= 0) {
      console.error("Price must be greater than 0");
      return;
    }
    try {
      const response = await axios.post(
        "https://velvethomes-bpj4.onrender.com/input/product",
        {
          title: productData.title,
          price: Number(productData.price), 

          cat: productData.cat,
          dispimg: productData.dispimg,
          description: productData.description,
          images: productData.images,
          companyId: productData.companyId,
        }
      );
      setSuccessMessage("Product added successfully");
      setProductData({
        title: "",
        price: "",
        cat: "",
        dispimg: "",
        description: "",
        images: [],
        companyId: companyId,
      });
      console.log("Product added successfully:", response.data);
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  };

  
  
  return (
    <>
    <form className="addProductForm" onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="title"
          value={productData.title}
          onChange={handleChange}
          className="addProductForm input"
          placeholder="Title"
        />
      </div>
      <div>
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          className="addProductForm input"
          placeholder="Price"
        />
      </div>
      <div>
        <input
          type="text"
          name="cat"
          value={productData.cat}
          onChange={handleChange}
          className="addProductForm input"
          placeholder="Category"
        />
      </div>
      <div>
        <input
          type="text"
          name="dispimg"
          value={productData.dispimg}
          onChange={handleChange}
          className="addProductForm input"
          placeholder="Display Image URL"
        />
      </div>
      <div>
        <input
          type="text"
          name="images"
          value={productData.images.join(", ")}
          onChange={handleImageChange}
          className="addProductForm textarea"
          placeholder="Image URLs (comma-separated)"
        />
      </div>
      <div>
        <input 
          type="text"
          name="companyId"
          value={productData.companyId}
          readOnly
          className="addProductForm input readonly-input"
          placeholder="Company ID"
          readonly
        />
      </div>
      <div>
        <textarea
          name="description"
          value={productData.description}
          onChange={handleChange}
          className="addProductForm textarea"
          placeholder="Description"
        />
      </div>
      <div>
        <button type="submit" className="addProductForm button">Submit</button>
        <p className="successMessage">{successMessage}</p>
      </div>

    </form>
</>
  );
};

export default AddProductForm;
