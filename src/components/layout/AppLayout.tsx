// Shell com sidebar/topbar
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">Sidebar</aside>
      {/* Main content */}
      <main className="main-content">{children}</main>
    </div>
  );
}
