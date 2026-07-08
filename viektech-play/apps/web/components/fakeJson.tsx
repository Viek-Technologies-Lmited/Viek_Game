import { LuLayoutDashboard } from "react-icons/lu";
import { FaQuestionCircle } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import { MdOutlineCategory, MdSportsEsports } from "react-icons/md";
import { PiRankingBold } from "react-icons/pi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";

export const sideBarRoutes = [
  {
    path: "/dashboard",
    icon: <LuLayoutDashboard />,
    text: "Dashboard",
  },
  {
    path: "/questions",
    icon: <FaQuestionCircle />,
    text: "Questions",
  },
  {
    path: "/categories",
    icon: <MdOutlineCategory />,
    text: "Categories",
  },
  {
    path: "/users",
    icon: <HiUsers />,
    text: "Users",
  },
  {
    path: "/gameModes",
    icon: <MdSportsEsports />,
    text: "Game Modes",
  },
  {
    path: "/leaderboard",
    icon: <PiRankingBold />,
    text: "Leaderboard",
  },
  {
    path: "/payments-subscription",
    icon: <RiMoneyDollarCircleLine />,
    text: "Payments / Subscriptions",
  },
  {
    path: "/settings",
    icon: <IoSettingsOutline />,
    text: "Settings",
  },
];

import { FiHelpCircle, FiUsers } from "react-icons/fi";
import { LuGamepad2 } from "react-icons/lu";
import { HiOutlineSparkles } from "react-icons/hi2";

export const dashboardStats = [
  {
    id: 1,
    title: "Total Questions",
    count: "2,487",
    icon: FiHelpCircle,
  },
  {
    id: 2,
    title: "Active Users",
    count: "18,642",
    icon: FiUsers,
  },
  {
    id: 3,
    title: "Games Played Today",
    count: "4,935",
    icon: LuGamepad2,
  },
  {
    id: 4,
    title: "Premium Subscribers",
    count: "1,248",
    icon: HiOutlineSparkles,
  },
];
