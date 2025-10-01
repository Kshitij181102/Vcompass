import React from 'react';
import Navbar from '../components/ui/NavBar'; // or wherever your NavBar is
import Footer from '../components/ui/Footer'; // or wherever your Footer is

import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
  
    </>
  );
};

export default Layout;
