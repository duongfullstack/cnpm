/* =============================================================
   TIEMBANGIAY - script.js
   ============================================================= */

// ===== USER DATABASE (từ database.sql) =====
// Dữ liệu user mặc định (seed)
const DEFAULT_USERS = [
  { id:1, email:'admin@tiembangiay.vn', password:'admin123',   full_name:'Admin TIEMBANGIAY', phone:'0901000001', address:'1 Lê Lợi, Q1, TP.HCM',                  role:'admin' },
  { id:2, email:'an.nguyen@gmail.com',  password:'an123',      full_name:'Nguyễn Văn An',     phone:'0901234567', address:'123 Nguyễn Huệ, Q1, TP.HCM',            role:'customer' },
  { id:3, email:'bao.tran@gmail.com',   password:'bao123',     full_name:'Trần Thị Bảo',      phone:'0912345678', address:'45 Trần Hưng Đạo, Q5, TP.HCM',          role:'customer' },
  { id:4, email:'cuong.le@gmail.com',   password:'cuong123',   full_name:'Lê Minh Cường',     phone:'0923456789', address:'67 Lý Tự Trọng, Q1, TP.HCM',            role:'customer' },
  { id:5, email:'dung.pham@gmail.com',  password:'dung123',    full_name:'Phạm Thị Dung',     phone:'0934567890', address:'89 Đinh Tiên Hoàng, Bình Thạnh, TP.HCM', role:'customer' },
  { id:6, email:'em.hoang@gmail.com',   password:'em123',      full_name:'Hoàng Văn Em',      phone:'0945678901', address:'12 Võ Văn Tần, Q3, TP.HCM',             role:'customer' },
];

// Load USERS_DB từ localStorage (để lưu user mới đăng ký)
function loadUsersDB() {
  const stored = localStorage.getItem('tbg_users_db');
  if (stored) return JSON.parse(stored);
  // Lần đầu: lưu seed vào localStorage
  localStorage.setItem('tbg_users_db', JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

function saveUsersDB(db) {
  localStorage.setItem('tbg_users_db', JSON.stringify(db));
}

let USERS_DB = loadUsersDB();

// Trạng thái người dùng hiện tại
let currentUser = JSON.parse(localStorage.getItem('tbg_user') || 'null');

function saveUser(user) {
  currentUser = user;
  localStorage.setItem('tbg_user', JSON.stringify(user));
  updateNavUser();
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem('tbg_user');
  updateNavUser();
  showPage('shop');
  showToast('👋 Đã đăng xuất!');
}

function updateNavUser() {
  const loginBtns    = document.querySelectorAll('#navLoginBtn');
  const regBtns      = document.querySelectorAll('#navRegisterBtn');
  const userInfoEls  = document.querySelectorAll('#navUserInfo');
  const userNameEls  = document.querySelectorAll('#navUserName');
  const avatarEls    = document.querySelectorAll('#navUserAvatar');
  const dropName     = document.getElementById('dropdownName');
  const dropEmail    = document.getElementById('dropdownEmail');
  loginBtns.forEach(el => el.style.display    = currentUser ? 'none' : '');
  regBtns.forEach(el => el.style.display      = currentUser ? 'none' : '');
  userInfoEls.forEach(el => el.style.display  = currentUser ? 'flex' : 'none');
  if (currentUser) {
    const firstName = currentUser.full_name.split(' ').pop();
    userNameEls.forEach(el => el.textContent = firstName);
    avatarEls.forEach(el => el.textContent   = firstName[0].toUpperCase());
    if (dropName)  dropName.textContent  = currentUser.full_name;
    if (dropEmail) dropEmail.textContent = currentUser.email;
  }
}

function toggleUserMenu() {
  const dd = document.getElementById('userDropdown');
  dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('#navUserInfo')) {
    const dd = document.getElementById('userDropdown');
    if (dd) dd.style.display = 'none';
  }
});

function doLogin(email, password) {
  USERS_DB = loadUsersDB(); // ✅ Reload để có user mới đăng ký
  const user = USERS_DB.find(u => u.email === email && u.password === password);
  if (user) {
    const safe = { id:user.id, email:user.email, full_name:user.full_name, phone:user.phone, address:user.address, role:user.role };
    saveUser(safe);
    showPage('shop');
    showToast('✅ Đăng nhập thành công! Chào ' + safe.full_name.split(' ').pop());
    return true;
  }
  return false;
}

