import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

export const menuItems = {
  items: [
    {
      title: "Home",
      url: "/",
      icon: Home
    },
    {
      title: "Inbox",
      url: "/index",
      icon: Inbox
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar
    },
    {
      title: "Search",
      url: "#",
      icon: Search
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings
    },
    {
      title: "Manage Users",
      url: "/manage/users",
      icon: Settings
    }
  ]
};