# دليل API التلقائي - كسره

## نظرة عامة

هذا الدليل يشرح كيفية استخدام نظام API التلقائي الذي يولد جميع العمليات CRUD تلقائياً لكل كيان في النظام.

## الميزات التلقائية

### ✅ ما يتم إنشاؤه تلقائياً:

1. **API Endpoints** - جميع مسارات REST API
2. **CRUD Operations** - إنشاء، قراءة، تحديث، حذف
3. **Validation** - التحقق من صحة البيانات
4. **Authentication** - المصادقة والصلاحيات
5. **Search & Filtering** - البحث والتصفية
6. **Pagination** - ترقيم الصفحات
7. **Bulk Operations** - العمليات المجمعة
8. **Statistics** - الإحصائيات
9. **Frontend Components** - مكونات الواجهة الأمامية

## كيفية الاستخدام

### 1. إضافة كيان جديد

#### الخطوة 1: إضافة الجدول في قاعدة البيانات
```typescript
// في shared/schema.ts
export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  author: text('author'),
  publishedAt: timestamp('published_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const insertArticleSchema = createInsertSchema(articles);
```

#### الخطوة 2: إضافة في Auto CRUD
```typescript
// في server/auto-crud.ts
const crudApis = {
  // ... الكيانات الموجودة
  articles: new AutoCRUD("articles", "articles", insertArticleSchema, db),
};
```

#### الخطوة 3: إضافة في Auto Frontend
```typescript
// في client/src/utils/auto-frontend.ts
const fieldDefinitions = {
  // ... الكيانات الموجودة
  articles: [
    { name: "title", type: "text", label: "Title", arabicLabel: "العنوان", englishLabel: "Title", required: true },
    { name: "content", type: "textarea", label: "Content", arabicLabel: "المحتوى", englishLabel: "Content", required: true },
    { name: "author", type: "text", label: "Author", arabicLabel: "الكاتب", englishLabel: "Author" },
  ],
};
```

### 2. API Endpoints المتولدة تلقائياً

#### العمليات الأساسية:
```
GET    /api/{entity}           - جلب جميع العناصر
GET    /api/{entity}/:id       - جلب عنصر واحد
POST   /api/{entity}           - إنشاء عنصر جديد
PUT    /api/{entity}/:id       - تحديث عنصر
DELETE /api/{entity}/:id       - حذف عنصر
```

#### العمليات المتقدمة:
```
POST   /api/{entity}/bulk      - إنشاء عناصر متعددة
DELETE /api/{entity}/bulk      - حذف عناصر متعددة
GET    /api/{entity}/stats     - إحصائيات الكيان
```

#### معاملات البحث والتصفية:
```
GET /api/{entity}?search=keyword&limit=10&offset=0&sortBy=createdAt&sortOrder=desc
```

### 3. أمثلة الاستخدام

#### إنشاء عنصر جديد:
```javascript
const response = await fetch('/api/articles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'مقال جديد',
    content: 'محتوى المقال',
    author: 'اسم الكاتب'
  })
});
```

#### جلب العناصر مع البحث:
```javascript
const response = await fetch('/api/articles?search=كرة&limit=20&offset=0');
const articles = await response.json();
```

#### تحديث عنصر:
```javascript
const response = await fetch('/api/articles/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'عنوان محدث'
  })
});
```

#### حذف عنصر:
```javascript
const response = await fetch('/api/articles/123', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

#### العمليات المجمعة:
```javascript
// إنشاء عناصر متعددة
const response = await fetch('/api/articles/bulk', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    items: [
      { title: 'مقال 1', content: 'محتوى 1' },
      { title: 'مقال 2', content: 'محتوى 2' }
    ]
  })
});

// حذف عناصر متعددة
const response = await fetch('/api/articles/bulk', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    ids: ['123', '456', '789']
  })
});
```

### 4. مكونات الواجهة الأمامية التلقائية

#### استخدام مكون القائمة:
```typescript
import { generateAllFrontendComponents } from '@/utils/auto-frontend';

const components = generateAllFrontendComponents();
const ArticlesList = components.articlesList;

// في صفحة React
function ArticlesPage() {
  return (
    <div>
      <ArticlesList />
    </div>
  );
}
```

#### استخدام مكون النموذج:
```typescript
const ArticlesForm = components.articlesForm;

