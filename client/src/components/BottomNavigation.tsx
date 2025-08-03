import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { NAVIGATION_ITEMS } from "@/lib/constants";

export function BottomNavigation() {
  const [location] = useLocation();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = location === item.route;
          
          return (
            <Link key={item.key} href={item.route}>
              <button className="flex flex-col items-center py-2 px-3 space-y-1 transition-smooth touch-manipulation">
                <i
                  className={`${item.icon} text-lg ${
                    isActive ? "text-saudi-red" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-saudi-red" : "text-gray-400"
                  }`}
                >
                  {t(item.key, { ar: item.labelAr, en: item.labelEn })}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
