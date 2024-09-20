import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";

const Header = () => {
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/onboard' || location.pathname === '/signup') {
    return null;
  }

  return (
    <div>
      <Navbar />
    </div>
  );
};

export default Header;
