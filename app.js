// قاعدة بيانات المنتجات (محدثة لتطابق الصورة)
const PRODUCTS = [
  { id: 1, name: "أطقم تقييد ناعمة", category: "couples", price: 19.99, image: "assets/product-3.jpg", visual: "red" },
  { id: 2, name: "لعبة الأزواج", category: "couples", price: 24.99, image: "assets/product-4.jpg", visual: "black" },
  { id: 3, name: "حلقة الاهتمام الزوجية", category: "men", price: 149, image: "assets/product-2.jpg", visual: "black" },
  { id: 4, name: "هزاز سيليكون مزدوج", category: "women", price: 199, image: "assets/product-5.jpg", visual: "pink" }
];

// دالة لعرض السعر بالدولار
const fmt = n => `$${n}`;

// تصميم بطاقة المنتج
function productCard(p) {
  return `
  <article class="product-card">
    <img src="${p.image}" alt="${p.name}" class="product-image">
    <h3 class="product-title">${p.name}</h3>
    <div class="product-price">${fmt(p.price)}</div>
    <button class="add-to-cart-btn" onclick="addToCart(${p.id})">🛒 إضافة إلى السلة</button>
  </article>`;
}

// عرض المنتجات في الصفحة
function renderProducts() {
  const container = document.getElementById("allProducts");
  if (!container) return;
  container.innerHTML = PRODUCTS.map(productCard).join("");
}

// تشغيل عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCount(); // تحديث عداد السلة
});
