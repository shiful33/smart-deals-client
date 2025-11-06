import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logOut } = useContext(AuthContext) || {};
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    if (logOut) {
      logOut()
        .then(() => {
          console.log("User logged out successfully");
          navigate("/auth/login");
        })
        .catch((err) => {
          console.error("Logout failed:", err);
        });
    }
  };

  const menuLinks = (
    <>
      <li className="text-lg font-semibold bg-gradient-primary text-gradient">
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
          Home
        </Link>
      </li>
      <li className="text-lg font-semibold bg-gradient-primary text-gradient">
        <Link to="/allProducts" onClick={() => setIsMobileMenuOpen(false)}>
          All Products
        </Link>
      </li>
      {user && (
        <li className="text-lg font-semibold bg-gradient-primary text-gradient">
          <Link to="/myBids" onClick={() => setIsMobileMenuOpen(false)}>
            My Bids
          </Link>
        </li>
      )}
      <li className="text-lg font-semibold bg-gradient-primary text-gradient">
        <Link to="/createProducts" onClick={() => setIsMobileMenuOpen(false)}>
          Create Products
        </Link>
      </li>
    </>
  );

  return (
    <div className="shadow-sm bg-base-200">
      <div className="navbar lg:px-[80px] lg:px-4">
        {/* Mobile Hamburger */}
        <div className="navbar-start lg:hidden">
          <button
            className="btn btn-ghost"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Logo Start */}
        <div className="pr-[40px] lg:pr-0 lg:navbar-start">
          <Link to="/" className="text-2xl font-bold btn btn-ghost lg:text-4xl">
            Smart
            <span className="bg-gradient-primary text-gradient">Deals</span>
          </Link>
        </div>

        <div className="hidden lg:flex navbar-center">
          <ul className="px-1 menu menu-horizontal">{menuLinks}</ul>
        </div>

        <div className="gap-2 navbar-end lg:gap-4">
          {user ? (
            <button
              onClick={handleSignOut}
              className="text-sm border-orange-500 btn btn-outline bg-gradient-primary text-gradient lg:text-base"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth/login")}
              className="text-sm border-orange-500 btn btn-outline bg-gradient-primary text-gradient lg:text-base"
            >
              Log In
            </button>
          )}
          <button
            onClick={() => navigate("/auth/register")}
            className="text-sm text-white btn bg-gradient-primary lg:text-base"
          >
            Register
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 z-50 shadow-lg top-full bg-base-200 lg:hidden">
            <ul className="p-4 menu">{menuLinks}</ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
