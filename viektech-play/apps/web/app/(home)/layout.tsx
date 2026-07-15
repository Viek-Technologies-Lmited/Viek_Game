"use client";

import SideBar from "@/components/side-bar";
import Header from "@/components/header";
import React, { useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="flex min-h-screen bg-gray-50">
      <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <section className="flex-1 min-w-0 flex flex-col p-6 gap-6">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        <div className="flex-1">
          {children}
        </div>
      </section>
    </main>
  );
}

// export default DashboardLayout
