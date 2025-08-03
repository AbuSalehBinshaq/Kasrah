import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { toggleLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="p-2 hover:bg-gray-100 rounded-full transition-smooth touch-manipulation"
    >
      <Globe className="h-5 w-5 text-saudi-red" />
    </Button>
  );
}
