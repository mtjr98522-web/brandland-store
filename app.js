// قاعدة بيانات المنتجات (تم ربط الصور بمجلد assets)
const PRODUCTS = [
  { id: 1, name: "حلقة الاهتمام الزوجية", category: "men", price: 149, rating: 4.8, image: "assets/product-3.jpg", visual: "black" },
  { id: 2, name: "هزاز سيليكون مزدوج", category: "women", price: 199, rating: 4.7, image: "assets/product-3.jpg", visual: "pink" },
  { id: 3, name: "أصفاد جلدية ناعمة", category: "couples", price: 129, rating: 4.6, image: "assets/product-3.jpg", visual: "black" },
  { id: 4, name: "خاتم الاهتزاز الذكي", category: "men", price: 99, rating: 4.5, image: "assets/product-3.jpg", visual: "black" },
  { id: 5, name: "زيت عناية فاخر", category: "care", price: 79, rating: 4.9, image: "assets/product-3.jpg", visual: "oil" },
  { id: 6, name: "مجموعة هدايا راقية", category: "gifts", price: 299, rating: 4.8, image: "assets/product-3.jpg", visual: "gift" }
];

const fmt = n => `${n} ريال`;

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
  
  const searchVal = document.getElementById("searchInput")?.value.toLowerCase() || "";
  let filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(searchVal));

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
    : '<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: #888;">لا توجد منتجات مطابقة للبحث.</div>';
}

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

