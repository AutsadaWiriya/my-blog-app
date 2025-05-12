import { Calendar, Home, Inbox, Search, Settings, MessageSquare } from "lucide-react";

export const menuItems = {
  items: [
    {
      title: "Home",
      url: "/",
      icon: Home
    },
    {
      title: "Chat",
      url: "/chat",
      icon: MessageSquare
    },
    {
      title: "Manage Users",
      url: "/manage/users",
      icon: Settings
    }
  ]
};