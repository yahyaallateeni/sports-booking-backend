<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>إدارة الملاعب</title>
  <link rel="stylesheet" href="/assets/styles.css" />
  <script defer src="/assets/app.js"></script>
  <style>
    body.owner-guard-loading .owner-page-shell {
      display: none;
    }

    .owner-loading-screen {
      display: none;
    }

    body.owner-guard-loading .owner-loading-screen {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f6f8fb;
      color: #0f172a;
      font-size: 18px;
      font-weight: 700;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .form-grid .field.full {
      grid-column: 1 / -1;
    }

    .venues-list {
      display: grid;
      gap: 16px;
    }

    .venue-card {
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 16px;
      background: #fff;
    }

    .venue-card h4 {
      margin: 0 0 10px;
      font-size: 18px;
    }

    .venue-meta {
      display: grid;
      gap: 8px;
      color: #475569;
      font-size: 14px;
    }

    .badge-inline {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      background: #eef2ff;
      color: #3730a3;
      font-size: 12px;
      font-weight: 700;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>

  <script>
    (function () {
      document.documentElement.classList.add('owner-guard-loading');
      document.addEventListener('DOMContentLoaded', function () {
        document.body.classList.add('owner-guard-loading');
      });
    })();
  </script>
</head>
<body>
  <div class="owner-loading-screen">جارٍ التحقق من صلاحية المالك...</div>

  <div class="owner-page-shell">
    <header class="topbar">
      <div class="container nav">
        <a class="brand" href="/">ملاعب</a>
        <nav class="nav-links">
          <a class="nav-link" href="/">الرئيسية</a>
          <a class="nav-link" href="/venues/">الملاعب</a>
          <a class="nav-link" href="/booking/">الحجز</a>
          <a class="nav-link" href="/profile/">حسابي</a>
          <a class="nav-link" href="/owner/">لوحة المالك</a>
          <a class="nav-link" href="/admin/">لوحة الأدمن</a>
        </nav>
        <div class="nav-actions">
          <a class="btn btn-secondary" href="/owner/">لوحة المالك</a>
          <a class="btn btn-primary" href="/owner/venues-management/">إدارة الملاعب</a>
        </div>
      </div>
    </header>

    <section class="dashboard-wrap">
      <div class="container">
        <h1 class="page-title">إدارة الملاعب</h1>
        <p class="page-sub">أضف ملعبك وابدأ بناء صفحة منشأتك الرياضية داخل المنصة.</p>

        <div id="owner-alert" class="notice" style="display:none; margin-top:16px;"></div>

        <div class="grid-2" style="margin-top:20px">
          <div class="card card-body">
            <h3 style="margin-top:0">بيانات المالك</h3>
            <table class="table">
              <tr><td>الاسم</td><td id="owner-name">—</td></tr>
              <tr><td>البريد</td><td id="owner-email">—</td></tr>
              <tr><td>الجوال</td><td id="owner-phone">—</td></tr>
              <tr><td>الحالة</td><td id="owner-status">—</td></tr>
            </table>

            <div class="toolbar" style="margin-top:16px">
              <a class="btn btn-secondary" href="/owner/">العودة للوحة المالك</a>
              <button id="owner-logout-btn" class="btn btn-secondary" type="button">تسجيل الخروج</button>
            </div>
          </div>

          <div class="card card-body">
            <h3 style="margin-top:0">إحصاءات سريعة</h3>
            <div class="grid-2">
              <div class="kpi">
                <div class="v" id="venues-count">0</div>
                <div>عدد الملاعب</div>
              </div>
              <div class="kpi">
                <div class="v">0</div>
                <div>ملاعب معتمدة</div>
              </div>
            </div>
            <p class="small" style="margin-top:16px">
              هذه الصفحة الآن مربوطة بإنشاء ملعب فعليًا في قاعدة البيانات، وسنربط عرض قائمة الملاعب المملوكة لك في الخطوة التالية.
            </p>
          </div>
        </div>

        <div class="card card-body" style="margin-top:20px">
          <h3 style="margin-top:0">إضافة ملعب جديد</h3>

          <form id="create-venue-form" style="margin-top:16px">
            <div class="form-grid">
              <div class="field">
                <label for="venue-name">اسم الملعب</label>
                <input id="venue-name" type="text" placeholder="ملعب النخبة" required />
              </div>

              <div class="field">
                <label for="venue-sport">نوع الرياضة</label>
                <select id="venue-sport" required>
                  <option value="FOOTBALL">كرة قدم</option>
                  <option value="PADEL">بادل</option>
                  <option value="TENNIS">تنس</option>
                  <option value="BASKETBALL">كرة سلة</option>
                  <option value="VOLLEYBALL">كرة طائرة</option>
                </select>
              </div>

              <div class="field">
                <label for="venue-city">المدينة</label>
                <select id="venue-city" required>
                  <option value="">جارٍ تحميل المدن...</option>
                </select>
              </div>

              <div class="field">
                <label for="venue-area">الحي / المنطقة</label>
                <select id="venue-area" required>
                  <option value="">اختر المدينة أولًا</option>
                </select>
              </div>

              <div class="field">
                <label for="venue-price">السعر بالساعة</label>
                <input id="venue-price" type="number" min="1" step="1" placeholder="200" required />
              </div>

              <div class="field">
                <label for="venue-capacity">السعة</label>
                <input id="venue-capacity" type="number" min="1" step="1" placeholder="10" required />
              </div>

              <div class="field full">
                <label for="venue-description">الوصف</label>
                <textarea id="venue-description" rows="4" placeholder="اكتب وصفًا مختصرًا عن الملعب والخدمات المتاحة..." required></textarea>
              </div>

              <div class="field full">
                <label for="venue-image">رابط صورة رئيسية</label>
                <input id="venue-image" type="url" placeholder="https://example.com/image.jpg" />
              </div>
            </div>

            <div class="toolbar" style="margin-top:20px">
              <button id="create-venue-submit" class="btn btn-primary" type="submit">إضافة الملعب</button>
              <button id="reset-venue-form" class="btn btn-secondary" type="button">مسح الحقول</button>
            </div>
          </form>
        </div>

        <div class="card card-body" style="margin-top:20px">
          <h3 style="margin-top:0">آخر ملعب تمت إضافته في هذه الجلسة</h3>
          <div id="latest-venue-box" class="venues-list" style="margin-top:16px;">
            <div class="small">لم يتم إضافة أي ملعب بعد.</div>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container footer-inner">
        <div>© 2026 ملاعب. منصة حجز ملاعب رياضية.</div>
        <div>واجهة عربية وتجربة حجز واضحة وسريعة.</div>
      </div>
    </footer>
  </div>

  <script src="/assets/api.js"></script>
  <script>
    function mapStatus(value) {
      if (value === 'ACTIVE') return 'نشط';
      if (value === 'PENDING_VERIFICATION') return 'قيد التحقق';
      if (value === 'SUSPENDED') return 'موقوف';
      return value || 'غير معروف';
    }

    function mapSportLabel(value) {
      if (value === 'FOOTBALL') return 'كرة قدم';
      if (value === 'PADEL') return 'بادل';
      if (value === 'TENNIS') return 'تنس';
      if (value === 'BASKETBALL') return 'كرة سلة';
      if (value === 'VOLLEYBALL') return 'كرة طائرة';
      return value || 'غير محدد';
    }

    function showAlert(text, isError = false) {
      const box = document.getElementById('owner-alert');
      if (!box) return;

      box.style.display = 'block';
      box.textContent = text;
      box.style.background = isError ? '#fee2e2' : '#dcfce7';
      box.style.borderColor = isError ? '#fecaca' : '#bbf7d0';
      box.style.color = isError ? '#991b1b' : '#166534';
    }

    function readUser() {
      try {
        const localUser = localStorage.getItem('currentUser');
        if (localUser) return JSON.parse(localUser);

        const sessionUser = sessionStorage.getItem('currentUser');
        if (sessionUser) return JSON.parse(sessionUser);

        return null;
      } catch (error) {
        return null;
      }
    }

    function logout() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('registeredUserId');
      localStorage.removeItem('registeredAccountType');

      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('isAuthenticated');

      window.location.href = '/login/';
    }

    async function apiRequestWithAuth(path, options = {}) {
      const accessToken =
        localStorage.getItem('accessToken') ||
        sessionStorage.getItem('accessToken') ||
        '';

      const response = await fetch(`/api/v1${path}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          ...(options.headers || {}),
        },
        ...options,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          data?.message ||
          data?.error ||
          'حدث خطأ أثناء الاتصال بالخادم';
        throw new Error(Array.isArray(message) ? message.join(', ') : message);
      }

      return data;
    }

    async function fetchCities() {
      return apiRequestWithAuth('/locations/cities', {
        method: 'GET',
      });
    }

    async function fetchAreas(cityId) {
      return apiRequestWithAuth(`/locations/cities/${cityId}/areas`, {
        method: 'GET',
      });
    }

    async function createVenue(payload) {
      return apiRequestWithAuth('/venues', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }

    function populateOwner(user) {
      const displayName =
        user.fullName ||
        [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
        user.email ||
        user.phone ||
        '—';

      document.getElementById('owner-name').textContent = displayName;
      document.getElementById('owner-email').textContent = user.email || 'غير مضاف';
      document.getElementById('owner-phone').textContent = user.phone || 'غير مضاف';
      document.getElementById('owner-status').textContent = mapStatus(user.status);
    }

    function renderLatestVenue(venue) {
      const box = document.getElementById('latest-venue-box');
      if (!box) return;

      box.innerHTML = `
        <div class="venue-card">
          <div class="badge-inline">تمت الإضافة</div>
          <h4>${venue.name || '—'}</h4>
          <div class="venue-meta">
            <div><strong>الرياضة:</strong> ${mapSportLabel(venue.sportType)}</div>
            <div><strong>السعر:</strong> ${venue.hourlyPrice || 0} ريال / ساعة</div>
            <div><strong>السعة:</strong> ${venue.capacity || 0}</div>
            <div><strong>المدينة:</strong> ${venue.cityName || '—'}</div>
            <div><strong>الحي:</strong> ${venue.areaName || '—'}</div>
            <div><strong>الحالة:</strong> ${venue.status || 'PENDING_REVIEW'}</div>
          </div>
        </div>
      `;

      const countBox = document.getElementById('venues-count');
      if (countBox) {
        const current = Number(countBox.textContent || '0');
        countBox.textContent = String(current + 1);
      }
    }

    async function loadCitiesIntoSelect() {
      const citySelect = document.getElementById('venue-city');
      const areaSelect = document.getElementById('venue-area');

      try {
        const cities = await fetchCities();

        citySelect.innerHTML = '<option value="">اختر المدينة</option>';

        cities.forEach((city) => {
          const option = document.createElement('option');
          option.value = city.id;
          option.textContent = city.nameArabic || city.name || city.id;
          citySelect.appendChild(option);
        });

        areaSelect.innerHTML = '<option value="">اختر المدينة أولًا</option>';
      } catch (error) {
        citySelect.innerHTML = '<option value="">تعذر تحميل المدن</option>';
        areaSelect.innerHTML = '<option value="">تعذر تحميل الأحياء</option>';
        showAlert(error.message || 'تعذر تحميل المدن.', true);
      }
    }

    async function loadAreasIntoSelect(cityId) {
      const areaSelect = document.getElementById('venue-area');

      if (!cityId) {
        areaSelect.innerHTML = '<option value="">اختر المدينة أولًا</option>';
        return;
      }

      try {
        const areas = await fetchAreas(cityId);

        areaSelect.innerHTML = '<option value="">اختر الحي / المنطقة</option>';

        areas.forEach((area) => {
          const option = document.createElement('option');
          option.value = area.id;
          option.textContent = area.nameArabic || area.name || area.id;
          areaSelect.appendChild(option);
        });
      } catch (error) {
        areaSelect.innerHTML = '<option value="">تعذر تحميل الأحياء</option>';
        showAlert(error.message || 'تعذر تحميل الأحياء.', true);
      }
    }

    function guardOwnerPage() {
      const user = readUser();

      if (!user || (!user.id && !user.email && !user.phone)) {
        window.location.replace('/login/');
        return null;
      }

      if (user.accountType !== 'OWNER') {
        window.location.replace('/profile/');
        return null;
      }

      return user;
    }

    document.addEventListener('DOMContentLoaded', async function () {
      const user = guardOwnerPage();
      if (!user) return;

      populateOwner(user);
      document.body.classList.remove('owner-guard-loading');
      document.documentElement.classList.remove('owner-guard-loading');

      const logoutBtn = document.getElementById('owner-logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
      }

      await loadCitiesIntoSelect();

      const citySelect = document.getElementById('venue-city');
      citySelect.addEventListener('change', async function () {
        await loadAreasIntoSelect(citySelect.value);
      });

      const form = document.getElementById('create-venue-form');
      const submitBtn = document.getElementById('create-venue-submit');
      const resetBtn = document.getElementById('reset-venue-form');

      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const selectedCity = citySelect.options[citySelect.selectedIndex];
        const areaSelect = document.getElementById('venue-area');
        const selectedArea = areaSelect.options[areaSelect.selectedIndex];

        const payload = {
          ownerUserId: user.id,
          name: document.getElementById('venue-name').value.trim(),
          sportType: document.getElementById('venue-sport').value,
          cityId: citySelect.value,
          cityName: selectedCity ? selectedCity.textContent : '',
          areaId: areaSelect.value,
          areaName: selectedArea ? selectedArea.textContent : '',
          hourlyPrice: Number(document.getElementById('venue-price').value),
          capacity: Number(document.getElementById('venue-capacity').value),
          description: document.getElementById('venue-description').value.trim(),
          imageUrl: document.getElementById('venue-image').value.trim() || undefined,
        };

        submitBtn.disabled = true;
        submitBtn.textContent = 'جارٍ إضافة الملعب...';
        showAlert('جارٍ إرسال بيانات الملعب...');

        try {
          const result = await createVenue(payload);

          renderLatestVenue(result);
          form.reset();
          document.getElementById('venue-area').innerHTML =
            '<option value="">اختر المدينة أولًا</option>';

          showAlert('تمت إضافة الملعب بنجاح.');
        } catch (error) {
          showAlert(error.message || 'فشل إضافة الملعب.', true);
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'إضافة الملعب';
        }
      });

      resetBtn.addEventListener('click', function () {
        form.reset();
        document.getElementById('venue-area').innerHTML =
          '<option value="">اختر المدينة أولًا</option>';
        showAlert('تم مسح الحقول.');
      });
    });
  </script>
</body>
</html>
