import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";

interface LoginForm {
  username: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };
  token: string;
}

export default function AdminLogin() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm): Promise<LoginResponse> => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Store token and user data
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirect to admin panel
      setLocation("/admin");
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof LoginForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saudi-red-50 to-saudi-red-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-saudi-red to-saudi-red-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-futbol text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-tajawal mb-2">
            {t("adminLogin", { ar: "تسجيل دخول الإدارة", en: "Admin Login" })}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("loginDescription", { 
              ar: "سجل دخولك للوصول إلى لوحة التحكم", 
              en: "Sign in to access the admin panel" 
            })}
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-tajawal">
              {t("welcomeBack", { ar: "مرحباً بعودتك", en: "Welcome Back" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  {t("username", { ar: "اسم المستخدم", en: "Username" })}
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange("username")}
                  placeholder={t("usernamePlaceholder", { ar: "أدخل اسم المستخدم", en: "Enter username" })}
                  className="h-12 text-lg"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t("password", { ar: "كلمة المرور", en: "Password" })}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  placeholder={t("passwordPlaceholder", { ar: "أدخل كلمة المرور", en: "Enter password" })}
                  className="h-12 text-lg"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-lg font-medium bg-saudi-red hover:bg-saudi-red-dark"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center space-x-reverse space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>
                      {t("signingIn", { ar: "جاري تسجيل الدخول...", en: "Signing in..." })}
                    </span>
                  </div>
                ) : (
                  t("signIn", { ar: "تسجيل الدخول", en: "Sign In" })
                )}
              </Button>
            </form>

            {/* Back to Site Link */}
            <div className="mt-6 text-center">
              <Link href="/">
                <Button variant="ghost" className="text-saudi-red hover:text-saudi-red-dark">
                  <i className="fas fa-arrow-right ml-2" />
                  {t("backToSite", { ar: "العودة للموقع", en: "Back to Site" })}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("adminAccess", { 
              ar: "هذا القسم مخصص للمديرين والمحررين فقط", 
              en: "This section is for administrators and editors only" 
            })}
          </p>
        </div>
      </div>
    </div>
  );
} 