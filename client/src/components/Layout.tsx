import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";
import { LanguageToggle } from "./LanguageToggle";
import { BreakingNews } from "./BreakingNews";
import { useLanguage } from "@/hooks/useLanguage";
import { SITE_CONFIG } from "@/lib/constants";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Site Logo and Name */}
          <div className="flex items-center space-x-reverse space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-saudi-red to-saudi-red-dark rounded-lg flex items-center justify-center">
              <i className="fas fa-futbol text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900 font-tajawal">
              {t("siteName", SITE_CONFIG.name)}
            </h1>
          </div>

          {/* Language Toggle */}
          <LanguageToggle />
        </div>
      </header>

      {/* Breaking News Bar */}
      <BreakingNews />

      {/* Main Content */}
      <main className="pb-20">{children}</main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
