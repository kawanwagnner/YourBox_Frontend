// Shell com sidebar/topbar

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../state/auth.store";
import Button from "../ui/Button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = React.useCallback(async () => {
    try {
      await logout();
    } finally {
      // ensure user is redirected even if logout request fails
      navigate("/");
    }
  }, [logout, navigate]);

  return (
    <div className="app-layout">
      <header className="w-full border-b bg-white/80 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-bold">YourBox</div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <span className="text-sm text-slate-700">
              {user.email || user.name}
            </span>
          ) : null}
          <Button onClick={handleLogout}>Sair</Button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">Sidebar</aside>
      {/* Main content */}
      <main className="main-content">{children}</main>
    </div>
  );
}