function NewArticlePage() {
  return (
    <div>
      <ArticlesForm />
    </div>
  );
}
```

### 5. تخصيص السلوك

#### تخصيص البحث:
```typescript
private getSearchableColumns(): string[] {
  const searchableColumns: { [key: string]: string[] } = {
    articles: ['title', 'content', 'author'],
    // ... كيانات أخرى
  };
  return searchableColumns[this.entityName] || ['id'];
}
```

#### تخصيص الصلاحيات:
```typescript
// في server/auto-crud.ts
this.router.post(`/api/${this.entityName}`, authenticateToken, requireEditor, async (req, res) => {
  // بدلاً من requireAdmin
});
```

#### تخصيص التحقق:
```typescript
// إضافة تحقق مخصص
const customSchema = this.schema.extend({
  customField: z.string().min(10, "يجب أن يكون الحقل 10 أحرف على الأقل")
});
```

### 6. إضافة كيان جديد بالكامل

#### مثال: إضافة كيان "التعليقات"

1. **إضافة الجدول:**
```typescript
// shared/schema.ts
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  authorId: uuid('author_id').references(() => users.id),
  articleId: uuid('article_id').references(() => articles.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments);
```

2. **إضافة في Auto CRUD:**
```typescript
// server/auto-crud.ts
comments: new AutoCRUD("comments", "comments", insertCommentSchema, db),
```

3. **إضافة في Auto Frontend:**
```typescript
// client/src/utils/auto-frontend.ts
comments: [
  { name: "content", type: "textarea", label: "Comment", arabicLabel: "التعليق", englishLabel: "Comment", required: true },
  { name: "authorId", type: "select", label: "Author", arabicLabel: "الكاتب", englishLabel: "Author", options: [] },
  { name: "articleId", type: "select", label: "Article", arabicLabel: "المقال", englishLabel: "Article", options: [] },
],
```

4. **إضافة في التطبيق:**
```typescript
// client/src/App.tsx
<Route path="/comments" component={CommentsList} />
<Route path="/comments/new" component={CommentsForm} />
```

### 7. الميزات المتقدمة

#### الإحصائيات التلقائية:
```javascript
const response = await fetch('/api/articles/stats');
const stats = await response.json();
// { total: 150, today: 5 }
```

#### البحث المتقدم:
```javascript
// البحث في عدة حقول
const response = await fetch('/api/articles?search=كرة القدم&limit=10&sortBy=publishedAt&sortOrder=desc');
```

#### التصفية حسب التاريخ:
```javascript
// يمكن إضافة تصفية حسب التاريخ
const response = await fetch('/api/articles?fromDate=2024-01-01&toDate=2024-12-31');
```

## أفضل الممارسات

### 1. تسمية الكيانات
- استخدم أسماء مفردة: `article` بدلاً من `articles`
- استخدم أسماء واضحة ووصفية
- تجنب الاختصارات غير الواضحة

### 2. تعريف الحقول
- حدد الحقول المطلوبة بوضوح
- استخدم أنواع البيانات المناسبة
- أضف التحقق المناسب

### 3. الصلاحيات
- حدد الصلاحيات المناسبة لكل عملية
- استخدم `requireAdmin` للعمليات الحساسة
- استخدم `requireEditor` للعمليات العادية

### 4. الأداء
- استخدم الفهرسة المناسبة في قاعدة البيانات
- حدد حدود البحث والتصفح
- استخدم التخزين المؤقت عند الحاجة

## استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في التحقق من صحة البيانات:**
   - تأكد من تعريف Schema صحيح
   - تحقق من أنواع البيانات

2. **خطأ في الصلاحيات:**
   - تأكد من وجود token صحيح
   - تحقق من دور المستخدم

3. **خطأ في قاعدة البيانات:**
   - تأكد من وجود الجدول
   - تحقق من العلاقات

4. **خطأ في الواجهة الأمامية:**
   - تأكد من تعريف الحقول
   - تحقق من API endpoint

## الخلاصة

نظام API التلقائي يوفر:
- ✅ توفير الوقت والجهد
- ✅ تقليل الأخطاء
- ✅ اتساق في الكود
- ✅ سهولة الصيانة
- ✅ قابلية التوسع

باستخدام هذا النظام، يمكنك إضافة أي كيان جديد في دقائق معدودة مع جميع العمليات المطلوبة! 