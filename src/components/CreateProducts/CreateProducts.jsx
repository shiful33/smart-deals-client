import axios from "axios";
import React from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthProvider";
import useAxios from "../../Hooks/useAxios";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Footer from "../Footer/Footer";

const CreateProducts = () => {
  const axiosInstance = useAxios();

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const handleCreateProducts = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const image = e.target.image.value;
    const price_min = e.target.price_min.value;
    const price_max = e.target.price_max.value;
    const condition = e.target.condition.value;
    console.log(title, image, price_min, price_max);

    const newProduct = {
      title,
      image,
      price_min,
      price_max,
      condition,
      email: user.email,
      seller_name: user.displayName,
    };

    axios.post("http://localhost:5000/products", newProduct).then((data) => {
      console.log(data.data);
      if (data.data.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your product has been create",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });

    axiosSecure.post("/products", newProduct).then((data) => {
      console.log(data.data);
    });
  };

  return (
    <>
      <div className="lg:w-1/2 mx-auto my-[80px] p-6 shadow-lg rounded">
        <h3 className="font-semibold">Please, add your product here...</h3>
        <form onSubmit={handleCreateProducts} className="mt-6 space-y-4">
          <label className="label">Name</label>
          <input
            name="title"
            type="title"
            placeholder="Your Name"
            className="w-full input input-bordered"
          />

          <label className="label">Image URL</label>
          <input
            name="image"
            type="text"
            placeholder="Image URL"
            className="w-full input input-bordered"
          />

          <label className="label">Min Price</label>
          <input
            type="text"
            name="price_min"
            placeholder="Minimum Price"
            className="w-full input input-bordered"
            required
          />

          <label className="label">Max Price</label>
          <input
            type="text"
            name="price_max"
            placeholder="Min Price"
            className="w-full input input-bordered"
            required
          />
          <label className="label">Condition</label>
          <input
            type="text"
            name="condition"
            placeholder="Condition"
            className="w-full input input-bordered"
            required
          />

          <div className="flex gap-3">
            <button type="submit" className="flex-1 text-white btn btn-success">
              Add A Product
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateProducts;
