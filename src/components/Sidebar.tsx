"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Bookmark, Clock, Settings, Tv } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Compass, label: "Discover", href: "/search" },
    { icon: Bookmark, label: "Watchlist", href: "/watchlist" },
    { icon: Clock, label: "History", href: "/history" },
  ];

  return (
    <aside className="hidden md:flex lg:hidden w-[260px] h-screen fixed left-0 top-0 bg-[#0a0a0a] border-r border-white/5 p-6 flex-col justify-between z-50 overflow-y-auto">
      <div>
        <div className="mb-10">
          <Link href="/" className="text-red-600 font-black text-3xl tracking-tighter hover:opacity-90 transition-opacity">
            PIXELMOVIIES
          </Link>
          <div className="text-gray-400 text-sm mt-1 font-medium tracking-wide uppercase text-[10px]">Premium Platform</div>
        </div>

        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-red-600/10 text-red-500 font-bold' 
                    : 'hover:bg-white/5 text-gray-400 hover:text-white font-medium'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-10 mb-4 px-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Platforms</div>
        <div className="flex flex-col gap-2">
          <Link href="/platform/netflix" className="flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/5 text-gray-400 hover:text-white font-medium">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" className="w-5 h-5 object-contain" alt="Netflix" />
            <span>Netflix</span>
          </Link>
          <Link href="/platform/prime" className="flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/5 text-gray-400 hover:text-white font-medium">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg" className="w-5 h-5 object-contain" alt="Prime" />
            <span>Prime Video</span>
          </Link>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-white/5">
        <Link 
          href="/settings"
          className="flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/5 text-gray-400 hover:text-white font-medium"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
