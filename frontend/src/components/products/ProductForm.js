import React, { useState } from "react";
import axios from "axios";

const ProductForm = () => {
  const [productData, setProductData] = useState({
    title: "",
    price: 0,
    cat: "",
    dispimg: "",
    description: "",
    images: [],
    companyId: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const capitalizeFirstLetter = (str) => {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
  };

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]:
        e.target.name === "title"
          ? capitalizeFirstLetter(e.target.value)
          : e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const imagesArray = e.target.value.split(",").map((url) => url.trim());

    setProductData({
      ...productData,
      images: imagesArray,
    });
  };

  const isDotNotBetweenNumbers = (str) => {
    const dotNotBetweenNumbersRegex = /(?<!\d)\.(?!\d)/;
    return dotNotBetweenNumbersRegex.test(str);
  };

  const handleDescriptionChange = (e) => {
    const descriptionValue = e.target.value;
    const shouldSplit = isDotNotBetweenNumbers(descriptionValue);

    setProductData({
      ...productData,
      description: shouldSplit ? descriptionValue : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://velvethomes-bpj4.onrender.com/input/product",
        {
          title: productData.title,
          price: productData.price,
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
        price: 0,
        cat: "",
        dispimg: "",
        description: "",
        images: [],
        companyId: "",
      });

      console.log("Product added successfully:", response.data);
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={productData.title}
          onChange={handleChange}
          style={{ height: "30px", width: "300px" }}
        />
      </div>

      <div>
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          style={{ height: "30px", width: "300px" }}
        />
      </div>

      <div>
        <label>Category:</label>
        <input
          type="text"
          name="cat"
          value={productData.cat}
          onChange={handleChange}
          style={{ height: "30px", width: "300px" }}
        />
      </div>

      <div>
        <label>Display Image URL:</label>
        <input
          type="text"
          name="dispimg"
          value={productData.dispimg}
          onChange={handleChange}
          style={{ height: "30px", width: "300px" }}
        />
      </div>

      <div>
        <label>Image URLs (comma-separated):</label>
        <input
          type="text"
          name="images"
          value={productData.images.join(", ")}
          onChange={handleImageChange}
          style={{ height: "200px", width: "800px", wordWrap: "break-word" }}
        />
      </div>

      <div>
        <label>Company ID:</label>
        <input
          type="text"
          name="companyId"
          value={productData.companyId}
          onChange={handleChange}
          style={{ height: "30px", width: "300px" }}
        />
      </div>

      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={productData.description}
          onChange={handleDescriptionChange}
          style={{ height: "100px", width: "300px" }}
        />
      </div>

      <div>
        <button type="submit">Submit</button>
        <p style={{ color: "green" }}>{successMessage}</p>
      </div>
    </form>
  );
};

export default ProductForm;
