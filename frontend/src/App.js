import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/home/client/Landing/LandingPage';
import Login from './components/auth/Login';
import CompanyLandingPage from './components/home/company/CompanyLandingPage';
import AdminLandingPage from './components/home/admin/AdminLandingPage';
import RegisterCustomer from './components/auth/RegisterCustomer';
import RegisterCompany from './components/auth/RegisterCompany';
import RegisterAdmin from './components/auth/RegisterAdmin';
import NotFound from './components/error/NotFound';
import ProductForm from './components/products/ProductForm';
import ExplorePage from './components/home/client/explore/ExploreProducts';
import ProductDescriptionPage from './components/home/client/explore/ProductDescriptionPage';
import { CartProvider } from './context/CartContext';
import CatPage from './components/home/category/CatPage';
import Arrays from './components/home/category/Arrays';
import ProductListPage from './components/home/category/ProductListPage';
import EditProductPage from './components/home/company/EditProductPage';
import UserProfilePage from './components/home/client/profile/UserProfile';
import PurchaseProcessPage from './components/home/client/explore/PurchaseProcessPage';
const categories = Arrays;

const router = ( 

  <BrowserRouter>
  <CartProvider>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path='/register/customer' element={<RegisterCustomer/>}/>
      <Route path='/register/company' element={<RegisterCompany/>}/>
      <Route path='/register/admin' element={<RegisterAdmin/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/company/:companyId" element={<CompanyLandingPage />} />
      <Route path="/company-edit/:companyId/editProduct/:productId" element={<EditProductPage/>} />
      <Route path="/admin" element={<AdminLandingPage />} />
      <Route path="/productForm" element={<ProductForm />} />
      <Route path="/explore-page" element={<ExplorePage />} />
      <Route path="/user/:userId" element={<UserProfilePage/>} />
      <Route path="/products/:productId" element={<ProductDescriptionPage />} />
      <Route path="/catList/:subCategory" element={<ProductListPage />} />
      <Route path="/buynow" element={<PurchaseProcessPage />} />
      <Route path="/category/:categoryId" element={<CatPage categories={categories} />} /> 

      <Route path='*' element={<NotFound/>} />
    </Routes>
    </CartProvider>
  </BrowserRouter>
);

const App = () => {

  

  return (
    <div>
      {router}
    </div>
  );
};




export default App;