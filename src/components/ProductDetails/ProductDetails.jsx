import React, { useRef, useContext, useEffect, useState } from "react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import Swal from "sweetalert2";
import axios from "axios";
import { IoCaretBackOutline } from "react-icons/io5";
import Footer from "../Footer/Footer";

const ProductDetails = () => {
  const { id } = useParams();
  const product = useLoaderData(); // ✅ using loader data (no duplication)
  const [bids, setBids] = useState([]);
  const { user } = useContext(AuthContext);
  const bidModalRef = useRef(null);

  console.log("Loaded product:", product);
  console.log("URL id:", id);

  // Safely access product properties
  const _id = product?._id;
  const title = product?.title || "Unknown Product";

  // Base URL for the API
  const API_BASE_URL = "http://localhost:5000";

  const fetchBids = async (productId) => {
    if (!productId) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/products/bids/${productId}`
      );
      // Sort the fetched data immediately
      const sortedBids = response.data.sort(
        (a, b) => b.bid_price - a.bid_price
      );
      setBids(sortedBids);
    } catch (error) {
      console.error("Error fetching bids:", error);
      setBids([]);
    }
  };

  // Fetch bids when the product ID changes
  useEffect(() => {
    fetchBids(_id);
  }, [_id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const bid_price = parseFloat(form.bid.value);

    if (!user) {
      Swal.fire("Login Required", "Please log in to place a bid.", "warning");
      return;
    }

    const bidData = {
      product: _id,
      bid_price,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem("firebaseToken");
      if (!token) {
        Swal.fire("Error", "Authentication token missing.", "error");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/bids`, {
        // Using API_BASE_URL constant
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bidData),
      });

      const result = await res.json();

      if (res.ok && result.insertedId) {
        bidModalRef.current?.close();
        form.reset();

        const newBid = {
          ...bidData,
          _id: result.insertedId,
          buyer_email: user?.email,
          buyer_name: user?.displayName || user?.email.split("@")[0] || "User",
        };

        setBids((prev) =>
          [newBid, ...prev].sort((a, b) => b.bid_price - a.bid_price)
        );
        Swal.fire("Success!", `$${bid_price} Bid Placed!`, "success");
      } else {
        // Show error message from server
        Swal.fire("Error", result.error || "Failed to place bid.", "error");
      }
    } catch (err) {
      console.error("Bid Submission Error:", err);
      Swal.fire(
        "Error",
        "An unexpected error occurred during submission.",
        "error"
      );
    }
  };

  if (!_id) {
    return (
      <div className="p-20 text-3xl font-semibold text-center text-red-600 mt-[100px]">
        Product Not Found! (Check Router Loader)
      </div>
    );
  }

  return (
    <>
      <div className="my-[80px] mx-auto max-w-7xl">
        <div className="flex-col items-center gap-6 overflow-hidden bg-white lg:flex rounded-2x lp-6 md:flex-row mb-[80px]">
          <div>
            <img
              src={product.image}
              alt={title}
              className="object-cover lg:w-[600px] lg:h-[500px] rounded-lg shadow-lg"
            />
            <div className="p-6 my-6 bg-gray-100 shadow-md lg:w-[600px]">
              <h4 className="text-[24px] font-semibold mb-4">
                Product Description
              </h4>
              <div className="flex justify-between">
                <p className="text-[16px] font-semibold">
                  <span className="text-purple-600">Condition: </span>
                  {product.condition}
                </p>
                <p className="text-[16px] font-semibold">
                  <span className="text-purple-600">Usage Time: </span>
                  {product.usage}
                </p>
              </div>
              <p className="mt-6">
                <span className="font-semibold">Product Description:</span>{" "}
                {product.description}
              </p>
            </div>
          </div>

          <div className="flex-1 p-8">
            <Link
              to="/allProducts"
              className="flex items-center gap-1 mb-3 font-semibold cursor-pointer"
            >
              <IoCaretBackOutline /> Back To Products
            </Link>

            <h1 className="mb-4 text-2xl font-bold lg:text-4xl">{title}</h1>
            <p className="font-semibold text-purple-700 border-b-2 border-purple-300">
              {product.category}
            </p>

            <div className="p-4 mt-4 bg-gray-100 rounded shadow">
              <p className="mt-4 font-semibold text-green-600 lg:text-2xl">
                ${product.price_min} - {product.price_max}
              </p>
              <p className="mb-4 font-semibold">Price starts from</p>
            </div>

            <div className="p-4 mt-4 bg-gray-100 rounded shadow">
              <h4 className="text-[18px] font-semibold mb-2">
                Product Details
              </h4>
              <p>
                <span className="font-semibold text-purple-700">
                  Product ID:{" "}
                </span>
                {product._id}
              </p>
              <p>
                <span className="font-semibold text-purple-700">Posted: </span>
                {product.created_at}
              </p>
            </div>

            <div className="p-4 mt-4 bg-gray-100 rounded shadow">
              <p className="mt-4 text-lg">
                <strong>Seller Information</strong> {product.seller_name}
              </p>
              <p>
                <strong>Location:</strong> {product.location}
              </p>
              <p className="mb-2">
                <span className="font-semibold ">Contact: </span>
                {product.seller_contact}
              </p>
              <p className="font-semibold">
                Status:{" "}
                <span className="px-3 py-1 font-normal text-purple-700 rounded-lg bg-amber-400">
                  {product.status}
                </span>
              </p>
            </div>

            <div className="my-10 text-center">
              <button
                onClick={() => bidModalRef.current?.showModal()}
                className="w-full text-[18px] btn btn-primary"
              >
                Place Your Bid Now
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-base-200 rounded-xl">
          <h2 className="mb-4 text-3xl font-bold">
            Bids for this products ({bids.length})
          </h2>
          {bids.length === 0 ? (
            <p className="py-10 text-center text-gray-500">No bids yet!</p>
          ) : (
            <table className="table table-zebra">
              <thead className="">
                <tr>
                  <th className="hidden lg:block">SL No.</th>
                  <th>Buyer Name</th>
                  <th className="hidden lg:block">Buyer Email</th>
                  <th>Bid Price</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody className="">
                {bids.map((b, i) => (
                  <tr key={b._id}>
                    <th className="hidden lg:block">{i + 1}</th>
                    <td>{b.buyer_name}</td>
                    <td className="hidden lg:block">{b.buyer_email}</td>
                    <td className="font-bold text-green-600">${b.bid_price}</td>
                    <td>{new Date(b.created_at).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <dialog ref={bidModalRef} className="modal">
          <div className="modal-box">
            <h3 className="text-2xl font-bold text-center">Place Bid</h3>
            <form onSubmit={handleBidSubmit} className="mt-6 space-y-4">
              {/* User Info Inputs */}
              <div className="flex gap-4">
                <input
                  name="buyer_name"
                  type="text"
                  placeholder="Your Name"
                  className="w-full input input-bordered"
                  value={
                    user?.displayName || user?.email.split("@")[0] || "Guest"
                  }
                  readOnly
                />
                <input
                  name="buyer_email"
                  type="email"
                  placeholder="Your Email"
                  className="w-full input input-bordered"
                  value={user?.email || "guest@example.com"}
                  readOnly
                />
              </div>

              {/* Bid Input */}
              <input
                name="bid"
                type="number"
                placeholder="Your bid (e.g. 2800)"
                className="w-full input input-bordered"
                required
              />

              <div className="flex gap-3">
                <button type="submit" className="flex-1 btn btn-success">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => bidModalRef.current?.close()}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
