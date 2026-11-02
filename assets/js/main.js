/*
================================================================================
Project: Official Website for El Sherif Plastic Tanks & Industrial Plastics

Design & Development: Eng. Eyad Soliman
Digital Solutions & Software Development: SpeedUp

Official Website: https://speed-up.tech/

© 2026 SpeedUp. All Rights Reserved.
================================================================================
*/

// إعدادات وبيانات الاتصال الرسمية المعتمدة
const OFFICIAL_WHATSAPP = "201011380713";
const OFFICIAL_PHONE = "01011380713";

let currentCategory = "all";
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupEventListeners();
  setupSidebarDrawer();
  setupCapacityCalculator();
  setupCounters();
  checkUrlParams();
});

// فحص معلمات الرابط لملء نموذج عرض السعر تلقائياً
function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const prodParam = urlParams.get('product');
  if (prodParam) {
    const productInput = document.getElementById("quote-product-name");
    if (productInput) {
      productInput.value = prodParam;
      const quoteEl = document.getElementById("quote");
      if (quoteEl) quoteEl.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// تهيئة وعرض المنتجات في الشبكة (متجاوبة تماماً)
function renderProducts() {
  const container = document.getElementById("products-grid");
  if (!container) return;

  // فلترة حسب القسم والبحث
  const filtered = alsharifProducts.filter(p => {
    const matchCategory = currentCategory === "all" || p.category === currentCategory;
    const matchSearch = searchQuery === "" || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.capacity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.recommendedFor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 sm:py-16 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div class="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl sm:text-2xl">
          <i class="fas fa-search"></i>
        </div>
        <h4 class="text-base sm:text-xl font-bold text-slate-800 mb-1">لم نعثر على نتائج تطابق بحثك</h4>
        <p class="text-slate-500 text-xs sm:text-sm mb-4">جرب البحث بكلمات أخرى مثل "خزان"، "3000"، "كشك"، أو "حاجز".</p>
        <button onclick="resetFilters()" class="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-xs sm:text-sm">
          عرض جميع المنتجات
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => {
    const whatsappMsg = encodeURIComponent(
      `السلام عليكم ورحمة الله، أود الاستفسار وطلب حجز لمنتج: ${product.name} (${product.capacity}) من شركة الشريف للخزانات.`
    );

    return `
      <div class="product-card bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col group border border-slate-200 hover:shadow-md transition">
        
        <!-- شارات المنتج العلوية (منفصلة تماماً في صف مخصص لضمان وضوح كامل النص بدون أي حجب) -->
        <div class="px-3.5 pt-3.5 pb-1 flex items-center justify-between gap-2 z-10 bg-white">
          <span class="bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm leading-none">
            ${product.badge}
          </span>
          <span class="bg-slate-800 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md shrink-0 leading-none">
            ${product.capacity}
          </span>
        </div>

        <!-- مساحة صورة المنتج المتناسقة -->
        <div class="product-img-wrapper relative p-3 sm:p-5 flex items-center justify-center min-h-[180px] sm:min-h-[220px] border-b border-slate-100 bg-white">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            class="product-img max-h-36 sm:max-h-48 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          >
        </div>

        <!-- محتوى البطاقة المتجاوب -->
        <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="text-[11px] text-blue-600 font-bold mb-0.5">${product.categoryName}</div>
            <h3 class="text-sm sm:text-base font-extrabold text-slate-800 mb-1.5 leading-snug group-hover:text-blue-600 transition-colors">
              ${product.name}
            </h3>
            
            <p class="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
              ${product.features[0]}
            </p>

            <!-- المزايا السريعة -->
            <div class="space-y-1 mb-4 text-[11px] sm:text-xs text-slate-600 border-t border-slate-100 pt-2.5">
              <div class="flex items-center gap-1.5">
                <i class="fas fa-shield-alt text-amber-500 text-[10px]"></i>
                <span>${product.warranty}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-layer-group text-blue-500 text-[10px]"></i>
                <span class="truncate">${product.type}</span>
              </div>
            </div>
          </div>

          <!-- الأزرار المتجاوبة -->
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button 
              onclick="openProductModal('${product.id}')" 
              class="w-full py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <i class="fas fa-eye text-blue-600 text-xs"></i>
              <span>المواصفات</span>
            </button>
            <a 
              href="https://wa.me/${OFFICIAL_WHATSAPP}?text=${whatsappMsg}" 
              target="_blank" 
              class="w-full py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition"
            >
              <i class="fab fa-whatsapp text-sm"></i>
              <span>طلب تسعير</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// نافذة تفاصيل المنتج المنبثقة المتجاوبة (Responsive Modal)
function openProductModal(productId) {
  const product = alsharifProducts.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("product-modal");
  const modalContent = document.getElementById("modal-dynamic-content");

  const whatsappMsg = encodeURIComponent(
    `السلام عليكم ورحمة الله، أود الاستفسار والحصول على عرض سعر مفصل لمنتج:\n*${product.name}*\nالسعة: ${product.capacity}\nالنوع: ${product.type}\nبرجاء موافاتي بالسعر وموعد التوريد.`
  );

  modalContent.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
      <!-- صورة المنتج -->
      <div class="bg-gradient-to-br from-slate-50 to-blue-50/50 p-4 sm:p-6 rounded-2xl flex items-center justify-center border border-slate-200/80">
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          class="max-h-48 sm:max-h-64 w-auto object-contain drop-shadow-xl"
        >
      </div>

      <!-- تفاصيل المنتج ومواصفاته الفنية -->
      <div>
        <div class="inline-block bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full mb-1.5">
          ${product.categoryName}
        </div>
        <h2 class="text-lg sm:text-2xl font-black text-slate-900 mb-1 leading-snug">${product.name}</h2>
        <div class="text-xs text-slate-500 mb-3 flex items-center gap-3">
          <span><i class="fas fa-ruler-combined text-blue-500 ml-1"></i> ${product.dimensions}</span>
        </div>

        <div class="bg-blue-50/70 border border-blue-200/60 p-3 sm:p-4 rounded-xl mb-4 space-y-1.5 text-xs sm:text-sm">
          <div class="flex items-center justify-between text-slate-700">
            <span class="font-bold text-slate-900">السعة:</span>
            <span>${product.capacity}</span>
          </div>
          <div class="flex items-center justify-between text-slate-700">
            <span class="font-bold text-slate-900">الخامة:</span>
            <span class="truncate max-w-[180px]">${product.material}</span>
          </div>
          <div class="flex items-center justify-between text-slate-700">
            <span class="font-bold text-slate-900">الضمان:</span>
            <span class="text-emerald-700 font-bold">${product.warranty}</span>
          </div>
        </div>

        <h4 class="font-bold text-slate-900 mb-1.5 text-xs sm:text-sm">المميزات والمواصفات:</h4>
        <ul class="space-y-1 mb-4 text-[11px] sm:text-xs text-slate-600">
          ${product.features.slice(0, 4).map(f => `
            <li class="flex items-start gap-1.5">
              <i class="fas fa-check-circle text-emerald-500 mt-0.5 shrink-0 text-[10px]"></i>
              <span>${f}</span>
            </li>
          `).join("")}
        </ul>

        <!-- أزرار الإجراءات في المودال -->
        <div class="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
          <a 
            href="https://wa.me/${OFFICIAL_WHATSAPP}?text=${whatsappMsg}" 
            target="_blank" 
            class="w-full sm:flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center flex items-center justify-center gap-2 text-xs shadow-md transition"
          >
            <i class="fab fa-whatsapp text-base"></i>
            <span>اطلب عبر واتساب</span>
          </a>
          <button 
            onclick="prefillQuoteModal('${product.name}', '${product.capacity}')" 
            class="w-full sm:w-auto py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center flex items-center justify-center gap-1.5 text-xs transition cursor-pointer"
          >
            <i class="fas fa-file-invoice-dollar"></i>
            <span>طلب عرض سعر مكتوب</span>
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
}

// إعداد أحداث الفلترة والبحث
function setupEventListeners() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => {
        b.classList.remove("bg-blue-600", "text-white", "shadow-md");
        b.classList.add("bg-white", "text-slate-700", "border", "border-slate-200");
      });
      btn.classList.add("bg-blue-600", "text-white", "shadow-md");
      btn.classList.remove("bg-white", "text-slate-700", "border", "border-slate-200");

      currentCategory = btn.getAttribute("data-category");
      renderProducts();
    });
  });

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      renderProducts();
    });
  }

  const modal = document.getElementById("product-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeProductModal();
      }
    });
  }

  const quoteForm = document.getElementById("quote-form");
  if (quoteForm) {
    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleQuoteSubmit();
    });
  }
}

// إعداد والتحكم في القائمة الجانبية المنزلقة (Slidebar Drawer)
function setupSidebarDrawer() {
  const toggleBtn = document.getElementById("sidebar-toggle-btn");
  const closeBtn = document.getElementById("sidebar-close-btn");
  const drawer = document.getElementById("sidebar-drawer");
  const overlay = document.getElementById("sidebar-overlay");
  const links = document.querySelectorAll(".sidebar-link");

  function openSidebar() {
    if (!drawer || !overlay) return;
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    if (!drawer || !overlay) return;
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (toggleBtn) toggleBtn.addEventListener("click", openSidebar);
  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);

  links.forEach(link => {
    link.addEventListener("click", () => {
      closeSidebar();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer && drawer.classList.contains("open")) {
      closeSidebar();
    }
  });
}

function resetFilters() {
  currentCategory = "all";
  searchQuery = "";
  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.value = "";
  
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn, idx) => {
    if (idx === 0) {
      btn.classList.add("bg-blue-600", "text-white", "shadow-md");
      btn.classList.remove("bg-white", "text-slate-700", "border", "border-slate-200");
    } else {
      btn.classList.remove("bg-blue-600", "text-white", "shadow-md");
      btn.classList.add("bg-white", "text-slate-700", "border", "border-slate-200");
    }
  });

  renderProducts();
}

// حاسبة سعة الخزان الذكية (Smart Capacity Calculator)
function setupCapacityCalculator() {
  const calcBtn = document.getElementById("calc-btn");
  if (!calcBtn) return;

  calcBtn.addEventListener("click", () => {
    const buildingType = document.getElementById("calc-building").value;
    const peopleCount = parseInt(document.getElementById("calc-people").value) || 4;
    const reserveDays = parseInt(document.getElementById("calc-days").value) || 2;

    let perPersonPerDay = 150;
    if (buildingType === "villa") perPersonPerDay = 250;
    if (buildingType === "commercial") perPersonPerDay = 350;

    const totalLitres = peopleCount * perPersonPerDay * reserveDays;

    let recommendedModel;
    if (totalLitres <= 1000) {
      recommendedModel = alsharifProducts.find(p => p.id === "tank-white-500") || alsharifProducts[0];
    } else if (totalLitres <= 4000) {
      recommendedModel = alsharifProducts.find(p => p.id === "tank-white-3000") || alsharifProducts[0];
    } else if (totalLitres <= 12000) {
      recommendedModel = alsharifProducts.find(p => p.id === "tank-white-10000") || alsharifProducts[0];
    } else if (totalLitres <= 18000) {
      recommendedModel = alsharifProducts.find(p => p.id === "tank-white-15000") || alsharifProducts[0];
    } else if (totalLitres <= 25000) {
      recommendedModel = alsharifProducts.find(p => p.id === "tank-white-20000") || alsharifProducts[0];
    } else {
      recommendedModel = alsharifProducts.find(p => p.id === "tank-white-30000") || alsharifProducts[0];
    }

    const resultBox = document.getElementById("calc-result");
    resultBox.classList.remove("hidden");
    resultBox.innerHTML = `
      <div class="p-4 sm:p-6 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl shadow-xl mt-6 border border-blue-500/30">
        <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <img src="${recommendedModel.image}" alt="${recommendedModel.name}" class="h-32 sm:h-44 w-auto object-contain drop-shadow-2xl">
          <div class="flex-1 text-center sm:text-right">
            <span class="inline-block bg-emerald-500 text-slate-900 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full mb-1.5">
              الخيار الموصى به بدقة
            </span>
            <h3 class="text-lg sm:text-2xl font-black text-white mb-1">${recommendedModel.name}</h3>
            <p class="text-blue-200 text-xs sm:text-sm mb-3">
              إجمالي الاحتياج: <strong>${totalLitres.toLocaleString()} لتر</strong> لمدة <strong>${reserveDays} أيام</strong>.
            </p>
            <div class="flex flex-wrap gap-2 justify-center sm:justify-start mb-4 text-[11px]">
              <span class="bg-blue-800/80 px-2 py-0.5 rounded"><i class="fas fa-check text-emerald-400 ml-1"></i> ${recommendedModel.warranty}</span>
              <span class="bg-blue-800/80 px-2 py-0.5 rounded truncate"><i class="fas fa-tint text-sky-400 ml-1"></i> ${recommendedModel.material}</span>
            </div>
            <div class="flex flex-col sm:flex-row gap-2 justify-center sm:justify-start">
              <a 
                href="https://wa.me/${OFFICIAL_WHATSAPP}?text=${encodeURIComponent(`السلام عليكم، بناءً على حاسبة سعة الخزان في موقعكم، تم ترشيح: ${recommendedModel.name} بسعة ${recommendedModel.capacity}. أود الاستفسار عن السعر وميعاد التوريد.`)}" 
                target="_blank"
                class="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-extrabold rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <i class="fab fa-whatsapp text-base"></i>
                <span>حجز هذا الخزان الآن</span>
              </a>
              <button 
                onclick="openProductModal('${recommendedModel.id}')"
                class="w-full sm:w-auto px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition border border-white/20 text-xs sm:text-sm"
              >
                عرض كامل المواصفات
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

// تعبئة نموذج عرض السعر لمنتج محدد
function prefillQuoteModal(productName, capacity) {
  closeProductModal();
  const quoteEl = document.getElementById("quote");
  const productSelect = document.getElementById("quote-product-name");
  
  if (productSelect && quoteEl) {
    productSelect.value = `${productName} (${capacity})`;
    quoteEl.scrollIntoView({ behavior: 'smooth' });
  } else {
    // الانتقال لصفحة contact.html مع تضمين المنتج في الرابط
    window.location.href = `contact.html?product=${encodeURIComponent(productName + ' (' + capacity + ')')}`;
  }
}

// معالجة إرسال نموذج عرض السعر
function handleQuoteSubmit() {
  const name = document.getElementById("quote-name").value;
  const phone = document.getElementById("quote-phone").value;
  const product = document.getElementById("quote-product-name").value;
  const city = document.getElementById("quote-city").value;
  const notes = document.getElementById("quote-notes").value;

  const msg = encodeURIComponent(
    `*طلب عرض سعر وحجز جديد - شركة الشريف للخزانات*\n\n` +
    `👤 الاسم: ${name}\n` +
    `📱 الهاتف: ${phone}\n` +
    `📦 المنتج المطلوب: ${product}\n` +
    `📍 المدينة/المحافظة: ${city}\n` +
    `📝 ملاحظات إضافية: ${notes || "لا يوجد"}\n`
  );

  const confirmMsg = document.getElementById("quote-success-msg");
  if (confirmMsg) {
    confirmMsg.classList.remove("hidden");
  }

  setTimeout(() => {
    window.open(`https://wa.me/${OFFICIAL_WHATSAPP}?text=${msg}`, '_blank');
  }, 800);
}

function setupCounters() {
  const statsSection = document.getElementById("stats-section");
  if (!statsSection) return;

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      const counters = document.querySelectorAll(".counter-value");
      counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        let count = 0;
        const speed = target / 50;
        const updateCount = () => {
          count += speed;
          if (count < target) {
            counter.innerText = Math.ceil(count);
            setTimeout(updateCount, 30);
          } else {
            counter.innerText = target.toLocaleString();
          }
        };
        updateCount();
      });
    }
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}
