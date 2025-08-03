import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface AdminProtectedProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "editor";
}

export function AdminProtected({ children, requiredRole = "editor" }: AdminProtectedProps) {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check if user is authenticated
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["auth/me"],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      return response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (error) {
      setIsAuthenticated(false);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    } else if (user) {
      setIsAuthenticated(true);
      
      // Check role permissions
      if (requiredRole === "admin" && user.role !== "admin") {
        setLocation("/admin");
        return;
      }
      
      if (requiredRole === "editor" && !["admin", "editor"].includes(user.role)) {
        setLocation("/admin");
        return;
      }
    }
  }, [user, error, requiredRole, setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setLocation("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-saudi-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {t("loading", { ar: "جاري التحميل...", en: "Loading..." })}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-lock text-red-600 text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-tajawal">
              {t("accessDenied", { ar: "تم رفض الوصول", en: "Access Denied" })}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t("loginRequired", { 
                ar: "يجب تسجيل الدخول للوصول إلى هذه الصفحة", 
                en: "You must be logged in to access this page" 
              })}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => setLocation("/admin/login")}
                className="w-full bg-saudi-red hover:bg-saudi-red-dark"
              >
                {t("login", { ar: "تسجيل الدخول", en: "Login" })}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation("/")}
                className="w-full"
              >
                {t("backToSite", { ar: "العودة للموقع", en: "Back to Site" })}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-saudi-red to-saudi-red-dark rounded-lg flex items-center justify-center">
                <i className="fas fa-futbol text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white font-tajawal">
                {t("adminPanel", { ar: "لوحة التحكم", en: "Admin Panel" })}
              </h1>
            </div>
            
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t("welcome", { ar: "مرحباً", en: "Welcome" })} {user?.firstName || user?.username}
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt ml-2" />
                {t("logout", { ar: "تسجيل الخروج", en: "Logout" })}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 