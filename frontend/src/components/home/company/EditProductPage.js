import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditProduct.css'; // Import the CSS file

const EditProductPage = () => {
  const { companyId, productId } = useParams();
  const navigate = useNavigate(); // Use the useNavigate hook to navigate

  const [product, setProduct] = useState({
    images: [],
    title: '',
    price: 0,
    cat: '',
    dispimg: '',
    description: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`https://velvethomes-bpj4.onrender.com/company/update-product/${companyId}/${productId}`, product);
      setSuccessMessage('Product updated successfully!');
      console.log('Product updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`https://velvethomes-bpj4.onrender.com/company/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [companyId, productId]);
  
  const handleBack = () => {
    // Navigate to the desired route when the back button is clicked
    navigate(`/company/${companyId}`);
  };
  
  return (
    <>
      <button onClick={handleBack} style={{color:"white",backgroundColor:"black",border:"none",padding:"10px",borderRadius:"50%",cursor:"pointer"}}>←</button> {/* Add the back button */}
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="edit-product-form">
        <label>
          Title:
          <input type="text" name="title" value={product.title} onChange={handleChange} />
        </label>
        <br />
        <label>
          Price:
          <input type="number" name="price" value={product.price} onChange={handleChange} />
        </label>
        <br />
        <label>
          Category:
          <input type="text" name="cat" value={product.cat} onChange={handleChange} />
        </label>
        <br />
        <label>
          Display Image URL:
          <input type="text" name="dispimg" value={product.dispimg} onChange={handleChange} />
        </label>
        <br />
        <label>
          Description:
          <textarea name="description" value={product.description} onChange={handleChange} />
        </label>
        <br />
        <button type="submit" className="update-button">
          Update Product
        </button>
      </form>
    </div>
    </>
  );
};

export default EditProductPage;