function doRegister(full_name, email, phone, password, address) {
  // Reload từ localStorage để có dữ liệu mới nhất
  USERS_DB = loadUsersDB();
  if (USERS_DB.find(u => u.email === email)) {
    showToast('❌ Email này đã được đăng ký!');
    return false;
  }
  const newId = USERS_DB.length > 0 ? Math.max(...USERS_DB.map(u => u.id)) + 1 : 1;
  const newUser = { id:newId, email, password, full_name, phone, address, role:'customer' };
  USERS_DB.push(newUser);
  saveUsersDB(USERS_DB); // ✅ Lưu vào localStorage
  const safe = { id:newUser.id, email, full_name, phone, address, role:'customer' };
  saveUser(safe);
  showPage('shop');
  showToast('🎉 Đăng ký thành công! Chào mừng ' + full_name.split(' ').pop());
  return true;
}

// ===== DATA =====
const PRODUCTS = [
  // Nike (4 sản phẩm)
  {id:1,  name:"Nike Air Force 1",     brand:"Nike",        cat:"thethao",   gender:"nam", price:2490000, badge:"hot",     emoji:"👟", img:"images/product_1.jpg"},
  {id:2,  name:"Nike Air Jordan 1",    brand:"Nike",        cat:"thethao",   gender:"nam", price:4500000, badge:"hot",     emoji:"🏀", img:"images/product_2.jpg"},
  {id:3,  name:"Nike Dunk Low",        brand:"Nike",        cat:"thoitrang", gender:"nu",  price:2600000, badge:"sale",    oldPrice:3200000, emoji:"👟", img:"images/product_3.jpg"},
  {id:4,  name:"Nike Free Run 5.0",    brand:"Nike",        cat:"chaybo",    gender:"nu",  price:2200000, badge:"new",     emoji:"👠", img:"images/product_4.jpg"},
  // Adidas (4 sản phẩm)
  {id:5,  name:"Adidas Ultraboost 23", brand:"Adidas",      cat:"chaybo",    gender:"nam", price:3800000, badge:"new",     emoji:"🟡", img:"images/product_5.jpg"},
  {id:6,  name:"Adidas Stan Smith",    brand:"Adidas",      cat:"thoitrang", gender:"nu",  price:1990000, badge:"sale",    oldPrice:2400000, emoji:"🟢", img:"images/product_6.jpg"},
  {id:7,  name:"Adidas NMD R1",        brand:"Adidas",      cat:"thethao",   gender:"nam", price:3200000, badge:"popular", emoji:"⚫", img:"images/product_7.jpg"},
  {id:8,  name:"Adidas Forum Low",     brand:"Adidas",      cat:"thoitrang", gender:"nu",  price:2100000, badge:"new",     emoji:"🔵", img:"images/product_8.jpg"},
  // Puma (3 sản phẩm)
  {id:9,  name:"Puma RS-X Efekt",      brand:"Puma",        cat:"thethao",   gender:"nam", price:2100000, badge:"sale",    oldPrice:2600000, emoji:"🐆", img:"images/product_9.jpg"},
  {id:10, name:"Puma Deviate Nitro",   brand:"Puma",        cat:"chaybo",    gender:"nam", price:2800000, badge:"new",     emoji:"⚡", img:"images/product_10.jpg"},
  {id:11, name:"Puma Suede Classic",   brand:"Puma",        cat:"thoitrang", gender:"nu",  price:1600000, badge:null,      emoji:"🐾", img:"images/product_11.jpg"},
  // Converse (2 sản phẩm)
  {id:12, name:"Converse Chuck Taylor",brand:"Converse",    cat:"thoitrang", gender:"nu",  price:1490000, badge:"sale",    oldPrice:1800000, emoji:"⭐", img:"images/product_12.jpg"},
  {id:13, name:"Converse Chuck 70",    brand:"Converse",    cat:"thoitrang", gender:"nu",  price:1750000, badge:"popular", emoji:"💫", img:"images/product_13.jpg"},
  // Vans (3 sản phẩm)
  {id:14, name:"Vans Old Skool",       brand:"Vans",        cat:"thoitrang", gender:"nu",  price:1390000, badge:"popular", emoji:"✔️", img:"images/product_14.jpg"},
  {id:15, name:"Vans Era",             brand:"Vans",        cat:"thoitrang", gender:"nu",  price:1200000, badge:"sale",    oldPrice:1500000, emoji:"🌊", img:"images/product_15.jpg"},
  {id:16, name:"Vans Authentic",       brand:"Vans",        cat:"thoitrang", gender:"nam", price:1050000, badge:"popular", emoji:"🎿", img:"images/product_16.jpg"},
  // New Balance (2 sản phẩm)
  {id:17, name:"New Balance 550",      brand:"New Balance", cat:"thethao",   gender:"nu",  price:2800000, badge:"new",     emoji:"🟠", img:"images/product_17.jpg"},
  {id:18, name:"New Balance 990v5",    brand:"New Balance", cat:"chaybo",    gender:"nam", price:4200000, badge:"popular", emoji:"🇺🇸", img:"images/product_18.jpg"},
  // Reebok (2 sản phẩm)
  {id:19, name:"Reebok Club C 85",     brand:"Reebok",      cat:"thoitrang", gender:"nu",  price:1500000, badge:"popular", emoji:"🎾", img:"images/product_19.jpg"},
  {id:20, name:"Reebok Nano X2",       brand:"Reebok",      cat:"thethao",   gender:"nam", price:2900000, badge:"new",     emoji:"💪", img:"images/product_20.jpg"},
];

