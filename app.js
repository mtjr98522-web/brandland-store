// قاعدة بيانات المنتجات (محدثة لتطابق الصورة)
const PRODUCTS = [
  { id: 1, name: "أطقم تقييد ناعمة", category: "couples", price: 19.99, rating: 4.8, image: "assets/product-3.jpg", visual: "red" },
  { id: 2, name: "لعبة الأزواج", category: "couples", price: 24.99, rating: 4.7, image: "assets/product-4.jpg", visual: "black" },
  { id: 3, name: "حلقة الاهتمام الزوجية", category: "men", price: 149, rating: 4.9, image: "assets/product-2.jpg", visual: "black" },
  { id: 4, name: "هزاز سيليكون مزدوج", category: "women", price: 199, rating: 4.6, image: "assets/product-5.jpg", visual: "pink" },
  { id: 5, name: "أصفاد جلدية ناعمة", category: "couples", price: 129, rating: 4.6, image: "assets/product-4.jpg", visual: "black" },
  { id: 6, name: "خاتم الاهتزاز الذكي", category: "men", price: 99, rating: 4.5, image: "assets/product-5.jpg", visual: "black" },
  { id: 7, name: "زيت عناية فاخر", category: "care", price: 79, rating: 4.9, image: "assets/product-6.jpg", visual: "oil" },
  { id: 8, name: "مجموعة هدايا راقية", category: "gifts", price: 299, rating: 4.8, image: "assets/product-7.jpg", visual: "gift" }
];

const fmt = n => `$${n}`;

// إدارة السلة
function getCart() {
  try { return JSON.parse(localStorage.getItem("brandlandCart") || "[]"); } catch (e) { return []; }
}
function setCart(c) {
  localStorage.setItem("brandlandCart", JSON.stringify(c));
  updateCount();
}
function updateCount() {
  let n = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach(e => e.textContent = n);
}
function addToCart(id) {
  let c = getCart();
  let found = c.find(i => i.id === id);
  if (found) found.qty++;
  else c.push({ id, qty: 1 });
  setCart(c);
  toast("تمت إضافة المنتج إلى السلة");
}
function toast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:999;background:#d4af37;color:#000;padding:10px 20px;border-radius:8px;font-weight:bold;box-shadow:0 5px 15px rgba(0,0,0,0.5);transition:opacity 0.3s;";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = "1";
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => { t.style.opacity = "0"; }, 2000);
}

// تصميم بطاقة المنتج
function productCard(p) {
  return `
  <article class="product-card">
    <button class="fav-btn" onclick="toggleFav(this)">♡</button>
    <img src="${p.image}" alt="${p.name}" class="product-image">
    <h3 class="product-title">${p.name}</h3>
    <div class="product-rating">
      ★★★★★ <span>(${p.rating})</span>
    </div>
    <div class="product-price">${fmt(p.price)}</div>
    <div class="product-actions">
      <button class="add-to-cart-btn" onclick="addToCart(${p.id})">🛒 أضف إلى السلة</button>
      <button class="buy-now-btn" onclick="addToCart(${p.id}); location.href='checkout.html';">⚡ اطلب الآن</button>
    </div>
  </article>`;
}

// عرض المنتجات
function renderProducts() {
  const container = document.getElementById("allProducts");
  if (!container) return;
  
  // جلب القسم من الرابط (إذا تم الضغط على زر قسم)
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');

  const searchVal = document.getElementById("searchInput")?.value.toLowerCase() || "";
  
  let filtered = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchVal);
    let matchesCategory = true;
    if (categoryParam) {
      matchesCategory = (p.category === categoryParam);
    }
    return matchesSearch && matchesCategory;
  });

  const activeTab = document.querySelector('.filter-tabs button.active');
  if (activeTab) {
    const type = activeTab.textContent;
    if (type === "الأكثر مبيعاً") {
      filtered.sort((a, b) => b.rating - a.rating); 
    } else if (type === "الأحدث") {
      filtered.sort((a, b) => b.id - a.id); 
    } else if (type === "الأعلى تقييماً") {
      filtered.sort((a, b) => b.rating - a.rating);
    }
  }

  container.innerHTML = filtered.length 
    ? filtered.map(productCard).join("") 
    : '<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: #888;">لا توجد منتجات في هذا القسم حالياً.</div>';
}

// دوال إضافية للبحث والتصفية
function filterProducts() { renderProducts(); }
function filterByTab(tab, btn) {
  document.querySelectorAll('.filter-tabs button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
}
function toggleFav(btn) {
  btn.classList.toggle('active');
  btn.innerHTML = btn.classList.contains('active') ? '♥' : '♡';
}

// تشغيل عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  updateCount();
  renderProducts();
});
