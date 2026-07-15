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

export const landingstats = [
  {
    number: "12.2K",
    text: "ACTIVE COMPETITIONS",
  },
  {
    number: "2.1M",
    text: "PUZZLED SOLVED",
  },
  {
    number: "$50K",
    text: "MONTHLY PRICE",
  },
  {
    number: "99.9%",
    text: "PERCISION ENGINE",
  },
];

export const howItWorks = [
  {
    step: "Step 1",
    image: "/signUp.png",
    // title: "Sign Up ",
    // text: "Create an account or continue as guest",
  },
  {
    step: "Step 2",
    image: "/takeQuiz.png",
    // title: "Take Quiz",
    // text: "Answer timed questions on tech ",
  },
  {
    step: "Step 3",
    image: "/earnReward.png",
    // title: "Earn Rewards",
    // text: "Get your score, climb the leaderboard and win prizes.",
  },
];

export const topContenders = [
  {
    image: "/favour.png",
    number: "2",
    name: "FAVOUR",
    points: "2800",
  },
  {
    image: "/vee.png",
    number: "1",
    name: "VEE",
    points: "10,000",
  },
  {
    image: "/kenny.png",
    number: "3",
    name: "KENNY",
    points: "2000",
  },
  {
    image: "/kenny.png",
    number: "4",
    name: "David",
    points: "1800",
  },
  {
    image: "/kenny.png",
    number: "5",
    name: "Kemi",
    points: "1550",
  },
];

export const lastSectionCards = [
  "/Frame46.png",
  "/Frame44.png",
  "/Frame50.png",
];