let cart = [];
let currentCat = 'all';
let currentSort = 'popular';
let selectedPayMethod = 'cod';
let discount = 0;

// ===== PAGE NAVIGATION =====
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  if(page === 'cart') renderCart();
  window.scrollTo(0,0);
}

// ===== NAV ACTIVE =====
function setNavActive(el) {
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
}

// ===== CATEGORY =====
const catNames = {
  all: 'Tất cả sản phẩm', thethao: 'Giày thể thao',
  nam: 'Giày nam', nu: 'Giày nữ', chaybo: 'Giày chạy bộ',
  thoitrang: 'Giày thời trang', thuonghieu: 'Theo thương hiệu'
};

function showCat(cat) { setCatById(cat); }

function setCat(btn, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentCat = cat;
  document.getElementById('catTitle').textContent = catNames[cat] || 'Tất cả sản phẩm';
  renderProducts();
updateNavUser();
}
function setCatById(cat) {
  currentCat = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.cat-btn').forEach(b => {
    if(b.getAttribute('onclick') && b.getAttribute('onclick').includes("'"+cat+"'")) b.classList.add('active');
  });
  document.getElementById('catTitle').textContent = catNames[cat] || 'Tất cả sản phẩm';
  renderProducts();
updateNavUser();
}

// ===== PRODUCTS RENDER =====
function getFiltered() {
  let prods = [...PRODUCTS];

  // --- Search ---
  const q = document.getElementById('searchInput') ? document.getElementById('searchInput').value.toLowerCase() : '';
  if(q) prods = prods.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));

  // --- Category tab ---
  if(currentCat === 'nam') prods = prods.filter(p => p.gender === 'nam');
  else if(currentCat === 'nu') prods = prods.filter(p => p.gender === 'nu');
  else if(currentCat !== 'all' && currentCat !== 'thuonghieu') prods = prods.filter(p => p.cat === currentCat);

  // --- Sidebar: loại giày (cat + gender) ---
  const checkedCatInputs = [...document.querySelectorAll('input[data-filter="cat"]:checked')];
  const checkedGenderInputs = [...document.querySelectorAll('input[data-filter="gender"]:checked')];
  if(checkedCatInputs.length > 0 || checkedGenderInputs.length > 0) {
    prods = prods.filter(p => {
      const catMatch = checkedCatInputs.length === 0 || checkedCatInputs.some(cb => cb.dataset.val === p.cat);
      const genderMatch = checkedGenderInputs.length === 0 || checkedGenderInputs.some(cb => cb.dataset.val === p.gender);
      return catMatch && genderMatch;
    });
  }

  // --- Sidebar: thương hiệu ---
  const checkedBrands = [...document.querySelectorAll('input[data-filter="brand"]:checked')].map(cb => cb.dataset.val);
  if(checkedBrands.length > 0) {
    prods = prods.filter(p => checkedBrands.includes(p.brand));
  }

  // --- Sidebar: khoảng giá ---
  const minEl = document.getElementById('priceMin');
  const maxEl = document.getElementById('priceMax');
  if(minEl && maxEl) {
    const minP = parseInt(minEl.value) || 0;
    const maxP = parseInt(maxEl.value) || 99999999;
    prods = prods.filter(p => p.price >= minP && p.price <= maxP);
  }

  // --- Sort ---
  if(currentSort === 'price-asc') prods.sort((a,b)=>a.price-b.price);
  else if(currentSort === 'price-desc') prods.sort((a,b)=>b.price-a.price);
  else if(currentSort === 'newest') prods.sort((a,b)=>b.id-a.id);
  else prods.sort((a,b) => (b.badge?1:0)-(a.badge?1:0));

  return prods;
}

