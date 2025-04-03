import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Mock authentication state - in a real app, this would come from auth context/provider
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Mock user data - in a real app, this would come from user context/provider
  const [user, setUser] = useState({
    name: "John Doe",
    profilePic: "" // Empty for testing the fallback
  });

  // For demo purposes only - toggle login status
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-md shadow-lg" : "bg-black"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl md:px-16">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="w-auto h-14 md:h-16" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="items-center hidden space-x-8 md:flex">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/jobs">Jobs</NavLink>
          <NavLink href="/applications">Applications</NavLink>
          <NavLink href="/notifications">Notifications</NavLink>
        </div>

        {/* Auth Section: Register Button or User Profile */}
        <div className="items-center hidden space-x-4 md:flex">
          {isLoggedIn ? (
            <>
              <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden bg-blue-600 border-2 border-blue-500 rounded-full">
                {user.profilePic ? (
                  <img 
                    src={user.profilePic} 
                    alt={user.name}
                    className="object-cover w-full h-full" 
                  />
                ) : (
                  <FaUser className="w-5 h-5 text-white" />
                )}
              </div>
              
              <button 
                onClick={toggleLogin} 
                className="flex items-center px-5 py-2 font-medium text-white transition-all duration-300 transform rounded-md bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 hover:scale-105 hover:shadow-lg"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </>
          ) : (
            <Link to="/register">
              <button 
                onClick={toggleLogin}
                className="px-6 py-2 font-medium text-white transition-all duration-300 transform rounded-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:scale-105 hover:shadow-lg"
              >
                Register
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-white transition-colors rounded-full hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full p-6 space-y-8 text-center">
          {isLoggedIn && (
            <div className="flex flex-col items-center mb-4 space-y-3">
              <div className="relative flex items-center justify-center w-16 h-16 overflow-hidden bg-blue-600 border-2 border-blue-500 rounded-full">
                {user.profilePic ? (
                  <img 
                    src={user.profilePic} 
                    alt={user.name}
                    className="object-cover w-full h-full" 
                  />
                ) : (
                  <FaUser className="w-8 h-8 text-white" />
                )}
              </div>
              <span className="text-xl font-medium text-white">{user.name}</span>
            </div>
          )}
          
          <MobileNavLink href="/" onClick={() => setOpen(false)}>
            Home
          </MobileNavLink>
          <MobileNavLink href="/jobs" onClick={() => setOpen(false)}>
            Jobs
          </MobileNavLink>
          <MobileNavLink href="/applications" onClick={() => setOpen(false)}>
            Applications
          </MobileNavLink>
          <MobileNavLink href="/notifications" onClick={() => setOpen(false)}>
            Notifications
          </MobileNavLink>
          
          {isLoggedIn ? (
            <button
              onClick={() => {
                toggleLogin();
                setOpen(false);
              }}
              className="flex items-center px-8 py-3 mt-4 font-medium text-white transition-all duration-300 transform rounded-md bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 hover:scale-105"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          ) : (
            <Link
              to="/register"
              onClick={() => {
                toggleLogin();
                setOpen(false);
              }}
              className="inline-block mt-4"
            >
              <button className="px-8 py-3 font-medium text-white transition-all duration-300 transform rounded-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:scale-105">
                Register
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

// Desktop Navigation Link Component
const NavLink = ({ href, children }) => {
  return (
    <Link
      to={href}
      className="relative text-white font-medium hover:text-blue-400 transition-colors duration-300 text-lg after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-400 after:transition-all hover:after:w-full"
    >
      {children}
    </Link>
  );
};

// Mobile Navigation Link Component
const MobileNavLink = ({ href, onClick, children }) => {
  return (
    <Link
      to={href}
      onClick={onClick}
      className="text-2xl font-medium text-white transition-colors duration-300 hover:text-blue-400"
    >
      {children}
    </Link>
  );
};

export default Navbar;
