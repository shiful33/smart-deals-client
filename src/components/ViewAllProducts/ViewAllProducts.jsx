import React from "react";
import { Link } from "react-router-dom";

const ViewAllProducts = ({ product }) => {
  const { _id, title, price_min, price_max, image } = product;

  return (
    <div className="shadow-md bg-gray-50 card">
      <figure className="p-4">
        <img
          src={image}
          className="object-cover w-full shadow-lg rounded-xl h-[250px]"
          alt={title}
        />
      </figure>
      <div className="card-body">
        <h2 className="text-[20px] card-title">{title}</h2>
        <p className="font-semibold text-[17px] ">
          Price: ${price_min} - ${price_max}
        </p>
        <div className="card-actions">
          <p className="text-[16px] card-title">
            Condition: {product.condition}
          </p>
          <Link
            to={`/productDetails/${_id}`}
            className="w-full mt-4 hover:text-white btn btn-outline hover: btn-success"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewAllProducts;