function renderProducts() {
  const prods = getFiltered();
  const grid = document.getElementById('productGrid');
  document.getElementById('prodCount').innerHTML = `Hiển thị <strong>${prods.length}</strong> sản phẩm`;
  grid.innerHTML = prods.map(p => {
    const inCart = cart.find(c=>c.id===p.id);
    return `<div class="product-card" onclick="addToCart(${p.id})">
      <div class="product-img">
        ${p.img
          ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px 8px 0 0;" onerror="this.style.display='none';this.nextSibling.style.display='flex'">`
          : ''}
        <div class="product-img-emoji" style="${p.img ? 'display:none;' : ''}align-items:center;justify-content:center;">${p.emoji}</div>
        ${p.badge ? `<span class="product-badge badge-${p.badge==='sale'?'sale':p.badge==='new'?'new':p.badge==='hot'?'hot':'popular'}">${p.badge==='hot'?'Bán chạy':p.badge==='new'?'Mới':p.badge==='sale'?'Sale':'Phổ biến'}</span>` : ''}
        <button class="product-wishlist ${inCart?'liked':''}" onclick="event.stopPropagation();toggleWish(this)">❤️</button>
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand} · ${p.cat==='thethao'?'Giày thể thao':p.cat==='chaybo'?'Giày chạy bộ':'Giày thời trang'}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price-row">
          <div>
            <div class="product-price">${fmt(p.price)}</div>
            ${p.oldPrice ? `<div class="product-old-price">${fmt(p.oldPrice)}</div>` : ''}
          </div>
          <button class="add-btn" onclick="event.stopPropagation();addToCart(${p.id})">+ Thêm</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function sortProducts(val) { currentSort = val; renderProducts();
updateNavUser(); }
function filterProducts() { renderProducts();
updateNavUser(); }

function resetFilters() {
  document.querySelectorAll('.sidebar input[type=checkbox]').forEach(cb => cb.checked = false);
  document.getElementById('priceMin').value = 0;
  document.getElementById('priceMax').value = 6000000;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  renderProducts();
updateNavUser();
  showToast('🔄 Đã xóa tất cả bộ lọc');
}
function doSearch() { renderProducts();
updateNavUser(); }
function toggleSize(btn) { btn.classList.toggle('active'); }
function toggleWish(btn) { btn.classList.toggle('liked'); }

// ===== CART =====
function addToCart(id) {
  const p = PRODUCTS.find(x=>x.id===id);
  const existing = cart.find(c=>c.id===id);
  if(existing) existing.qty++;
  else cart.push({...p, qty:1});
  updateBadge();
  showToast('✅ Đã thêm "' + p.name + '" vào giỏ hàng!');
}

function updateBadge() {
  const total = cart.reduce((s,c)=>s+c.qty,0);
  document.querySelectorAll('#cartBadge,#cartBadge2').forEach(b => b.textContent = total);
}

function renderCart() {
  const body = document.getElementById('cartBody');
  if(cart.length === 0) {
    body.innerHTML = `<div class="cart-empty">
      <div class="cart-empty-icon">🛒</div>
      <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
      <button class="checkout-btn" style="width:auto;padding:14px 28px" onclick="showPage('shop')">Tiếp tục mua sắm</button>
    </div>`;
    updateSummary();
    return;
  }
  body.innerHTML = `
    <div class="shipping-bar">
      <span class="icon">🚚</span>
      <span style="color:#92400e">Mua thêm để được <strong>miễn phí vận chuyển!</strong> 🎉 <span style="color:#059669">Bạn được miễn phí vận chuyển cho đơn hàng này!</span></span>
    </div>
    <div class="cart-items-header" style="margin-top:20px">
      <span>Sản phẩm</span><span></span><span style="text-align:center">Số lượng</span><span style="text-align:right">Đơn giá</span><span></span>
    </div>
    <div class="cart-items">
      ${cart.map(item=>`
        <div class="cart-item">
          <div class="cart-item-img">${item.emoji}</div>
          <div class="cart-item-info">
            <div class="cart-item-brand">${item.brand}</div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-size">Size: 42 | Màu: Trắng/Đen</div>
          </div>
          <div class="qty-ctrl">
            <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
          </div>
          <div class="cart-item-price">${fmt(item.price * item.qty)}</div>
          <button class="remove-btn" onclick="removeItem(${item.id})">🗑️</button>
        </div>
      `).join('')}
    </div>`;
  updateSummary();
}

function changeQty(id, delta) {
  const item = cart.find(c=>c.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(c=>c.id!==id);
  updateBadge(); renderCart();
}
function removeItem(id) { cart = cart.filter(c=>c.id!==id); updateBadge(); renderCart(); }

function updateSummary() {
  const sub = cart.reduce((s,c)=>s+c.price*c.qty,0);
  const total = Math.max(0, sub - discount);
  document.getElementById('sumSubtotal').textContent = fmt(sub);
  document.getElementById('sumDiscount').textContent = discount > 0 ? '-' + fmt(discount) : 'Không có';
  document.getElementById('sumTotal').textContent = fmt(total);
}

function applyCoupon() {
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  if(code === 'TIEMGIAY10') { discount = 100000; showToast('🎉 Áp dụng mã giảm 100.000đ thành công!','success'); }
  else if(code === 'SALE20') { discount = 200000; showToast('🎉 Áp dụng mã giảm 200.000đ thành công!','success'); }
  else { showToast('❌ Mã giảm giá không hợp lệ'); }
  updateSummary();
}

// ===== PAYMENT =====
function openPayment() {
  if(cart.length===0) { showToast('🛒 Giỏ hàng trống!'); return; }
  if(!currentUser) {
    showToast('🔒 Vui lòng đăng nhập để thanh toán!');
    setTimeout(() => showPage('login'), 800);
    return;
  }
  // Điền sẵn thông tin người dùng vào form thanh toán
  const nameEl = document.getElementById('payName');
  const phoneEl = document.getElementById('payPhone');
  const addrEl = document.getElementById('payAddress');
  if (nameEl && !nameEl.value) nameEl.value = currentUser.full_name || '';
  if (phoneEl && !phoneEl.value) phoneEl.value = currentUser.phone || '';
  if (addrEl && !addrEl.value) addrEl.value = currentUser.address || '';
  const total = cart.reduce((s,c)=>s+c.price*c.qty,0) - discount;
  document.getElementById('modalTotal').textContent = fmt(Math.max(0,total));
  document.getElementById('qrOrderId').textContent = String(Math.floor(Math.random()*900)+100);
  document.getElementById('paymentModal').classList.add('open');
}
function closePayment() { document.getElementById('paymentModal').classList.remove('open'); }

function selectPay(el, method) {
  document.querySelectorAll('.pay-method').forEach(m=>m.classList.remove('selected'));
  el.classList.add('selected');
  selectedPayMethod = method;
  document.getElementById('payFormCOD').style.display = 'none';
  document.getElementById('payFormCARD').style.display = 'none';
  document.getElementById('payFormQR').style.display = 'none';
  if(method==='cod') document.getElementById('payFormCOD').style.display='block';
  else if(method==='card') document.getElementById('payFormCARD').style.display='block';
  else { document.getElementById('payFormQR').style.display='block'; document.getElementById('qrAppName').textContent = {momo:'MoMo',vnpay:'VNPay',zalopay:'ZaloPay',banking:'ngân hàng'}[method]||method; }
}

const PAYMENT_CONTENT_ORIGINAL = null; // filled on first open

function confirmPayment() {
  const orderNum = Math.floor(Math.random()*90000)+10000;
  document.getElementById('paymentContent').innerHTML = `<div class="success-modal">
    <div class="success-icon">🎉</div>
    <h2>Đặt hàng thành công!</h2>
    <p>Cảm ơn bạn đã mua hàng tại TIEMBANGIAY.<br>Đơn hàng của bạn sẽ được giao trong <strong>24 giờ</strong>.<br><br>Mã đơn hàng: <strong style="color:var(--red)">#TBGAY${orderNum}</strong></p>
    <button class="auth-submit" style="margin-top:24px" onclick="afterOrder()">Về trang chủ</button>
  </div>`;
}

function afterOrder() {
  closePayment();
  cart = [];
  discount = 0;
  updateBadge();
  showPage('shop');
  // Reset payment modal content for next use
  setTimeout(() => {
    const pc = document.getElementById('paymentContent');
    if(pc) pc.innerHTML = window._paymentHTML;
  }, 400);
}

// ===== UTILS =====
function fmt(n) { return n.toLocaleString('vi-VN') + 'đ'; }

function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type?' '+type:'');
  clearTimeout(t._t);
  t._t = setTimeout(()=>t.classList.remove('show'),2800);
}

