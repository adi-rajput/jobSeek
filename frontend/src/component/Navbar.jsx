import { useState } from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="text-white bg-black">
      <div className="flex items-center justify-between px-6 py-4 md:px-16">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-auto h-14 md:h-16" />
        </div>

        <div className="hidden space-x-6 text-lg md:flex">
          <div className="cursor-pointer hover:text-gray-500">Home</div>
          <div className="cursor-pointer hover:text-gray-500">Jobs</div>
          <div className="cursor-pointer hover:text-gray-500">Applications</div>
          <div className="cursor-pointer hover:text-gray-500">Notifications</div>
        </div>

        <div className="hidden md:block">
          <button className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600">
            Register
          </button>
        </div>

        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} className="text-2xl">
            {open ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="flex flex-col items-center py-4 space-y-4 bg-gray-800 md:hidden">
          <div className="cursor-pointer hover:text-gray-500">Home</div>
          <div className="cursor-pointer hover:text-gray-500">Jobs</div>
          <div className="cursor-pointer hover:text-gray-500">Applications</div>
          <div className="cursor-pointer hover:text-gray-500">Notifications</div>
          <button className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600">
            Register
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
