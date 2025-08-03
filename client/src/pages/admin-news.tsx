import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Plus, Edit, Trash2 } from "lucide-react";
import type { News, InsertNews } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminNews() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  const [formData, setFormData] = useState<Partial<InsertNews>>({
    titleAr: "",
    titleEn: "",
    contentAr: "",
    contentEn: "",
    summary: "",
    imageUrl: "",
    category: "match",
    priority: 1,
    isBreaking: false,
    tags: []
  });

  const { data: allNews } = useQuery<News[]>({
    queryKey: ["/api/news/latest?limit=50"],
  });

  const createNewsMutation = useMutation({
    mutationFn: (newsData: InsertNews) => apiRequest("/api/news", {
      method: "POST",
      body: newsData,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setFormData({
        titleAr: "",
        titleEn: "",
        contentAr: "",
        contentEn: "",
        summary: "",
        imageUrl: "",
        category: "match",
        priority: 1,
        isBreaking: false,
        tags: []
      });
      setIsCreating(false);
      toast({
        title: t("success", { ar: "نجح", en: "Success" }),
        description: t("newsCreated", { ar: "تم إنشاء الخبر بنجاح", en: "News created successfully" }),
      });
    },
    onError: () => {
      toast({
        title: t("error", { ar: "خطأ", en: "Error" }),
        description: t("newsCreateError", { ar: "فشل في إنشاء الخبر", en: "Failed to create news" }),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleAr || !formData.contentAr) {
      toast({
        title: t("error", { ar: "خطأ", en: "Error" }),
        description: t("fillRequired", { ar: "يرجى ملء الحقول المطلوبة", en: "Please fill required fields" }),
        variant: "destructive",
      });
      return;
    }

    createNewsMutation.mutate(formData as InsertNews);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      breaking: "bg-red-100 text-red-600",
      transfer: "bg-saudi-red-100 text-saudi-red",
      match: "bg-blue-100 text-blue-600",
      analysis: "bg-green-100 text-green-600",
    };
    return categoryConfig[category as keyof typeof categoryConfig] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowRight className="w-4 h-4 mr-2" />
              {t("backToAdmin", { ar: "العودة للوحة التحكم", en: "Back to Admin" })}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground font-tajawal">
            {t("newsManagement", { ar: "إدارة الأخبار", en: "News Management" })}
          </h1>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t("addNews", { ar: "إضافة خبر", en: "Add News" })}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News Form */}
        {(isCreating || editingNews) && (
          <Card>
            <CardHeader>
              <CardTitle>
                {isCreating 
                  ? t("addNews", { ar: "إضافة خبر جديد", en: "Add New News" })
                  : t("editNews", { ar: "تعديل الخبر", en: "Edit News" })
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Arabic Title */}
                <div>
                  <Label htmlFor="titleAr">{t("titleAr", { ar: "العنوان بالعربية *", en: "Title in Arabic *" })}</Label>
                  <Input
                    id="titleAr"
                    value={formData.titleAr}
                    onChange={(e) => setFormData({...formData, titleAr: e.target.value})}
                    placeholder={t("enterTitleAr", { ar: "أدخل العنوان بالعربية", en: "Enter title in Arabic" })}
                    required
                  />
                </div>

                {/* English Title */}
                <div>
                  <Label htmlFor="titleEn">{t("titleEn", { ar: "العنوان بالإنجليزية", en: "Title in English" })}</Label>
                  <Input
                    id="titleEn"
                    value={formData.titleEn || ""}
                    onChange={(e) => setFormData({...formData, titleEn: e.target.value})}
                    placeholder={t("enterTitleEn", { ar: "أدخل العنوان بالإنجليزية", en: "Enter title in English" })}
                  />
                </div>

                {/* Category */}
                <div>
                  <Label>{t("category", { ar: "التصنيف", en: "Category" })}</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breaking">{t("breaking", { ar: "عاجل", en: "Breaking" })}</SelectItem>
                      <SelectItem value="transfer">{t("transfer", { ar: "انتقالات", en: "Transfer" })}</SelectItem>
                      <SelectItem value="match">{t("match", { ar: "مباريات", en: "Match" })}</SelectItem>
                      <SelectItem value="analysis">{t("analysis", { ar: "تحليل", en: "Analysis" })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Summary */}
                <div>
                  <Label htmlFor="summary">{t("summary", { ar: "الملخص", en: "Summary" })}</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary || ""}
                    onChange={(e) => setFormData({...formData, summary: e.target.value})}
                    placeholder={t("enterSummary", { ar: "أدخل ملخص الخبر", en: "Enter news summary" })}
                    rows={3}
                  />
                </div>

                {/* Arabic Content */}
                <div>
                  <Label htmlFor="contentAr">{t("contentAr", { ar: "المحتوى بالعربية *", en: "Content in Arabic *" })}</Label>
                  <Textarea
                    id="contentAr"
                    value={formData.contentAr}
                    onChange={(e) => setFormData({...formData, contentAr: e.target.value})}
                    placeholder={t("enterContentAr", { ar: "أدخل محتوى الخبر بالعربية", en: "Enter content in Arabic" })}
                    rows={6}
                    required
                  />
                </div>

                {/* Image URL */}
                <div>
                  <Label htmlFor="imageUrl">{t("imageUrl", { ar: "رابط الصورة", en: "Image URL" })}</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl || ""}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Priority and Breaking */}
                <div className="flex items-center space-x-reverse space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="priority">{t("priority", { ar: "الأولوية (1-5)", en: "Priority (1-5)" })}</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center space-x-reverse space-x-2">
                    <Switch
                      checked={formData.isBreaking}
                      onCheckedChange={(checked) => setFormData({...formData, isBreaking: checked})}
                    />
                    <Label>{t("isBreaking", { ar: "خبر عاجل", en: "Breaking News" })}</Label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-reverse space-x-2">
                  <Button type="submit" disabled={createNewsMutation.isPending}>
                    {createNewsMutation.isPending ? t("saving", { ar: "جاري الحفظ...", en: "Saving..." }) : t("save", { ar: "حفظ", en: "Save" })}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsCreating(false);
                    setEditingNews(null);
                  }}>
                    {t("cancel", { ar: "إلغاء", en: "Cancel" })}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* News List */}
        <Card className={`${isCreating || editingNews ? '' : 'lg:col-span-2'}`}>
          <CardHeader>
            <CardTitle>{t("allNews", { ar: "جميع الأخبار", en: "All News" })}</CardTitle>
          </CardHeader>
          <CardContent>
            {allNews && allNews.length > 0 ? (
              <div className="space-y-4">
                {allNews.map((newsItem) => (
                  <div key={newsItem.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-reverse space-x-2 mb-2">
                          <Badge className={getCategoryBadge(newsItem.category)}>
                            {newsItem.category}
                          </Badge>
                          {newsItem.isBreaking && (
                            <Badge variant="destructive">
                              {t("breaking", { ar: "عاجل", en: "Breaking" })}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {t("priority", { ar: "الأولوية", en: "Priority" })}: {newsItem.priority}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-foreground mb-1">
                          {newsItem.titleAr}
                        </h3>
                        
                        {newsItem.summary && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {newsItem.summary}
                          </p>
                        )}
                        
                        <div className="flex items-center text-xs text-muted-foreground space-x-reverse space-x-4">
                          <span>{formatDate(newsItem.publishedAt!)}</span>
                          {newsItem.views && (
                            <span>
                              <i className="fas fa-eye mr-1" />
                              {newsItem.views}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-reverse space-x-2 mr-4">
                        <Button size="sm" variant="outline" onClick={() => setEditingNews(newsItem)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {t("noNews", { ar: "لا توجد أخبار", en: "No news found" })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}