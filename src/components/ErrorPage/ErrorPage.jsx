import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="mb-4 text-4xl font-bold text-red-600">Oops!</h1>
      <p className="mb-2 text-lg">Something went wrong 😢</p>
      <p className="text-gray-500">{error.statusText || error.message}</p>
    </div>
  );
};

export default ErrorPage;