function checkStrength(input) {
  const val = input.value;
  const segs = [document.getElementById('s1'),document.getElementById('s2'),document.getElementById('s3'),document.getElementById('s4')];
  let strength = 0;
  if(val.length>4) strength++;
  if(val.length>8) strength++;
  if(/[A-Z]/.test(val)&&/[0-9]/.test(val)) strength++;
  if(val.length>12&&/[!@#$%^&*]/.test(val)) strength++;
  const colors = ['#ef4444','#f59e0b','#3b82f6','#10b981'];
  segs.forEach((s,i) => { s.style.background = i<strength ? colors[strength-1] : 'var(--gray2)'; });
}

// ===== AUTH HANDLERS =====
function handleLogin() {
  const email    = document.getElementById('loginEmail') ? document.getElementById('loginEmail').value.trim() : '';
  const password = document.getElementById('loginPassword') ? document.getElementById('loginPassword').value : '';
  const errEl    = document.getElementById('loginError');
  if (!email || !password) {
    if (errEl) { errEl.textContent='❌ Vui lòng nhập đầy đủ thông tin!'; errEl.style.display='block'; }
    return;
  }
  const ok = doLogin(email, password);
  if (!ok) { if (errEl) errEl.style.display = 'block'; }
  else {
    if (errEl) errEl.style.display = 'none';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
  }
}

function handleRegister() {
  const name     = document.getElementById('regName') ? document.getElementById('regName').value.trim() : '';
  const email    = document.getElementById('regEmail') ? document.getElementById('regEmail').value.trim() : '';
  const phone    = document.getElementById('regPhone') ? document.getElementById('regPhone').value.trim() : '';
  const password = document.getElementById('regPassword') ? document.getElementById('regPassword').value : '';
  const address  = document.getElementById('regAddress') ? document.getElementById('regAddress').value.trim() : '';
  const errEl    = document.getElementById('registerError');
  if (!name || !email || !password) {
    if (errEl) { errEl.textContent='❌ Vui lòng nhập đầy đủ thông tin!'; errEl.style.display='block'; }
    return;
  }
  if (password.length < 6) {
    if (errEl) { errEl.textContent='❌ Mật khẩu phải có ít nhất 6 ký tự!'; errEl.style.display='block'; }
    return;
  }
  if (errEl) errEl.style.display = 'none';
  doRegister(name, email, phone, password, address);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
updateNavUser();
  // Save original payment modal HTML so it can be restored after successful order
  window._paymentHTML = document.getElementById('paymentContent').innerHTML;
});
document.getElementById('paymentModal').addEventListener('click', e => { if(e.target===document.getElementById('paymentModal')) closePayment(); });