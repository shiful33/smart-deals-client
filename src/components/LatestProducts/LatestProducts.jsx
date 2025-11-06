import React, { use } from "react";
import Product from "../Product/Product";

const LatestProducts = ({ latestProductsPromise }) => {
  const products = use(latestProductsPromise);

  return (
    <div>
      <h2 className="text-[42px] font-bold text-center my-[80px]">
        Recent{" "}
        <span className="bg-gradient-primary text-gradient">Products</span>
      </h2>
      <div className="grid justify-center gap-6 mx-auto md:grid-cols-2 lg:grid-cols-3 mb-[80px]">
        {products.map((product) => (
          <Product key={product._id} product={product}></Product>
        ))}
      </div>
    </div>
  );
};

export default LatestProducts;
