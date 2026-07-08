import React from "react";

const Users = () => {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-10 shadow-lg">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">
          Welcome to the Users Page 👥
        </h1>

        <p className="text-lg leading-8 text-gray-600">
          Manage all registered users from one place. View user profiles, update
          user information, assign roles, or remove users when necessary to keep
          your platform secure and organized.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <button className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">
            Add User
          </button>

          <button className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100">
            View Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
