"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlaySquare, Search, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: PlaySquare, label: "Clips", href: "/clips" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: User, label: "My Netflix", href: "/profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#121212]/95 backdrop-blur-xl border-t border-[#2A2A2A] pb-safe pt-2 z-[100] flex justify-around items-center px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link 
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center p-2 min-w-[70px] ${
              isActive ? 'text-white' : 'text-[#8C8C8C] hover:text-white'
            } transition-colors`}
          >
            <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
