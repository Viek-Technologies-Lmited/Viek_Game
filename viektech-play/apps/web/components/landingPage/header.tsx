"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiBars3, HiXMark } from "react-icons/hi2";
import Button from "../button";

const Header = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/d", label: "Home" },
    { href: "/dd", label: "Play" },
    { href: "/ddd", label: "Leaderboard" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold text-blue-800">
          ViekPlay
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-blue-800 underline underline-offset-3 decoration-2"
                    : "text-slate-700"
                }`}
              >
                {link.label}

                {isActive && (
                  <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-blue-800" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-4 px-5 md:flex">
          <Button
            type="button"
            className="rounded-full border border-blue-800 bg-transparent px-6 py-2 text-[12px] text-blue-800 transition hover:bg-blue-800 hover:text-white"
          >
            Login
          </Button>

          <Button
            type="button"
            className="rounded-full bg-blue-800 px-6 py-2 text-[12px] font-semibold text-white transition hover:bg-blue-900"
          >
            Sign Up
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-3xl text-blue-800 md:hidden"
        >
          {isOpen ? <HiXMark /> : <HiBars3 />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="flex flex-col px-6 py-5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-800/10 text-blue-800"
                      : "text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-6 flex flex-col gap-3">
              <Button
                type="button"
                className="rounded-full border border-blue-800 bg-transparent text-blue-800"
              >
                Login
              </Button>

              <Button
                type="button"
                className="rounded-full bg-blue-800 text-white"
              >
                Sign Up
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
