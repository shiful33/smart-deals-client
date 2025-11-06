import React from "react";
import AllLatestProducts from "../AllLatestProducts/AllLatestProducts";
import Footer from "../Footer/Footer";

const allProductsPromise = fetch("http://localhost:5000/all-products").then(
  (res) => res.json()
);

const AllProducts = () => {
  return (
    <div>
      <AllLatestProducts
        allProductsPromise={allProductsPromise}
      ></AllLatestProducts>
      <Footer />
    </div>
  );
};

export default AllProducts;
