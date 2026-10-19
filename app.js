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

// دالة عرض السلة
function renderCart() {
  let root = document.getElementById("cartContents");
  if (!root) return;
  
  let c = getCart();
  
  if (!c.length) {
    root.innerHTML = '<div style="text-align: center; padding: 40px 20px; color: var(--text-muted);"><h2>سلتك فارغة حالياً</h2><p style="margin-top:10px;">تصفح المنتجات وأضف ما يعجبك.</p><a href="products.html" class="add-to-cart-btn" style="display:inline-block; width:auto; padding:10px 30px; margin-top:20px;">تصفح المنتجات</a></div>';
    return;
  }

  let subtotal = 0;
  
  let itemsHTML = c.map(i => {
    let p = PRODUCTS.find(p => p.id === i.id);
    if (!p) return "";
    subtotal += (p.price * i.qty);
    
    return `
    <div class="cart-item">
      <button class="delete-btn" onclick="removeItem(${p.id})">🗑️</button>
      <img src="${p.image}" alt="${p.name}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="cart-item-title">${p.name}</div>
        <div class="cart-item-price">${fmt(p.price)}</div>
        <div class="qty-controls">
          <button onclick="changeQty(${p.id}, 1)">+</button>
          <span>${i.qty}</span>
          <button onclick="changeQty(${p.id}, -1)">-</button>
        </div>
      </div>
    </div>`;
  }).join("");

  let shipping = subtotal > 0 ? 26 : 0; // رسوم توصيل ثابتة
  let total = subtotal + shipping;

  root.innerHTML = `
    ${itemsHTML}
    
    <div class="cart-summary">
      <div class="summary-row">
        <span>إجمالي المنتجات</span>
        <span>${fmt(subtotal)}</span>
      </div>
      <div class="summary-row">
        <span>رسوم التوصيل</span>
        <span>${fmt(shipping)}</span>
      </div>
      <div class="summary-row total">
        <span>المجموع الكلي</span>
        <span>${fmt(total)}</span>
      </div>
      
      <button class="checkout-btn" onclick="location.href='checkout.html'">
        إتمام الطلب <span>❯</span>
      </button>
    </div>
  `;
}

// دوال تعديل الكمية والحذف
function changeQty(id, d) {
  let c = getCart();
  let i = c.find(x => x.id === id);
  if (i) {
    i.qty += d;
    if (i.qty <= 0) {
      c = c.filter(x => x.id !== id);
    }
  }
  setCart(c);
  renderCart();
}

function removeItem(id) {
  setCart(getCart().filter(x => x.id !== id));
  renderCart();
  toast("تم حذف المنتج");
}

// تحديث السلة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  updateCount();
  renderProducts();
  renderCart(); // <--- هذه الدالة ستعرض السلة
});
// دالة إرسال الطلب
function submitOrder(event) {
  event.preventDefault(); // منع إعادة تحميل الصفحة
  
  // جلب بيانات السلة
  let cart = getCart();
  
  if (cart.length === 0) {
    alert("سلتك فارغة! أضف منتجات أولاً.");
    window.location.href = "products.html";
    return;
  }

  // جلب بيانات العميل من النموذج
  const form = event.target;
  const customerData = {
    name: form.name.value,
    phone: form.phone.value,
    city: form.city.value,
    district: form.district.value,
    address: form.address.value,
    payment: form.payment.value
  };

  // حفظ الطلب في ذاكرة المتصفح
  const orderData = {
    customer: customerData,
    items: cart,
    total: getCartTotal(),
    date: new Date().toISOString()
  };
  
  localStorage.setItem("brandlandLastOrder", JSON.stringify(orderData));

  // تفريغ السلة
  setCart([]);

  // الانتقال لصفحة النجاح
  window.location.href = "order-success.html";
}

