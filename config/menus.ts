import { Application, Calendar, DashBoard, Graph, Messages, User, ClipBoard, Files, Building2, DocsCheck, List, Map, Flag, Cart } from "@/components/svg";
import type { ComponentType } from "react";

export interface MenuItem {
  title: string;
  icon: ComponentType<{ className?: string }>;
  href?: string;
  child?: MenuItem[];
}

export const menus: MenuItem[] = [
  {
    title: "Dashboard",
    icon: DashBoard,
    child: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: Graph,
      },
    ],
  },
  {
    title: "Operations",
    icon: List,
    child: [
      { title: "My Bookings", icon: DocsCheck, href: "/operations/bookings" },
      { title: "Active Trips", icon: Map, href: "/trips" },
      { title: "Wallet", icon: Cart, href: "/wallet" },
      { title: "Completed Bookings", icon: Flag, href: "/operations/completed" },
    ],
  },
  {
    title: "Application",
    icon: Application,
    child: [
      { title: "Chat", icon: Messages, href: "/chat" },
      { title: "Calendar", icon: Calendar, href: "/calendar" },
      { title: "Assignments", icon: DocsCheck, href: "/assignments" },
    ],
  },
  {
    title: "Profile",
    icon: User,
    child: [
      {
        title: "Profile Overview",
        href: "/profile",
        icon: User,
      },
      {
        title: "Personal Details",
        href: "/profile/settings",
        icon: ClipBoard,
      },
      {
        title: "License & Documents",
        href: "/profile/settings/documents",
        icon: Files,
      },
      {
        title: "Vehicle Information",
        href: "/profile/settings/vehicle",
        icon: Building2,
      },
    ],
  },
];

export type MenuType = (typeof menus)[number];
