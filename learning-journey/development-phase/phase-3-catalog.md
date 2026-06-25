# Phase 3: Catalog & Browsing Module

ในเฟสนี้ เราจะมาเขียน API ให้ฝั่งผู้ใช้ทั่วไป (Public) สามารถค้นหาหมวดหมู่ บริการย่อย และค้นหาช่างที่ว่างและมีทักษะสอดคล้องกับงาน

---

## 💡 NestJS -> Laravel Catalog Concept Mapping

* **NestJS DTO/Serializer vs Laravel API Resources:**
  * ใน NestJS คุณมักจะใช้ `class-transformer` ร่วมกับ `@Exclude()`, `@Expose()` บน Entity เพื่อจัดการ JSON properties ที่จะส่งออกไปภายนอก
  * ใน Laravel จะมีฟังก์ชัน **API Resources** (`php artisan make:resource ServiceResource`) ซึ่งเป็นเหมือนแผ่นกรอง (Transform layer) ที่ช่วยให้เรากำหนดฟิลด์ที่ต้องการส่งกลับได้อย่างละเอียด รวมถึงการดึงเอาข้อมูลโมเดลที่เกี่ยวข้อง (Relationships) มาจัดระเบียบใหม่ก่อนส่งออกไป
* **Eager Loading (`with()`) vs TypeORM Relations Loading:**
  * ใน NestJS คุณระบุ `relations: ['category']` ใน Repository
  * ใน Laravel หากคุณเรียก `$services = Service::all()` แล้วดึงหมวดหมู่ย่อยใน Loop จะเกิดปัญหา **N+1 Query** เสมอ วิธีแก้คือการทำ Eager Loading: `Service::with('category')->get()` เพื่อดึงข้อมูลทั้งหมดมารอไว้ใน Query เดียว
  
  > [!TIP]
  > **Automatic N+1 Detection:** ในช่วงการพัฒนา (Development) เราสามารถเปิดใช้ `Model::preventLazyLoading(! app()->isProduction())` ใน `AppServiceProvider.php` เพื่อให้ระบบโยน Exception ออกมาทันทีที่เกิดการรัน Query แบบ Lazy Loading (N+1) ช่วยป้องกันประสิทธิภาพคอขวดตั้งแต่ช่วงเขียนโค้ด

---

## 🛠️ Step-by-Step Implementation

### Step 1: สร้าง API Resources
สร้าง Resource เพื่อใช้จัดการรูปแบบของ JSON Response:
```bash
php artisan make:resource CategoryResource
php artisan make:resource ServiceResource
php artisan make:resource ProviderResource
```
ตัวอย่างภายในคลาส Resource เช่น ใน `ServiceResource.php`:
```php
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'base_price' => $this->base_price,
        'description' => $this->description,
        'category' => new CategoryResource($this->whenLoaded('category')),
    ];
}
```

---

### Step 2: สร้าง CatalogController และเขียนฟังก์ชันดึงข้อมูล
สร้างคอนโทรลเลอร์:
```bash
php artisan make:controller CatalogController
```

**ฟังก์ชันที่ต้องมี:**
1. **`getCategories` (ดูหมวดหมู่ทั้งหมด):**
   * คืนค่าหมวดหมู่ทั้งหมดพร้อมข้อมูลจำนวนบริการที่อยู่ภายใน (ใช้ `withCount('services')` เพื่อดูว่ามีบริการอะไรบ้าง)
2. **`getServices` (ค้นหาบริการ):**
   * ดึงข้อมูลบริการย่อยทั้งหมด
   * รองรับการฟิลเตอร์ด้วย `category_id` (ถ้าส่งมา)
   * รองรับการค้นหา (Search) จากชื่อบริการด้วย Query String `?search=ล้างแอร์`
   * ทำ Eager Loading ตาราง `category` เพื่อลดจำนวน Query
   
     > [!TIP]
     > **Conditional Queries (`when()`):** หลีกเลี่ยงการใช้ `if-else` หลายชั้นในการต่อสาย Query Builder ใน Laravel เรามีเมธอด `when()` ช่วยเขียนคิวรีแบบมีเงื่อนไขได้อย่างเป็นระเบียบและสวยงาม:
     > ```php
     > $services = Service::with('category')
     >     ->when($request->category_id, fn ($q, $id) => $q->where('category_id', $id))
     >     ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
     >     ->get();
     > ```
3. **`getServiceProviders` (ดึงรายชื่อช่างสำหรับบริการนั้น):**
   * เส้นทาง: `/api/services/{service_id}/providers`
   * **Business Logic:** ค้นหาช่างที่สามารถทำบริการนี้ได้ โดยตรวจสอบว่าหมวดหมู่ของบริการนี้ (`category_id`) ตรงกับความสามารถของช่าง (`provider_skills`) และช่างต้องมีสถานะเป็น `available` เท่านั้น
   
     > [!TIP]
     > **Simplifying Relationship Checks (`whereRelation()`):**
     > แทนที่จะเขียน `whereHas` ยาว ๆ สำหรับเช็คเงื่อนไขที่ซับซ้อน หากเงื่อนไขความสัมพันธ์เป็นการเปรียบเทียบคอลัมน์แบบง่าย คุณสามารถใช้ `whereRelation` เพื่อย่นระยะโค้ดได้ เช่น:
     > ```php
     > $providers = Provider::where('status', 'available')
     >     ->whereRelation('categories', 'categories.id', $service->category_id)
     >     ->get();
     > ```

---

### Step 3: กำหนดเส้นทาง (Routes) ใน `routes/api.php`
เส้นทางเหล่านี้เป็นเส้นทางสาธารณะ (Public Routes) ไม่ต้องใส่ระบบความปลอดภัยด้วย Sanctum:
* `GET /categories`
* `GET /services`
* `GET /services/{service_id}/providers`

---

## 🎯 Task ถัดไป (จะเริ่มต้นเมื่อจบ Phase 2)
เขียนฟังก์ชันสำหรับ Query และคัดกรองช่าง โดยใช้ความเข้าใจเรื่อง Eloquent Many-to-Many Relationships และส่งมอบฟังก์ชันทั้งหมดพร้อมผลการเรียกใช้ API
