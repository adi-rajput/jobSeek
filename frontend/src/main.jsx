import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.css";
import UserSignupForm from "./component/user_register.jsx";
import User_login from "./component/user_login.jsx";
import Employer_login from "./component/employer_login.jsx";
import Employer_register from "./component/employer_register.jsx";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { 
      }],
  },
  {
    path: "/user_login",
    element: <User_login />,
  },
  {
    path: "/employer_login",
    element: <Employer_login />,
  },
  {
    path: "/user_register",
    element: <UserSignupForm />,
  },
  {
    path: "/employer_register",
    element: <Employer_register/>,
  },
]);

createRoot(document.getElementById("root")).render(<RouterProvider router={Router} />);
