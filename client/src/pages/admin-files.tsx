import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { AdminProtected } from "@/components/AdminProtected";
import { Upload, Trash2, Download, Eye, Search } from "lucide-react";

interface File {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  isPublic: boolean;
}

export default function AdminFiles() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch files
  const { data: files, isLoading, error } = useQuery<File[]>({
    queryKey: ["/api/files"],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch files");
      return response.json();
    },
  });

  // Upload file mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/files/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      setUploadProgress(0);
      setSelectedFile(null);
    },
    onError: (error: Error) => {
      console.error("Upload error:", error);
      setUploadProgress(0);
    },
  });

  // Delete file mutation
  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Delete failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file as any);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleDelete = (fileId: string) => {
    if (confirm(t("confirmDelete", { ar: "هل أنت متأكد من حذف هذا الملف؟", en: "Are you sure you want to delete this file?" }))) {
      deleteMutation.mutate(fileId);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredFiles = files?.filter(file =>
    file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.filename.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <AdminProtected requiredRole="editor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-tajawal">
              {t("filesManagement", { ar: "إدارة الملفات", en: "Files Management" })}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t("filesDescription", { ar: "إدارة الصور والملفات المرفوعة", en: "Manage uploaded images and files" })}
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline">
              <i className="fas fa-arrow-right ml-2" />
              {t("backToAdmin", { ar: "العودة للوحة التحكم", en: "Back to Admin" })}
            </Button>
          </Link>
        </div>

        {/* Upload Section */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <Upload className="w-5 h-5 mr-2 text-saudi-red" />
              {t("uploadFile", { ar: "رفع ملف", en: "Upload File" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file" className="text-sm font-medium">
                  {t("selectFile", { ar: "اختر ملف", en: "Select File" })}
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("fileTypes", { ar: "الملفات المدعومة: JPG, PNG, GIF, WebP (الحد الأقصى: 10MB)", en: "Supported files: JPG, PNG, GIF, WebP (Max: 10MB)" })}
                </p>
              </div>

              {selectedFile && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-reverse space-x-3">
                    <div className="w-12 h-12 bg-saudi-red rounded-lg flex items-center justify-center">
                      <i className="fas fa-image text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("uploading", { ar: "جاري الرفع...", en: "Uploading..." })}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-saudi-red h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploadMutation.isPending}
                className="w-full bg-saudi-red hover:bg-saudi-red-dark"
              >
                {uploadMutation.isPending ? (
                  <div className="flex items-center space-x-reverse space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t("uploading", { ar: "جاري الرفع...", en: "Uploading..." })}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {t("upload", { ar: "رفع", en: "Upload" })}
                  </>
                )}
              </Button>

              {uploadMutation.error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {uploadMutation.error.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder={t("searchFiles", { ar: "البحث في الملفات...", en: "Search files..." })}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Files Grid */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-saudi-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {t("loading", { ar: "جاري التحميل...", en: "Loading..." })}
            </p>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>
              {t("errorLoading", { ar: "خطأ في تحميل الملفات", en: "Error loading files" })}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={file.url}
                      alt={file.originalName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>

                    <div className="flex items-center space-x-reverse space-x-2">
                      <Badge variant={file.isPublic ? "default" : "secondary"} className="text-xs">
                        {file.isPublic ? t("public", { ar: "عام", en: "Public" }) : t("private", { ar: "خاص", en: "Private" })}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-reverse space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.url, "_blank")}
                        className="flex-1"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        {t("view", { ar: "عرض", en: "View" })}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.url, "_blank")}
                        className="flex-1"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        {t("download", { ar: "تحميل", en: "Download" })}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredFiles.length === 0 && !isLoading && (
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-images text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {t("noFiles", { ar: "لا توجد ملفات", en: "No files found" })}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminProtected>
  );
} 