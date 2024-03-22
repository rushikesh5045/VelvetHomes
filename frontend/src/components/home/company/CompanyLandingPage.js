import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserPurchaseList from "./UserPurchaseList";
import SmallerProductCard from "./SmallerProductCard";
import Chart from "chart.js/auto";
import "./CompanyLandingPage.css";
import AddProductForm from "./AddProductForm";
import CompanyHome from "./CompanyHome";

const CompanyLandingPage = () => {
  const { companyId } = useParams();
  const [companyDetails, setCompanyDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("welcome");
  const productsPerPage = 9;
  const [productSales, setProductSales] = useState([]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get(
          `https://velvethomes-bpj4.onrender.com/company/details/${companyId}`
        );
        setCompanyDetails(response.data);
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    const fetchProductSales = async () => {
      try {
        const response = await axios.get(
          `https://velvethomes-bpj4.onrender.com/company/sales/${companyId}`
        );
        setProductSales(response.data);
      } catch (error) {
        console.error("Error fetching product sales:", error);
      }
    };

    fetchCompanyDetails();
    fetchProductSales();
  }, [companyId]);

  const totalProducts = companyDetails ? companyDetails.products.length : 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = companyDetails
    ? companyDetails.products.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];
  const productsWithSales = productSales.filter((sale) => sale.sales > 0);
console.log(productsWithSales)
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedUser(null);
  };

  useEffect(() => {
    drawBarChart();
  }, [productsWithSales]);

  const drawBarChart = () => {
    const chartContainer = document.getElementById("barChart");

    if (chartContainer && chartContainer.getContext) {
      const ctx = chartContainer.getContext("2d");

      const chartData = {
        labels: productsWithSales.map((product) => product.title),
        datasets: [
          {
            label: "Product Sales",
            borderColor: "red",
            backgroundColor: "orange",
            data: productsWithSales.map((product) => product.sales),
          },
        ],
      };

      const chartOptions = {
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            suggestedMin: 0,
          },
        },
      };

      if (chartContainer.chart) {
        chartContainer.chart.destroy();
      }
      chartContainer.chart = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: chartOptions,
      });
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(selectedUser === user ? null : user);
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case "welcome":
        return (
          <div >
            <div style={{textAlign:"center",marginBottom:"40px"}}>
            <div style={{fontFamily:"Lobster",fontSize:"5rem"}}>{companyDetails?.companyName}</div>
            <h4 style={{fontFamily:"monospace"}}>
              Thank you for providing exceptional products for our customers
            </h4></div>
            <div >
            <CompanyHome/>
            </div>
          </div>
        );
      case "featuredProducts":
        return (
          <div>
            <h2 className="welcomeMessage">Featured Products:</h2>
            <div className="productList">
              {currentProducts.map((product) => (
                <div key={product._id} className="productItem">
                  <SmallerProductCard product={product} />
                </div>
              ))}
            </div>
            <div className="pagination">
              {Array.from({ length: totalPages }).map((_, index) => (
                <span
                  key={index}
                  className={
                    index + 1 === currentPage
                      ? "currentPageNumber"
                      : "pageNumber"
                  }
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </span>
              ))}
            </div>
          </div>
        );
      case "userPurchases":
        return (
          <div>
            <h2 className="welcomeMessage">User Purchases:</h2>
            <hr />
            <UserPurchaseList
              companyId={companyId}
              onUserClick={handleUserClick}
            />
          </div>
        );
      case "productSalesChart":
        return (
          <div>
            <h2 className="welcomeMessage">Product Sales Chart:</h2>
            <div className="chartContainer">
              <canvas id="barChart" className="chart"></canvas>
            </div>
          </div>
        );
        case "addProduct":
          return (
            <div>
              <h2 style={{textAlign:"center"}} className="welcomeMessage">Add Product</h2>
              <AddProductForm/>
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      {/* Left Menu */}
      <div className="menu" style={{minWidth:"fit-content"}}>
        <div
          className={`menuItem ${
            activeMenuItem === "welcome" ? "menuItemActive" : ""
          }`}
          onClick={() => setActiveMenuItem("welcome")}
        >
          Welcome
        </div>
        <div
          className={`menuItem ${
            activeMenuItem === "featuredProducts" ? "menuItemActive" : ""
          }`}
          onClick={() => setActiveMenuItem("featuredProducts")}
        >
          Featured Products
        </div>
        <div
          className={`menuItem ${
            activeMenuItem === "userPurchases" ? "menuItemActive" : ""
          }`}
          onClick={() => setActiveMenuItem("userPurchases")}
        >
          User Purchases
        </div>
        <div
          className={`menuItem ${
            activeMenuItem === "productSalesChart" ? "menuItemActive" : ""
          }`}
          onClick={() => setActiveMenuItem("productSalesChart")}
        >
          Product Sales Chart
        </div>
        <div
          className={`menuItem ${activeMenuItem === "addProduct" ? "menuItemActive" : ""}`}
          onClick={() => setActiveMenuItem("addProduct")}
        >
          Add Product
        </div>
      </div>


      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default CompanyLandingPage;
