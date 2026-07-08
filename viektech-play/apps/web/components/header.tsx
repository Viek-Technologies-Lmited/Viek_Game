"use client";

import { useState } from "react";
import { IoSearchOutline, IoNotificationsOutline } from "react-icons/io5";
import { LuPanelLeftOpen } from "react-icons/lu";

interface HeaderProps {
  onOpenSidebar: () => void;
}

export default function SearchBar({ onOpenSidebar }: HeaderProps) {
  const [search, setSearch] = useState("");

  return (
    <header className="flex items-center justify-between rounded-2xl bg-white px-6 py-4 ">
      {/* Left */}
      <div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500">Welcome back, Admin 👋</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="relative hidden md:block w-80">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Notification */}
        <button className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-blue-100 hover:text-blue-600">
          <IoNotificationsOutline className="text-2xl" />

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </button>

        {/* Profile */}
        <button className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-gray-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-md">
            A
          </div>

          <div className="hidden sm:block text-left">
            <h3 className="font-semibold text-gray-800">Admin</h3>

            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
        </button>
      </div>

      {/* sidebar mobile button */}
      <button
        onClick={onOpenSidebar}
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500 text-white transition hover:bg-blue-800 lg:hidden cursor-pointer shrink-0"
        aria-label="Open Sidebar"
      >
        <LuPanelLeftOpen className="text-xl" />
      </button>
    </header>
  );
}
