import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/layouts/RootLayout.jsx";
import Home from "./components/Home/Home.jsx";
import AllProducts from "./components/AllProducts/AllProducts.jsx";
import MyBids from "./components/MyBids/MyBids.jsx";
import MyProducts from "./components/MyProducts/MyProducts.jsx";
import CreateProducts from "./components/CreateProducts/CreateProducts.jsx";
import Login from "./components/login/Login.jsx";
import Register from "./components/register/Register.jsx";
import ProductDetails from "./components/ProductDetails/ProductDetails.jsx";
import ErrorPage from "./components/ErrorPage/ErrorPage.jsx";

// Context
import AuthProvider from "./context/AuthProvider.jsx";
import PrivateRoute from "./Routes/PrivateRoute.jsx";
import Footer from "./components/Footer/Footer.jsx";

// ===============================================
// Router Configuration
// ===============================================
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },

      { path: "allProducts", element: <AllProducts /> },
      {
        path: "myProducts",
        element: (
          <PrivateRoute>
            <MyProducts />
          </PrivateRoute>
        ),
      },
      {
        path: "myBids",
        element: (
          <PrivateRoute>
            <MyBids />
          </PrivateRoute>
        ),
      },
      { path: "createProducts", element: <CreateProducts /> },
      {
        path: "createProducts",
        element: (
          <PrivateRoute>
            <CreateProducts />
          </PrivateRoute>
        ),
      },
      { path: "auth/login", element: <Login /> },
      { path: "auth/register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "footer", element: <Footer /> },

      // Product Details with Loader
      {
        path: "/productDetails/:id",
        element: (
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        ),
        loader: async ({ params }) => {
          const res = await fetch(
            `http://localhost:5000/products/${params.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem(
                  "firebaseToken"
                )}`,
              },
            }
          );
          if (!res.ok) throw new Error(`Server returned ${res.status}`);
          return res.json();
        },
      },
    ],
  },
]);

const hydrateFallback = (
  <div className="flex items-center justify-center min-h-screen">
    <span className="loading loading-spinner loading-lg"></span>
  </div>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} hydrationFallback={hydrateFallback} />
    </AuthProvider>
  </StrictMode>
);
