"use client";

import { dashboardStats } from "./fakeJson";

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 px-6">
      {dashboardStats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl border bg-white p-6 shadow-sm"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <Icon className="text-3xl text-blue-600" />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-blue-500">{item.count}</h2>

              <p className="mt-1 text-sm text-gray-500">{item.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
