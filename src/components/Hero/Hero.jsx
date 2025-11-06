import React from "react";
import { LuSearch } from "react-icons/lu";
import { Link } from "react-router";

const Hero = () => {
  return (
    <div>
      <div
        className="lg:h-[450px] hero mt-[50px]"
        style={{
          backgroundImage:
            "url(https://cdn.pixabay.com/photo/2018/01/27/00/39/wheel-3110175_640.jpg)",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="text-center hero-content text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">
              Deal your Products in a Smart way !
            </h1>
            <p className="mb-5">
              SmartDeals helps you sell, resell, and shop from trusted local
              sellers — all in one place!
            </p>

            {/* Search Box */}
            <div className="mb-6 join">
              <div>
                <label className="input validator join-item lg:w-[300px]">
                  <input type="email" placeholder="mail@site.com" required />
                </label>
                <div className="hidden validator-hint">
                  Enter valid email address
                </div>
              </div>
              <button className="btn btn-primary join-item">
                <LuSearch />
              </button>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Link
                to="/allProducts"
                className="text-white btn btn-success hover:btn-outline"
              >
                Watch All Products
              </Link>
              <Link
                to="createProducts"
                className="text-white btn btn-outline hover: btn-success"
              >
                Post an Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
