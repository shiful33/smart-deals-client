import { use } from "react";
import ViewAllProducts from "../ViewAllProducts/ViewAllProducts";

const AllLatestProducts = ({ allProductsPromise }) => {
  const products = use(allProductsPromise);

  return (
    <div>
      <h2 className="text-[42px] font-bold text-center my-[80px]">
        View All{" "}
        <span className="bg-gradient-primary text-gradient">Products</span>
      </h2>
      <div className="grid justify-center gap-6 mx-auto md:grid-cols-2 lg:grid-cols-3 mb-[80px]">
        {products.map((product) => (
          <ViewAllProducts
            key={product._id}
            product={product}
          ></ViewAllProducts>
        ))}
      </div>
    </div>
  );
};

export default AllLatestProducts;
