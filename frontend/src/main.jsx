import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Register from "./component/Register.jsx";
import Login from "./component/Login.jsx";
import ForgotPassword from "./component/forgotPassword.jsx";
import ResetPassword from "./component/resetPassword.jsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.css";


const Router = createBrowserRouter([
  {
    path:'/',
    element:<App></App>
  },
  {
    path:'/register',
    element:<Register></Register>
  }
  ,
  {
    path:'/login',
    element:<Login></Login>
  },{
    path:'/forgotPassword',
    element:<ForgotPassword></ForgotPassword>
  },
  {
    path:'/resetPassword',
    element:<ResetPassword></ResetPassword>
  }
]);

createRoot(document.getElementById("root")).render(<RouterProvider router={Router} />);