// حساب إجمالي السلة (دالة مساعدة)
function getCartTotal() {
  let cart = getCart();
  let subtotal = cart.reduce((sum, item) => {
    let product = PRODUCTS.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  return subtotal + (subtotal > 0 ? 26 : 0); // إضافة رسوم التوصيل
}
// دالة فتح وإغلاق القائمة الجانبية
function toggleSideMenu() {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('sideMenuOverlay');
  
  if (menu && overlay) {
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // منع التمرير في الصفحة الخلفية عند فتح القائمة
    if (menu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}
// دالة فتح وإغلاق القائمة الجانبية
function toggleSideMenu() {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('sideMenuOverlay');
  
  if (menu && overlay) {
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (menu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}
// --- وظائف المفضلة ---

// جلب المفضلة من الذاكرة
function getWishlist() {
  try { return JSON.parse(localStorage.getItem("brandlandWishlist") || "[]"); } catch (e) { return []; }
}

// حفظ المفضلة
function setWishlist(w) {
  localStorage.setItem("brandlandWishlist", JSON.stringify(w));
}

// إضافة أو إزالة منتج من المفضلة
function toggleFav(btn) {
  const productId = parseInt(btn.getAttribute('data-id'));
  let wishlist = getWishlist();
  
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
    btn.classList.remove('active');
    btn.innerHTML = '♡';
    toast("تمت الإزالة من المفضلة");
  } else {
    wishlist.push(productId);
    btn.classList.add('active');
    btn.innerHTML = '♥';
    toast("تمت الإضافة إلى المفضلة");
  }
  setWishlist(wishlist);
}

// عرض المنتجات في صفحة المفضلة
function renderWishlist() {
  const container = document.getElementById("wishlistProducts");
  if (!container) return;

  let wishlist = getWishlist();
  
  if (wishlist.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; color: var(--text-muted);"><h3>قائمة المفضلة فارغة</h3><p style="margin-top:10px;">تصفح المنتجات واضغط على القلب لإضافتها هنا.</p><a href="products.html" class="primary-btn" style="display:inline-block; margin-top:15px;">تصفح المنتجات</a></div>';
    return;
  }

  let favProducts = PRODUCTS.filter(p => wishlist.includes(p.id));
  container.innerHTML = favProducts.map(productCard).join("");
}

// تحديث زر القلب عند تحميل الصفحة (ليظهر مملوءاً إذا كان المنتج في المفضلة)
document.addEventListener("DOMContentLoaded", () => {
  let wishlist = getWishlist();
  document.querySelectorAll('.fav-btn').forEach(btn => {
    let id = parseInt(btn.getAttribute('data-id'));
    if (wishlist.includes(id)) {
      btn.classList.add('active');
      btn.innerHTML = '♥';
    }
  });
  renderWishlist(); // عرض المفضلة إذا كنا في صفحتها
});
// --- وظائف تتبع الطلب ---

// دالة البحث عن طلب برقمه
function searchOrder(event) {
  event.preventDefault();
  const orderNum = document.getElementById('searchOrderInput').value.trim();
  
  // جلب الطلب من الذاكرة
  const savedOrder = JSON.parse(localStorage.getItem("brandlandLastOrder"));
  
  if (savedOrder && savedOrder.id === orderNum) {
    showOrderDetails(savedOrder);
  } else {
    alert("لم يتم العثور على طلب بهذا الرقم. تأكد من الرقم وحاول مرة أخرى.");
  }
}

// دالة عرض تفاصيل الطلب في الصفحة
function showOrderDetails(order) {
  // إخفاء صندوق البحث وإظهار التفاصيل
  document.getElementById('noOrderBox').style.display = 'none';
  document.getElementById('orderInfoCard').style.display = 'flex';
  document.getElementById('trackProgress').style.display = 'flex';
  document.getElementById('timelineContainer').style.display = 'block';

  // تعبئة البيانات الأساسية
  document.getElementById('displayOrderNum').textContent = "#" + order.id;
  
  // تنسيق التاريخ
  const date = new Date(order.date);
  document.getElementById('displayOrderDate').textContent = date.toLocaleDateString('ar-SA');
  
  // عرض وقت الخطوة الأولى
  document.getElementById('timeStep1').textContent = date.toLocaleDateString('ar-SA') + ' ' + date.toLocaleTimeString('ar-SA', {hour: '2-digit', minute:'2-digit'});

  // ملاحظة: بما أن هذا متجر تجريبي، سنفترض أن الطلب في الخطوة الأولى فقط
  // في متجر حقيقي، يتم جلب حالة الطلب من قاعدة البيانات
}

// عند تحميل الصفحة، إذا كان هناك رابط يحتوي على رقم طلب، أو طلب محفوظ، اعرضه تلقائياً
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const orderIdFromUrl = urlParams.get('order');
  
  if (orderIdFromUrl) {
    document.getElementById('searchOrderInput').value = orderIdFromUrl;
    // محاكاة حدث الضغط على البحث
    const fakeEvent = { preventDefault: () => {} };
    searchOrder(fakeEvent);
  } else {
    // التحقق مما إذا كان آخر طلب محفوظ في الذاكرة
    const savedOrder = JSON.parse(localStorage.getItem("brandlandLastOrder"));
    if (savedOrder) {
      showOrderDetails(savedOrder);
    }
  }
});
