"use client";

import React, { useState } from "react";
import { sideBarRoutes } from "@/components/fakeJson";
import { GrPlay } from "react-icons/gr";
import { LuPanelLeftClose, LuPanelRightClose } from "react-icons/lu";
import Link from "next/link";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen flex-col bg-blue-900 text-white shadow-2xl transition-all duration-300
        ${isCollapsed ? "w-24" : "w-72"}
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:top-auto lg:left-auto lg:z-0 lg:translate-x-0`}
      >
        {/* Header */}
        <div>
          <div className="border-b border-blue-800 px-4 py-6">
            <div className="flex items-center gap-3 overflow-hidden">
              <GrPlay className="text-3xl text-blue-400" />

              {!isCollapsed && (
                <h1 className="whitespace-nowrap text-2xl font-bold">
                  ViekPlay
                  <span className="ml-1 text-lg text-blue-400">Admin</span>
                </h1>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4 flex flex-col gap-2 px-3">
            {sideBarRoutes.map(({ icon, text, path }) => (
              <Link
                href={path}
                key={text}
                className={`flex items-center rounded-xl py-3 transition-all duration-300 hover:bg-blue-800
                ${
                  isCollapsed
                    ? "justify-center px-0"
                    : "justify-start gap-4 px-4"
                }`}
              >
                <span className="shrink-0 text-xl">{icon}</span>

                {!isCollapsed && (
                  <span className="whitespace-nowrap font-medium">{text}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Collapse Button */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="absolute bottom-5 right-5 hidden h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition hover:bg-blue-800 hover:text-white lg:flex"
        >
          {isCollapsed ? (
            <LuPanelRightClose className="text-xl" />
          ) : (
            <LuPanelLeftClose className="text-xl" />
          )}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition hover:bg-blue-800 hover:text-white lg:hidden"
        >
          <LuPanelRightClose className="text-xl" />
        </button>
      </aside>
    </>
  );
};

export default SideBar;
