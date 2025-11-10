import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@/layouts/Root";
import Button from "@/components/atoms/Button";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector(state => state.user);
  const { logout } = useAuth();

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      
      {/* Top bar with logout */}
      <div className="lg:pl-64">
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              icon="Menu"
              onClick={handleMenuClick}
            />
          </div>
          <div className="flex items-center space-x-3 ml-auto">
            {user && (
              <>
                <span className="text-sm text-slate-600">
                  Welcome, {user.firstName || user.name || 'User'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="LogOut"
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Main content */}
        <main className="min-h-screen">
          <Outlet context={{ onMenuClick: handleMenuClick }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
