import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.css";


const Router = createBrowserRouter([
  {
    path:'/',
    element:<App></App>
  },
  {

  }
]);

createRoot(document.getElementById("root")).render(<RouterProvider router={Router} />);
