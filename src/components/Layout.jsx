import React from 'react';
import Navbar from '../components/ui/NavBar';
import Footer from '../components/ui/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => (
  <>
    <Navbar />
    <main className="min-h-screen">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default Layout;
