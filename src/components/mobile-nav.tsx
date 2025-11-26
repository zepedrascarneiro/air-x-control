"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Calendar, Plane, DollarSign } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
};

const navItems = [
  {
    href: "/dashboard",
    label: "Início",
    icon: Home,
  },
  {
    href: "/calendar",
    label: "Reservas",
    icon: Calendar,
  },
  {
    href: "/dashboard#editor-panel",
    label: "Voos",
    icon: Plane,
  },
  {
    href: "/dashboard#editor-panel",
    label: "Despesas",
    icon: DollarSign,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 md:hidden safe-area-bottom">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === "/dashboard" && pathname === "/dashboard");
          const Icon = item.icon;
          
          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
