"use client";

import { useState, useEffect } from "react";
import { FiHelpCircle, FiUsers } from "react-icons/fi";
import { LuGamepad2 } from "react-icons/lu";
import { HiOutlineSparkles } from "react-icons/hi2";
import { useAuth } from "../app/lib/auth-context";
import { adminApi } from "../app/lib/api-client";
import type { DashboardStats as DashboardStatsType } from "@viekplay/shared-types";

const DashboardStats = () => {
  const { token, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      adminApi.getStats(token)
        .then(setStats)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const displayStats = [
    {
      id: 1,
      title: "Total Questions",
      count: stats?.totalQuestions?.toLocaleString() || "0",
      icon: FiHelpCircle,
    },
    {
      id: 2,
      title: "Active Users",
      count: stats?.totalUsers?.toLocaleString() || "0",
      icon: FiUsers,
    },
    {
      id: 3,
      title: "Games Played Today",
      count: stats?.totalGames?.toLocaleString() || "0",
      icon: LuGamepad2,
    },
    {
      id: 4,
      title: "Premium Subscribers",
      count: "0", // Not yet implemented in backend
      icon: HiOutlineSparkles,
    },
  ];

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 px-6">
      {displayStats.map((item) => {
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
