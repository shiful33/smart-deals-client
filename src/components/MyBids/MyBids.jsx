import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import Swal from "sweetalert2";
import Footer from "../Footer/Footer";


const MyBids = () => {
  const { user } = useContext(AuthContext);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/bids?buyer_email=${user.email}`, {
        headers: {
          authorization: `Bearer ${user.accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("My Bids:", data);
          setBids(data);
        })
        .catch((err) => console.error("Bid fetch error:", err));
    }
  }, [user]);

  const handleDeleteBid = async (bidId) => {
    const token = localStorage.getItem("firebaseToken");

    if (!token) {
      Swal.fire("Error", "Please log in to remove a bid.", "error");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/bids/${bidId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setBids((prevBids) => prevBids.filter((bid) => bid._id !== bidId));
        Swal.fire("Success", "Bid removed successfully!", "success");
      } else {
        const errorData = await res.json();
        Swal.fire("Error", errorData.error || "Failed to remove bid.", "error");
      }
    } catch (error) {
      console.error("Delete Bid Error:", error);
      Swal.fire("Error", "An unexpected error occurred.", "error");
    }
  };

  return (
    <>
      <div className="w-full lg:mx-auto lg:p-10 lg:w-6xl">
        <h2 className="mb-6 text-3xl font-bold">
          My All Bids: <span className="text-primary">{bids.length}</span>
        </h2>

        {bids.length === 0 ? (
          <p className="text-xl text-center text-gray-500">
            You have no bids yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th className="hidden lg:block">SL No.</th>
                  <th>Buyer Name</th>
                  <th>Bid Price</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid, i) => (
                  <tr key={bid._id}>
                    <th className="hidden lg:block">{i + 1}</th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-12 h-12 mask mask-squircle">
                            <img
                              src={
                                bid.buyer_image || "https://i.pravatar.cc/150"
                              }
                              alt="buyer"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="lg:font-bold w-[150px]">
                            {bid.buyer_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="font-bold text-green-600">
                      ${bid.bid_price}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          bid.status === "pending"
                            ? "badge-warning"
                            : "badge-success"
                        }`}
                      >
                        {bid.status}
                      </span>
                    </td>
                    <td>{new Date(bid.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteBid(bid._id)}
                        className="btn btn-outline lg:btn-xs"
                      >
                        Remove Bid
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyBids;
