import React, { PropsWithChildren } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />
      {/* Content */}
      <main className="flex-grow pt-16">{children}</main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
