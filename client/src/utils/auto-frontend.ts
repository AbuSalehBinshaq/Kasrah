import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/hooks/useLanguage";

// Auto Frontend Generator
export class AutoFrontend {
  private entityName: string;
  private fields: Field[];
  private apiEndpoint: string;

  constructor(entityName: string, fields: Field[], apiEndpoint: string) {
    this.entityName = entityName;
    this.fields = fields;
    this.apiEndpoint = apiEndpoint;
  }

  // Generate List Component
  generateListComponent() {
    return () => {
      const { t } = useLanguage();
      const queryClient = useQueryClient();
      const [searchTerm, setSearchTerm] = useState("");
      const [selectedItems, setSelectedItems] = useState<string[]>([]);

      // Fetch data
      const { data: items, isLoading, error } = useQuery({
        queryKey: [this.entityName],
        queryFn: async () => {
          const response = await fetch(`${this.apiEndpoint}?search=${searchTerm}`);
          if (!response.ok) throw new Error("Failed to fetch");
          return response.json();
        },
      });

      // Delete mutation
      const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
          const response = await fetch(`${this.apiEndpoint}/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          });
          if (!response.ok) throw new Error("Failed to delete");
          return response.json();
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [this.entityName] });
        },
      });

      // Bulk delete
      const bulkDeleteMutation = useMutation({
        mutationFn: async (ids: string[]) => {
          const response = await fetch(`${this.apiEndpoint}/bulk`, {
            method: "DELETE",
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}` 
            },
            body: JSON.stringify({ ids }),
          });
          if (!response.ok) throw new Error("Failed to delete");
          return response.json();
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [this.entityName] });
          setSelectedItems([]);
        },
      });

      const handleDelete = (id: string) => {
        if (confirm(t("confirmDelete", { ar: "هل أنت متأكد من الحذف؟", en: "Are you sure?" }))) {
          deleteMutation.mutate(id);
        }
      };

      const handleBulkDelete = () => {
        if (selectedItems.length === 0) return;
        if (confirm(t("confirmBulkDelete", { ar: "هل أنت متأكد من حذف العناصر المحددة؟", en: "Are you sure you want to delete selected items?" }))) {
          bulkDeleteMutation.mutate(selectedItems);
        }
      };

      if (isLoading) {
        return (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-saudi-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>{t("loading", { ar: "جاري التحميل...", en: "Loading..." })}</p>
          </div>
        );
      }

      if (error) {
        return (
          <Alert variant="destructive">
            <AlertDescription>
              {t("errorLoading", { ar: "خطأ في التحميل", en: "Error loading data" })}
            </AlertDescription>
          </Alert>
        );
      }

      return (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-tajawal">
                {t(this.entityName, { ar: this.getArabicName(), en: this.getEnglishName() })}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t(`${this.entityName}Description`, { 
                  ar: `إدارة ${this.getArabicName()}`, 
                  en: `Manage ${this.getEnglishName()}` 
                })}
              </p>
            </div>
            <Button onClick={() => window.location.href = `/${this.entityName}/new`}>
              {t("addNew", { ar: "إضافة جديد", en: "Add New" })}
            </Button>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder={t("search", { ar: "البحث...", en: "Search..." })}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {selectedItems.length > 0 && (
              <Button variant="destructive" onClick={handleBulkDelete}>
                {t("deleteSelected", { ar: `حذف المحدد (${selectedItems.length})`, en: `Delete Selected (${selectedItems.length})` })}
              </Button>
            )}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items?.map((item: any) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, item.id]);
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== item.id));
                        }
                      }}
                    />
                    <Badge variant="outline">{item.id}</Badge>
                  </div>
                  
                  {this.fields.map((field) => (
                    <div key={field.name} className="mb-2">
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t(field.name, { ar: field.arabicLabel, en: field.englishLabel })}
                      </Label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {this.formatFieldValue(item[field.name], field.type)}
                      </p>
                    </div>
                  ))}

                  <div className="flex items-center space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/${this.entityName}/${item.id}`}
                    >
                      {t("view", { ar: "عرض", en: "View" })}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/${this.entityName}/${item.id}/edit`}
                    >
                      {t("edit", { ar: "تعديل", en: "Edit" })}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      {t("delete", { ar: "حذف", en: "Delete" })}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {items?.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  {t("noItems", { ar: "لا توجد عناصر", en: "No items found" })}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      );
    };
  }

  // Generate Form Component
  generateFormComponent() {
    return () => {
      const { t } = useLanguage();
      const queryClient = useQueryClient();
      const [formData, setFormData] = useState(this.getInitialFormData());

      const createMutation = useMutation({
        mutationFn: async (data: any) => {
          const response = await fetch(this.apiEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(data),
          });
          if (!response.ok) throw new Error("Failed to create");
          return response.json();
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [this.entityName] });
          window.location.href = `/${this.entityName}`;
        },
      });

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
      };

      const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
      };

      return (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("addNew", { ar: `إضافة ${this.getArabicName()} جديد`, en: `Add New ${this.getEnglishName()}` })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {this.fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>
                      {t(field.name, { ar: field.arabicLabel, en: field.englishLabel })}
                    </Label>
                    {this.renderField(field, formData[field.name], (value) => handleInputChange(field.name, value))}
                  </div>
                ))}

                <div className="flex items-center space-x-4">
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{t("saving", { ar: "جاري الحفظ...", en: "Saving..." })}</span>
                      </div>
                    ) : (
                      t("save", { ar: "حفظ", en: "Save" })
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    {t("cancel", { ar: "إلغاء", en: "Cancel" })}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    };
  }

  private getInitialFormData() {
    const data: any = {};
    this.fields.forEach(field => {
      data[field.name] = field.defaultValue || "";
    });
    return data;
  }

  private renderField(field: Field, value: any, onChange: (value: any) => void) {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
        return (
          <Input
            id={field.name}
            type={field.type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );
      case "textarea":
        return (
          <textarea
            id={field.name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
          />
        );
      case "select":
        return (
          <select
            id={field.name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <Input
            id={field.name}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );
    }
  }

  private formatFieldValue(value: any, type: string) {
    if (value === null || value === undefined) return "-";
    
    switch (type) {
      case "date":
        return new Date(value).toLocaleDateString();
      case "boolean":
        return value ? "نعم" : "لا";
      default:
        return String(value);
    }
  }

  private getArabicName(): string {
    const names: { [key: string]: string } = {
      users: "المستخدمين",
      teams: "الفرق",
      players: "اللاعبين",
      matches: "المباريات",
      transfers: "الانتقالات",
      news: "الأخبار",
      files: "الملفات",
    };
    return names[this.entityName] || this.entityName;
  }

  private getEnglishName(): string {
    return this.entityName.charAt(0).toUpperCase() + this.entityName.slice(1);
  }
}

// Field interface
interface Field {
  name: string;
  type: "text" | "email" | "password" | "textarea" | "select" | "date" | "boolean";
  label: string;
  arabicLabel: string;
  englishLabel: string;
  required?: boolean;
  defaultValue?: any;
  options?: { value: string; label: string }[];
}

// Auto-generate frontend components
export function generateAllFrontendComponents() {
  const fieldDefinitions: { [key: string]: Field[] } = {
    users: [
      { name: "username", type: "text", label: "Username", arabicLabel: "اسم المستخدم", englishLabel: "Username", required: true },
      { name: "email", type: "email", label: "Email", arabicLabel: "البريد الإلكتروني", englishLabel: "Email", required: true },
      { name: "firstName", type: "text", label: "First Name", arabicLabel: "الاسم الأول", englishLabel: "First Name" },
      { name: "lastName", type: "text", label: "Last Name", arabicLabel: "اسم العائلة", englishLabel: "Last Name" },
      { name: "role", type: "select", label: "Role", arabicLabel: "الدور", englishLabel: "Role", options: [
        { value: "user", label: "User" },
        { value: "editor", label: "Editor" },
        { value: "admin", label: "Admin" }
      ]},
    ],
    teams: [
      { name: "name", type: "text", label: "Team Name", arabicLabel: "اسم الفريق", englishLabel: "Team Name", required: true },
      { name: "city", type: "text", label: "City", arabicLabel: "المدينة", englishLabel: "City" },
      { name: "stadium", type: "text", label: "Stadium", arabicLabel: "الملعب", englishLabel: "Stadium" },
    ],
    news: [
      { name: "title", type: "text", label: "Title", arabicLabel: "العنوان", englishLabel: "Title", required: true },
      { name: "content", type: "textarea", label: "Content", arabicLabel: "المحتوى", englishLabel: "Content", required: true },
      { name: "category", type: "select", label: "Category", arabicLabel: "الفئة", englishLabel: "Category", options: [
        { value: "breaking", label: "Breaking News" },
        { value: "transfer", label: "Transfer News" },
        { value: "match", label: "Match News" }
      ]},
    ],
  };

  const components: { [key: string]: any } = {};

  Object.keys(fieldDefinitions).forEach(entityName => {
    const generator = new AutoFrontend(entityName, fieldDefinitions[entityName], `/api/${entityName}`);
    components[`${entityName}List`] = generator.generateListComponent();
    components[`${entityName}Form`] = generator.generateFormComponent();
  });

  return components;
} 