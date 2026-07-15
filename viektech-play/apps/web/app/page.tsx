"use client";
import React, { useState } from "react";
import { CiLock } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Button from "../components/button";
import Link from "next/link";

const Admin = () => {
  const [showPWord, setShowPWord] = useState(false);

  function handleToggleShowPWord() {
    setShowPWord(!showPWord);
  }
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-900 from-5% via-blue-100 via-20% to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-500 [text-shadow:2px_2px_6px_rgba(30,64,175,0.6)]">
            ViekPlay
          </h1>

          <h3 className="text-gray-600 mt-2 text-lg font-bold">Admin Login</h3>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block mb-2 text-gray-500 font-bold text-sm">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MdOutlineEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium" />

              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full border border-gray-200 rounded-lg p-3 outline-none placeholder:text-gray-300 placeholder:text-sm pl-8 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition text-gray-900"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-gray-500 font-bold text-sm">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CiLock className="absolute left-3 top-1/3 -translate-y-1/2 text-gray-400 font-medium" />
              <input
                type={showPWord ? "text" : "password"}
                required
                placeholder="Enter your password"
                className="w-full border border-gray-200 rounded-lg p-3 outline-none placeholder:text-gray-300 placeholder:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition pl-8 text-gray-900"
              />
              <div>
                <button type="button" onClick={handleToggleShowPWord}>
                  {showPWord ? (
                    <IoEyeOffOutline className="absolute right-3 top-1/3 -translate-y-1/2 text-gray-400 font-medium" />
                  ) : (
                    <IoEyeOutline className="absolute right-3 top-1/3 -translate-y-1/2 text-gray-400 font-medium" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <Link href="/dashboard">
            <Button type="button">Login</Button>
          </Link>
          <div className="pt-2">
            <button
              type="button"
              className="w-full text-center text-sm font-medium text-blue-500 hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Admin;
