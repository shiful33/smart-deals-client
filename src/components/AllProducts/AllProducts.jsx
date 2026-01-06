import React from "react";
import AllLatestProducts from "../AllLatestProducts/AllLatestProducts";
import Footer from "../Footer/Footer";

const allProductsPromise = fetch("/latest-products.json").then(
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