document.addEventListener("DOMContentLoaded", () => {
  updateCount();
  renderProducts();
});
ة بالتبويبات
function filterByTab(tab, btn) {
  document.querySelectorAll('.filter-tabs button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
}

// دالة المفضلة
function toggleFav(btn) {
  btn.classList.toggle('active');
  if (btn.classList.contains('active')) {
    btn.innerHTML = '♥';
  } else {
    btn.innerHTML = '♡';
  }
}

// تشغيل الدوال عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  updateCount();
  renderProducts();
});
efits"><li>✓ تغليف محايد يحافظ على الخصوصية</li><li>✓ دفع عند الاستلام</li><li>✓ دعم للعملاء عند الحاجة</li></ul><label class="qty-label">الكمية <input id="detailQty" type="number" min="1" max="99" value="1"></label><button class="btn wide" onclick="addDetailToCart(${p.id})">أضف إلى السلة　 🛒</button><a class="btn secondary wide" href="products.html">متابعة التسوق</a><p class="muted">الأسعار والمواصفات هنا أمثلة تجريبية وتحتاج إلى اعتمادها قبل الإطلاق.</p></div></div>`;let rel=document.getElementById("relatedProducts");if(rel)rel.innerHTML=PRODUCTS.filter(x=>x.id!==p.id).slice(0,3).map(productCard).join()}
function addDetailToCart(id){let qty=Math.max(1,Number(document.getElementById("detailQty")?.value||1));let c=getCart(),found=c.find(i=>i.id===id);if(found)found.qty+=qty;else c.push({id,qty});setCart(c);toast("تمت إضافة المنتج إلى السلة")}
function cartTotals(c){return c.reduce((s,i)=>{let p=PRODUCTS.find(p=>p.id===i.id);return s+(p?p.price*i.qty:0)},0)}
function renderCart(){let root=document.getElementById("cartContents");if(!root)return;let c=getCart();if(!c.length){root.innerHTML='<div class="empty"><strong>سلتك فارغة حالياً</strong><p>تصفح المنتجات وأضف ما يعجبك إلى السلة.</p><a class="btn" href="products.html">تصفح المنتجات</a></div>';return}let total=cartTotals(c);root.innerHTML=`<div class="cart-layout"><section class="cart-items">${c.map(i=>{let p=PRODUCTS.find(p=>p.id===i.id);if(!p)return "";return `<article class="cart-row"><div class="mini-product ${p.visual}">${p.symbol}</div><div class="cart-info"><h3>${p.name}</h3><small>تغليف محايد · دفع عند الاستلام</small><b>${fmt(p.price)}</b><label>الكمية <button class="outline-btn" style="display:inline;padding:1px 8px" onclick="changeQty(${p.id},-1)">−</button> <input aria-label="الكمية" type="number" min="1" value="${i.qty}" onchange="setQty(${p.id},this.value)"> <button class="outline-btn" style="display:inline;padding:1px 8px" onclick="changeQty(${p.id},1)">+</button></label></div><button class="remove" aria-label="حذف" onclick="removeItem(${p.id})">🗑</button></article>`}).join("")}<a class="text-link" href="products.html">← متابعة التسوق</a></section><aside class="summary"><h2>ملخص الطلب</h2><p><span>إجمالي المنتجات</span><b>${fmt(total)}</b></p><p><span>الشحن</span><span>يحدد عند التأكيد</span></p><hr><p class="total"><span>المجموع</span><b>${fmt(total)}</b></p><a class="btn wide" href="checkout.html">إتمام الطلب　←</a><small>طريقة الدفع: عند الاستلام.</small></aside></div>`}
function changeQty(id,d){let c=getCart(),i=c.find(x=>x.id===id);if(i)i.qty=Math.max(1,i.qty+d);setCart(c);renderCart()}
function setQty(id,q){let c=getCart(),i=c.find(x=>x.id===id);if(i)i.qty=Math.max(1,Math.min(99,Number(q)||1));setCart(c);renderCart()}
function removeItem(id){setCart(getCart().filter(x=>x.id!==id));renderCart();toast("تم حذف المنتج")}
function renderCheckout(){let sum=document.getElementById("checkoutSummary");if(!sum)return;let c=getCart(),total=cartTotals(c);sum.innerHTML=`<h2>ملخص الطلب</h2><p><span>عدد المنتجات</span><b>${c.reduce((s,i)=>s+i.qty,0)}</b></p><p><span>قيمة المنتجات</span><b>${fmt(total)}</b></p><p><span>الشحن</span><span>يحدد عند التأكيد</span></p><hr><p class="total"><span>الإجمالي</span><b>${fmt(total)}</b></p><p><span>طريقة الدفع</span><b>عند الاستلام</b></p><small>لن تُطلب بيانات بطاقة أو دفع إلكتروني.</small>`;let form=document.getElementById("checkoutForm");if(form)form.addEventListener("submit",e=>{e.preventDefault();if(!c.length){toast("السلة فارغة، أضف منتجاً أولاً");return}let fd=new FormData(form),order={id:"BL-"+Math.floor(1000+Math.random()*9000),name:fd.get("name"),phone:fd.get("phone"),city:fd.get("city"),address:fd.get("address"),notes:fd.get("notes"),total,items:c,date:new Date().toISOString()};localStorage.setItem("brandlandLastOrder",JSON.stringify(order));let orders=JSON.parse(localStorage.getItem("brandlandOrders")||"[]");orders.push(order);localStorage.setItem("brandlandOrders",JSON.stringify(orders));setCart([]);location.href="order-success.html?id="+order.id})}
function renderSuccess(){let box=document.getElementById("orderConfirmation");if(!box)return;let order=JSON.parse(localStorage.getItem("brandlandLastOrder")||"null");if(order){document.getElementById("orderNumber").textContent="#"+order.id;box.insertAdjacentHTML("beforeend",`<p>الاسم: ${escapeHtml(order.name)} · طريقة الدفع: عند الاستلام</p><p>الإجمالي: ${fmt(order.total)}</p>`)}}
function escapeHtml(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderTracking(){let f=document.getElementById("trackForm");if(!f)return;let input=document.getElementById("trackNumber"),q=new URLSearchParams(location.search).get("order");if(q)input.value=q;f.addEventListener("submit",e=>{e.preventDefault();let n=input.value.trim().replace(/^#/,""),orders=JSON.parse(localStorage.getItem("brandlandOrders")||"[]"),o=orders.find(x=>x.id.toLowerCase()===n.toLowerCase()),r=document.getElementById("trackResult");r.innerHTML=o?`<div class="notice"><b>تم العثور على الطلب ${escapeHtml(o.id)}</b><p>الحالة: تم استلام الطلب — الدفع عند الاستلام</p><p>الإجمالي: ${fmt(o.total)}</p></div>`:'<p class="notice">لم يتم العثور على هذا الرقم في هذه النسخة التجريبية.</p>'})}
document.addEventListener("DOMContentLoaded",()=>{updateCount();renderProducts();renderDetail();renderCart();renderCheckout();renderSuccess();renderTracking();let range=document.getElementById("priceRange");if(range)range.addEventListener("input",()=>{document.getElementById("priceValue").textContent=range.value;renderProducts()});document.getElementById("sortProducts")?.addEventListener("change",renderProducts);document.querySelectorAll(".category-filter").forEach(x=>x.addEventListener("change",renderProducts));let category=new URLSearchParams(location.search).get("category");if(category){let cb=document.querySelector(`.category-filter[value="${category}"]`);if(cb){cb.checked=true;renderProducts()}}});
