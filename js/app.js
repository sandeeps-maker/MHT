// ========================================================
// MHT — Malaysia & Global Hotel & Tours | App Controller
// Leonardo Hotels Inspired Dynamic Engine & PWA System
// ========================================================

// Global early capture for PWA Install Prompt
let globalDeferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  globalDeferredInstallPrompt = e;
  if (window.MHTApp) {
    window.MHTApp.deferredInstallPrompt = e;
  }
  const banner = document.getElementById('pwa-top-banner');
  if (banner) {
    const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
    if (!isStandalone) banner.classList.remove('hidden');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  MHTApp.init();
});

const MHTApp = {
  currentView: 'home',
  activeHotelFilter: 'all',
  activeTourFilter: 'all',
  selectedHotelForBooking: null,
  selectedTourForBooking: null,
  deferredInstallPrompt: null,

  init() {
    if (globalDeferredInstallPrompt) {
      this.deferredInstallPrompt = globalDeferredInstallPrompt;
    }
    this.registerServiceWorker();
    this.initPWAInstallPrompt();
    this.preloadDestinationImages();
    this.initRouting();
    this.initAuth();
    this.renderAllContent();
    this.initSearchAndFilters();
    this.initBookingForms();
    this.initAdminForms();
    this.initMobileNav();
    this.updateAuthUI();
  },

  preloadDestinationImages() {
    try {
      const themes = window.MHTStoreInstance?.getDestinationThemes() || MHT_DEFAULT_DATA.destinationThemes || {};
      Object.values(themes).forEach(t => {
        if (t.image) {
          const img = new Image();
          img.src = t.image;
        }
      });
    } catch (e) {
      console.warn('Preload error', e);
    }
  },

  // ----------------------------------------------------
  // 1. PWA REGISTRATION & INSTALLATION PROMPT
  // ----------------------------------------------------
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      // Register service worker immediately
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('MHT PWA Service Worker Registered', reg);
          // Check for service worker updates
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New MHT PWA version available');
                }
              };
            }
          };
        })
        .catch((err) => console.warn('SW Registration Note:', err));
    }
  },

  initPWAInstallPrompt() {
    const banner = document.getElementById('pwa-top-banner');
    const installBtn = document.getElementById('pwa-install-btn');
    const dismissBtn = document.getElementById('pwa-dismiss-btn');

    // Check if already running in standalone PWA mode (iOS or Android)
    const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone && banner) {
      banner.classList.add('hidden');
      return;
    }

    if (this.deferredInstallPrompt && banner) {
      banner.classList.remove('hidden');
    }

    if (installBtn) {
      installBtn.addEventListener('click', () => {
        this.triggerInstallApp();
      });
    }

    if (dismissBtn && banner) {
      dismissBtn.addEventListener('click', () => {
        banner.classList.add('hidden');
      });
    }
  },

  triggerInstallApp() {
    const promptEvent = this.deferredInstallPrompt || globalDeferredInstallPrompt;
    const banner = document.getElementById('pwa-top-banner');

    // 1. Android & Desktop Chrome 1-Click Native Prompt
    if (promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice.then(({ outcome }) => {
        if (outcome === 'accepted') {
          this.showToast('Thank you for installing MHT Stays App!', 'success');
          if (banner) banner.classList.add('hidden');
        }
        this.deferredInstallPrompt = null;
        globalDeferredInstallPrompt = null;
      });
      return;
    }

    // 2. iOS / Safari or other mobile browsers - Open Interactive Mobile Walkthrough Sheet
    this.openIOSInstallModal();
  },

  openIOSInstallModal() {
    const modal = document.getElementById('ios-install-modal');
    if (modal) {
      modal.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    }
  },

  async shareOrTriggerInstall() {
    const promptEvent = this.deferredInstallPrompt || globalDeferredInstallPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice.then(({ outcome }) => {
        if (outcome === 'accepted') {
          this.showToast('Thank you for installing MHT Stays App!', 'success');
          document.getElementById('ios-install-modal')?.classList.add('hidden');
        }
        this.deferredInstallPrompt = null;
        globalDeferredInstallPrompt = null;
      });
      return;
    }

    // If Web Share API is available (iOS Safari & Modern Mobile), trigger native iOS share sheet directly with 1 tap
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MHT — My Holiday Trip',
          text: 'Save 10% on Singapore, Malaysia & Global Hotels & Tours with MHT Stays.',
          url: window.location.href
        });
        this.showToast('Scroll down on the menu and select "Add to Home Screen"', 'info');
      } catch (err) {
        if (err.name !== 'AbortError') {
          this.showToast('Tap the Safari Share button at the bottom of your screen.', 'info');
        }
      }
    } else {
      this.showToast('Tap Safari Share button at the bottom and choose "Add to Home Screen".', 'info');
    }
  },

  // ----------------------------------------------------
  // 2. ROUTING & VIEW NAVIGATION
  // ----------------------------------------------------
  initRouting() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-navigate]');
      if (target) {
        e.preventDefault();
        const view = target.getAttribute('data-navigate');
        this.navigateTo(view);
      }
    });

    const hash = window.location.hash.replace('#', '');
    if (hash && (document.getElementById(`view-${hash}`) || hash === 'my-bookings' || hash === 'account')) {
      this.navigateTo(hash, false);
    } else {
      this.navigateTo('home', false);
    }

    window.addEventListener('popstate', () => {
      const currentHash = window.location.hash.replace('#', '') || 'home';
      this.navigateTo(currentHash, false);
    });
  },

  navigateTo(viewId, pushState = true) {
    if (viewId === 'my-bookings') viewId = 'account';

    // Protected Admin Access via URL hash with Dummy OTP
    if (viewId === 'admin' && !this.isAdminAuthenticated) {
      const pin = prompt("🔐 MHT Staff & Admin Portal\nPlease enter Admin Verification Code (Dummy OTP: 1234):", "1234");
      if (pin === '1234' || pin === '9999' || pin === 'admin') {
        this.isAdminAuthenticated = true;
        this.showToast('Admin access unlocked.', 'success');
      } else {
        this.showToast('Admin verification required. Access restricted.', 'error');
        this.navigateTo('home', pushState);
        return;
      }
    }

    const validViews = ['home', 'hotels', 'tours', 'malaysia', 'custom-tour', 'account', 'admin', 'hotel-detail', 'tour-detail'];
    if (!validViews.includes(viewId)) viewId = 'home';

    this.currentView = viewId;

    // Switch active view section
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const target = document.getElementById(`view-${viewId}`);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update Desktop Nav links
    document.querySelectorAll('nav [data-navigate]').forEach(link => {
      const navTarget = link.getAttribute('data-navigate');
      if (navTarget === viewId || (viewId === 'account' && navTarget === 'my-bookings')) {
        link.classList.add('text-amber-600', 'font-extrabold');
        link.classList.remove('text-slate-700');
      } else {
        link.classList.remove('text-amber-600', 'font-extrabold');
        link.classList.add('text-slate-700');
      }
    });

    // Update Mobile Drawer links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      const navTarget = link.getAttribute('data-navigate') || link.getAttribute('data-view-id');
      if (navTarget === viewId || (viewId === 'account' && (navTarget === 'my-bookings' || navTarget === 'account'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update Mobile Bottom Tab Bar
    document.querySelectorAll('.mobile-tab-item').forEach(item => {
      const navTarget = item.getAttribute('data-navigate');
      if (navTarget === viewId || (viewId === 'account' && (navTarget === 'my-bookings' || navTarget === 'account'))) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    const centerBtn = document.querySelector('.mobile-tab-center-btn');
    if (centerBtn) {
      if (viewId === 'malaysia') {
        centerBtn.classList.add('active');
      } else {
        centerBtn.classList.remove('active');
      }
    }

    // Close Mobile Drawer with fade out
    this.closeMobileNav();

    if (pushState) {
      history.pushState(null, '', `#${viewId}`);
    }

    if (viewId === 'admin') {
      this.renderAdminLists();
    } else if (viewId === 'account' || viewId === 'my-bookings') {
      this.renderAccountDashboard();
    } else if (viewId === 'malaysia') {
      this.activeHotelFilter = 'malaysia';
      this.renderHotelsPage();
      this.activeTourFilter = 'malaysia';
      this.renderToursPage();
    }

    if (window.lucide) lucide.createIcons();
  },

  // ----------------------------------------------------
  // 3. RENDER ALL CONTENT
  // ----------------------------------------------------
  renderAllContent() {
    this.renderHomeMalaysiaHighlights();
    this.renderHomeFeaturedHotels();
    this.renderHomeFeaturedTours();
    this.renderHotelsPage();
    this.renderToursPage();
  },

  // Malaysia Spotlight in Hero/Home
  renderHomeMalaysiaHighlights() {
    const container = document.getElementById('home-malaysia-grid');
    if (!container) return;

    const malaysiaHotels = window.MHTStoreInstance.getHotels().filter(h => h.destinationCategory === 'malaysia');
    container.innerHTML = malaysiaHotels.slice(0, 4).map(h => this.generateHotelCardHTML(h)).join('');
    if (window.lucide) lucide.createIcons();
  },

  // Featured Hotels
  renderHomeFeaturedHotels() {
    const container = document.getElementById('home-featured-hotels');
    if (!container) return;

    const hotels = window.MHTStoreInstance.getHotels().slice(0, 3);
    container.innerHTML = hotels.map(h => this.generateHotelCardHTML(h)).join('');
    if (window.lucide) lucide.createIcons();
  },

  // Featured Tour Packages
  renderHomeFeaturedTours() {
    const container = document.getElementById('home-featured-tours');
    if (!container) return;

    const tours = window.MHTStoreInstance.getTourPackages().slice(0, 3);
    container.innerHTML = tours.map(t => this.generateTourCardHTML(t)).join('');
    if (window.lucide) lucide.createIcons();
  },

  // Full Hotels Catalog
  renderHotelsPage() {
    const container = document.getElementById('hotels-catalog-grid');
    if (!container) return;

    let hotels = window.MHTStoreInstance.getHotels();
    if (this.activeHotelFilter !== 'all') {
      hotels = hotels.filter(h => h.destinationCategory === this.activeHotelFilter || h.city.toLowerCase().includes(this.activeHotelFilter));
    }

    if (hotels.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-16 bg-white rounded-2xl p-8 border border-slate-200">
          <i data-lucide="hotel" class="w-12 h-12 text-slate-400 mx-auto mb-3"></i>
          <h3 class="text-lg font-bold text-slate-800">No partner hotels found</h3>
          <p class="text-xs text-slate-500 mt-1">Try selecting another destination or add hotels in the Admin Portal.</p>
        </div>
      `;
    } else {
      container.innerHTML = hotels.map(h => this.generateHotelCardHTML(h)).join('');
    }
    if (window.lucide) lucide.createIcons();
  },

  // Full Tour Packages Catalog
  renderToursPage() {
    const container = document.getElementById('tours-catalog-grid');
    if (!container) return;

    let tours = window.MHTStoreInstance.getTourPackages();
    if (this.activeTourFilter !== 'all') {
      tours = tours.filter(t => t.category === this.activeTourFilter);
    }

    if (tours.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-16 bg-white rounded-2xl p-8 border border-slate-200">
          <i data-lucide="compass" class="w-12 h-12 text-slate-400 mx-auto mb-3"></i>
          <h3 class="text-lg font-bold text-slate-800">No tour packages found</h3>
          <p class="text-xs text-slate-500 mt-1">Select another destination or request a custom itinerary.</p>
        </div>
      `;
    } else {
      container.innerHTML = tours.map(t => this.generateTourCardHTML(t)).join('');
    }
    if (window.lucide) lucide.createIcons();
  },

  // Leonardo-Style Hotel Card Generator
  generateHotelCardHTML(hotel) {
    const discount = hotel.clientDiscountPercent || 10;
    const rack = hotel.rackRate || 6000;
    const discounted = hotel.discountedRate || Math.round(rack * (1 - discount / 100));
    const savings = rack - discounted;

    return `
      <div class="leonardo-card group cursor-pointer" onclick="MHTApp.openHotelDetails('${hotel.id}')">
        <div>
          <!-- Image -->
          <div class="relative h-64 overflow-hidden bg-slate-900">
            <img src="${hotel.image}" alt="${hotel.name}" class="w-full h-full object-cover card-img" loading="lazy" />
            
            <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <span class="mht-advantage-badge">
                <i data-lucide="shield-check" class="w-3 h-3 text-amber-400"></i> MHT Advantage 10% OFF
              </span>
              ${hotel.badge ? `<span class="bg-white/95 text-slate-900 font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm">${hotel.badge}</span>` : ''}
            </div>

            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
              <span class="bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded font-medium flex items-center gap-1">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-amber-400"></i> ${hotel.city}, ${hotel.country || 'Malaysia'}
              </span>
              <span class="bg-white text-slate-900 font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                <i data-lucide="star" class="w-3 h-3 fill-amber-500 text-amber-500"></i> ${hotel.rating || 4.8}
              </span>
            </div>
          </div>

          <!-- Hotel Details -->
          <div class="p-5">
            <h3 class="font-bold text-lg text-slate-900 group-hover:text-amber-600 transition leading-snug">${hotel.name}</h3>
            <p class="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">${hotel.description}</p>

            <div class="mt-4 flex flex-wrap gap-1.5">
              ${hotel.amenities.slice(0, 3).map(a => `
                <span class="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium flex items-center gap-1">
                  <i data-lucide="check" class="w-2.5 h-2.5 text-emerald-600"></i> ${a}
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Pricing Row (Leonardo Style) -->
        <div class="p-5 pt-3 border-t border-slate-100 bg-slate-50/70 flex items-end justify-between" onclick="event.stopPropagation()">
          <div>
            <div class="flex items-center gap-1.5">
              <span class="rack-price">₹${rack.toLocaleString('en-IN')}</span>
              <span class="discount-pill">Save ₹${savings.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex items-baseline gap-1 mt-0.5">
              <span class="member-price">₹${discounted.toLocaleString('en-IN')}</span>
              <span class="text-xs text-slate-500 font-medium">/ night</span>
            </div>
          </div>

          <div class="flex gap-2">
            <button type="button" onclick="MHTApp.openHotelDetails('${hotel.id}')" class="btn-outline text-xs px-3 py-2">
              View Photos &amp; Rooms
            </button>
            <button type="button" onclick="MHTApp.openHotelDetails('${hotel.id}')" class="btn-primary text-xs px-4 py-2">
              Book With 10% OFF
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // Tour Package Card Generator
  generateTourCardHTML(tour) {
    return `
      <div class="leonardo-card group cursor-pointer" onclick="MHTApp.openTourDetails('${tour.id}')">
        <div>
          <div class="relative h-64 overflow-hidden bg-slate-900">
            <img src="${tour.image}" alt="${tour.title}" class="w-full h-full object-cover card-img" loading="lazy" />
            
            <div class="absolute top-3 left-3">
              <span class="mht-advantage-badge">
                <i data-lucide="percent" class="w-3 h-3 text-amber-400"></i> 10% Client Privilege
              </span>
            </div>

            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
              <span class="bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded font-medium flex items-center gap-1">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-amber-400"></i> ${tour.duration}
              </span>
              <span class="bg-white text-slate-900 font-bold px-2 py-0.5 rounded shadow">
                ${tour.badge}
              </span>
            </div>
          </div>

          <div class="p-5">
            <h3 class="font-bold text-lg text-slate-900 group-hover:text-amber-600 transition leading-snug">${tour.title}</h3>
            <p class="text-xs text-amber-600 font-semibold mt-1 flex items-center gap-1">
              <i data-lucide="map-pin" class="w-3 h-3 text-amber-500"></i> ${tour.destination}
            </p>
            <p class="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">${tour.description}</p>

            <div class="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              ${tour.inclusions.slice(0, 3).map(inc => `
                <div class="flex items-center gap-1.5 truncate">
                  <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-600 shrink-0"></i>
                  <span>${inc}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="p-5 pt-3 border-t border-slate-100 bg-slate-50/70 flex items-end justify-between" onclick="event.stopPropagation()">
          <div>
            <div class="flex items-center gap-1.5">
              <span class="rack-price">₹${tour.standardPrice.toLocaleString('en-IN')}</span>
              <span class="discount-pill">Save ₹${(tour.standardPrice - tour.clientPrice).toLocaleString('en-IN')}</span>
            </div>
            <div class="flex items-baseline gap-1 mt-0.5">
              <span class="member-price">₹${tour.clientPrice.toLocaleString('en-IN')}</span>
              <span class="text-xs text-slate-500 font-medium">/ person</span>
            </div>
          </div>

          <div class="flex gap-2">
            <button type="button" onclick="MHTApp.openTourDetails('${tour.id}')" class="btn-outline text-xs px-3 py-2">
              View Itinerary
            </button>
            <button type="button" onclick="MHTApp.openTourDetails('${tour.id}')" class="btn-primary text-xs px-4 py-2">
              Book Package
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // ----------------------------------------------------
  // 4. SEARCH & FILTERING & DYNAMIC DESTINATION THEMES
  // ----------------------------------------------------
  initSearchAndFilters() {
    // 1. Dynamic Destination Dropdown & Hero Background Switcher
    const searchDest = document.getElementById('search-destination');
    if (searchDest) {
      searchDest.addEventListener('change', (e) => {
        this.setHeroDestination(e.target.value);
      });
    }

    // 2. Quick Country / Destination Pills & Slidable Controls
    const slider = document.getElementById('hero-destination-slider');
    const prevBtn = document.getElementById('hero-slider-prev');
    const nextBtn = document.getElementById('hero-slider-next');

    if (slider) {
      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          slider.scrollBy({ left: -260, behavior: 'smooth' });
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          slider.scrollBy({ left: 260, behavior: 'smooth' });
        });
      }

      // Drag to scroll on desktop
      let isDown = false;
      let startX;
      let scrollLeft;

      slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('cursor-grabbing');
        slider.classList.remove('cursor-grab');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      });

      slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('cursor-grabbing');
        slider.classList.add('cursor-grab');
      });

      slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('cursor-grabbing');
        slider.classList.add('cursor-grab');
      });

      slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
      });

      // Mouse wheel horizontal scrolling
      slider.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          slider.scrollLeft += e.deltaY;
        }
      }, { passive: false });
    }

    document.addEventListener('click', (e) => {
      const pill = e.target.closest('.hero-country-pill');
      if (pill) {
        const key = pill.getAttribute('data-destination-key');
        if (key) {
          this.setHeroDestination(key);
        }
      }
    });

    // 3. Hotel catalog filter pills
    document.querySelectorAll('.hotel-filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        this.activeHotelFilter = filter;
        document.querySelectorAll('.hotel-filter-pill').forEach(b => {
          b.classList.remove('bg-slate-900', 'text-white');
          b.classList.add('bg-white', 'text-slate-700');
        });
        btn.classList.add('bg-slate-900', 'text-white');
        btn.classList.remove('bg-white', 'text-slate-700');
        this.renderHotelsPage();
      });
    });

    // 4. Tour catalog filter pills
    document.querySelectorAll('.tour-filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        this.activeTourFilter = filter;
        document.querySelectorAll('.tour-filter-pill').forEach(b => {
          b.classList.remove('bg-slate-900', 'text-white');
          b.classList.add('bg-white', 'text-slate-700');
        });
        btn.classList.add('bg-slate-900', 'text-white');
        btn.classList.remove('bg-white', 'text-slate-700');
        this.renderToursPage();
      });
    });

    // 5. Setup Check-in / Check-out Date Constraints & Listeners
    const checkinInput = document.getElementById('search-checkin');
    const checkoutInput = document.getElementById('search-checkout');
    const checkinWrapper = document.getElementById('checkin-field-wrapper');
    const checkoutWrapper = document.getElementById('checkout-field-wrapper');

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    const dayAfterStr = dayAfter.toISOString().split('T')[0];

    if (checkinInput) {
      checkinInput.min = todayStr;
      if (!checkinInput.value) checkinInput.value = tomorrowStr;
    }

    if (checkoutInput) {
      checkoutInput.min = tomorrowStr;
      if (!checkoutInput.value) checkoutInput.value = dayAfterStr;
    }

    if (checkinInput && checkoutInput) {
      checkinInput.addEventListener('change', () => {
        if (checkinWrapper) checkinWrapper.classList.remove('ring-2', 'ring-rose-500', 'bg-rose-50/50');
        if (checkinInput.value) {
          const nextDay = new Date(checkinInput.value);
          nextDay.setDate(nextDay.getDate() + 1);
          const nextDayStr = nextDay.toISOString().split('T')[0];
          checkoutInput.min = nextDayStr;

          if (!checkoutInput.value || new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
            checkoutInput.value = nextDayStr;
          }
        }
      });

      checkoutInput.addEventListener('change', () => {
        if (checkoutWrapper) checkoutWrapper.classList.remove('ring-2', 'ring-rose-500', 'bg-rose-50/50');
        if (checkinInput.value && checkoutInput.value) {
          if (new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
            if (checkoutWrapper) checkoutWrapper.classList.add('ring-2', 'ring-rose-500', 'bg-rose-50/50');
            this.showToast('Check-out date must be after Check-in date', 'info');
          }
        }
      });
    }

    // 6. Hero Floating Search Button with Required Date Enforcement
    const searchBtn = document.getElementById('leonardo-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Clear previous error rings
        if (checkinWrapper) checkinWrapper.classList.remove('ring-2', 'ring-rose-500', 'bg-rose-50/50');
        if (checkoutWrapper) checkoutWrapper.classList.remove('ring-2', 'ring-rose-500', 'bg-rose-50/50');

        const checkinVal = checkinInput ? checkinInput.value : '';
        const checkoutVal = checkoutInput ? checkoutInput.value : '';

        // Validate Check-in Date
        if (!checkinVal) {
          if (checkinWrapper) checkinWrapper.classList.add('ring-2', 'ring-rose-500', 'bg-rose-50/50');
          if (checkinInput) checkinInput.focus();
          this.showToast('Please define your Check-in date before searching hotels.', 'info');
          return;
        }

        // Validate Check-out Date
        if (!checkoutVal) {
          if (checkoutWrapper) checkoutWrapper.classList.add('ring-2', 'ring-rose-500', 'bg-rose-50/50');
          if (checkoutInput) checkoutInput.focus();
          this.showToast('Please define your Check-out date before searching hotels.', 'info');
          return;
        }

        // Validate Date Range
        const checkinDate = new Date(checkinVal);
        const checkoutDate = new Date(checkoutVal);

        if (checkoutDate <= checkinDate) {
          if (checkoutWrapper) checkoutWrapper.classList.add('ring-2', 'ring-rose-500', 'bg-rose-50/50');
          if (checkoutInput) checkoutInput.focus();
          this.showToast('Check-out date must be at least 1 day after Check-in.', 'info');
          return;
        }

        const nights = Math.max(1, Math.round((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24)));
        const destKey = document.getElementById('search-destination')?.value || 'malaysia';
        const guests = document.getElementById('search-guests')?.value || '2 Adults, 1 Room';

        // Resolve destination filter
        const themes = window.MHTStoreInstance?.data?.destinationThemes || {};
        const selectedTheme = themes[destKey] || themes['malaysia'];
        const activeFilter = selectedTheme?.filterKey || destKey;

        // Save active search criteria for hotel booking prefill
        this.searchCriteria = {
          destination: destKey,
          filterKey: activeFilter,
          checkin: checkinVal,
          checkout: checkoutVal,
          nights: nights,
          guests: guests
        };

        this.activeHotelFilter = activeFilter;
        this.navigateTo('hotels');
        this.renderHotelsPage();

        this.showToast(`Showing hotels for ${nights} night(s) stay (${checkinVal} to ${checkoutVal}) with 10% Advantage Discount!`, 'success');
      });
    }
  },

  // Dynamic Leonardo Hotels Destination Background & Headline Crossfader
  currentHeroDestKey: 'malaysia',
  heroTransitionTimeout: null,
  heroTextTimeout: null,

  setHeroDestination(key) {
    if (!key) return;
    const themes = window.MHTStoreInstance?.getDestinationThemes() || MHT_DEFAULT_DATA.destinationThemes || {};
    const theme = themes[key] || themes['malaysia'];
    if (!theme || !theme.image) return;

    if (this.currentHeroDestKey === key && document.getElementById('hero-bg-img')?.src === theme.image) {
      const searchSelect = document.getElementById('search-destination');
      if (searchSelect && searchSelect.value !== key) searchSelect.value = key;
      return;
    }
    this.currentHeroDestKey = key;

    // 1. Silky Smooth Crossfade Hero Background Image with Preloading
    const bgCurrent = document.getElementById('hero-bg-img');
    const bgNext = document.getElementById('hero-bg-img-next');

    if (bgCurrent && bgNext) {
      if (this.heroTransitionTimeout) clearTimeout(this.heroTransitionTimeout);

      const performCrossfade = () => {
        bgNext.src = theme.image;
        bgNext.style.transition = 'opacity 0.85s cubic-bezier(0.4, 0, 0.2, 1), transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)';
        bgNext.style.transform = 'scale(1.00)';
        bgNext.style.opacity = '1';

        this.heroTransitionTimeout = setTimeout(() => {
          bgCurrent.src = theme.image;
          bgCurrent.style.opacity = '1';
          bgNext.style.transition = 'none';
          bgNext.style.opacity = '0';
          bgNext.style.transform = 'scale(1.04)';
          void bgNext.offsetWidth; // Force layout reflow
        }, 900);
      };

      const preloader = new Image();
      preloader.onload = performCrossfade;
      preloader.onerror = performCrossfade;
      preloader.src = theme.image;
      if (preloader.complete) {
        performCrossfade();
      }
    }

    // 2. Silky Smooth Destination Typography Fade-Out & Fade-In
    const heroTitle = document.getElementById('hero-title');
    const heroPrice = document.getElementById('hero-price');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const animEls = [heroTitle, heroPrice, heroSubtitle].filter(Boolean);

    if (this.heroTextTimeout) clearTimeout(this.heroTextTimeout);

    animEls.forEach(el => {
      el.classList.remove('text-enter-prep');
      el.classList.add('text-fade-out');
    });

    this.heroTextTimeout = setTimeout(() => {
      if (heroTitle) heroTitle.textContent = theme.title;
      if (heroPrice) heroPrice.textContent = theme.price;
      if (heroSubtitle) heroSubtitle.textContent = theme.subtitle;

      animEls.forEach(el => {
        el.classList.remove('text-fade-out');
        el.classList.add('text-enter-prep');
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          animEls.forEach(el => {
            el.classList.remove('text-enter-prep');
          });
        });
      });
    }, 280);

    // 3. Sync Dropdown Value & Active Pill
    const searchSelect = document.getElementById('search-destination');
    if (searchSelect && searchSelect.value !== key) {
      searchSelect.value = key;
    }

    document.querySelectorAll('.hero-country-pill').forEach(pill => {
      const pillKey = pill.getAttribute('data-destination-key');
      if (pillKey === key) {
        pill.classList.add('active');
        pill.classList.remove('bg-gradient-to-br', 'from-[#162F52]', 'to-[#0C1E36]');
        try {
          pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } catch (e) {}
      } else {
        pill.classList.remove('active');
      }
    });
  },

  // ----------------------------------------------------
  // 5. BOOKING ENGINE & VOUCHERS
  // ----------------------------------------------------
  initBookingForms() {
    const hotelModal = document.getElementById('hotel-booking-modal');
    const nightsInput = document.getElementById('modal-book-nights');
    const roomsInput = document.getElementById('modal-book-rooms');
    const roomTypeSelect = document.getElementById('modal-room-type-select');
    const modalCheckin = document.getElementById('modal-book-checkin');
    const modalCheckout = document.getElementById('modal-book-checkout');

    const recalculateHotelPrice = () => {
      if (!this.selectedHotelForBooking) return;
      const nights = parseInt(nightsInput ? nightsInput.value : 1) || 1;
      const rooms = parseInt(roomsInput ? roomsInput.value : 1) || 1;
      
      let baseRack = this.selectedHotelForBooking.rackRate;
      let clientPrice = this.selectedHotelForBooking.discountedRate;

      if (roomTypeSelect && this.selectedHotelForBooking.roomTypes) {
        const selectedType = this.selectedHotelForBooking.roomTypes.find(rt => rt.name === roomTypeSelect.value);
        if (selectedType) {
          baseRack = selectedType.rack;
          clientPrice = selectedType.clientPrice;
        }
      }

      const totalRack = baseRack * nights * rooms;
      const totalClient = clientPrice * nights * rooms;
      const totalSavings = totalRack - totalClient;

      document.getElementById('modal-summary-rack').textContent = `₹${totalRack.toLocaleString('en-IN')}`;
      document.getElementById('modal-summary-discount').textContent = `- ₹${totalSavings.toLocaleString('en-IN')} (10% OFF)`;
      document.getElementById('modal-summary-payable').textContent = `₹${totalClient.toLocaleString('en-IN')}`;
    };

    if (nightsInput) nightsInput.addEventListener('input', recalculateHotelPrice);
    if (roomsInput) roomsInput.addEventListener('input', recalculateHotelPrice);
    if (roomTypeSelect) roomTypeSelect.addEventListener('change', recalculateHotelPrice);

    if (modalCheckin && modalCheckout) {
      modalCheckin.addEventListener('change', () => {
        if (modalCheckin.value && modalCheckout.value) {
          const ci = new Date(modalCheckin.value);
          const co = new Date(modalCheckout.value);
          if (co > ci) {
            const n = Math.max(1, Math.round((co - ci) / (1000 * 60 * 60 * 24)));
            if (nightsInput) {
              nightsInput.value = n;
              recalculateHotelPrice();
            }
          }
        }
      });

      modalCheckout.addEventListener('change', () => {
        if (modalCheckin.value && modalCheckout.value) {
          const ci = new Date(modalCheckin.value);
          const co = new Date(modalCheckout.value);
          if (co > ci) {
            const n = Math.max(1, Math.round((co - ci) / (1000 * 60 * 60 * 24)));
            if (nightsInput) {
              nightsInput.value = n;
              recalculateHotelPrice();
            }
          }
        }
      });
    }

    // Hotel Form Submit
    const hotelForm = document.getElementById('modal-hotel-booking-form');
    if (hotelForm) {
      hotelForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const guestName = document.getElementById('modal-guest-name').value;
        const guestPhone = document.getElementById('modal-guest-phone').value;
        const checkin = document.getElementById('modal-book-checkin').value;
        const checkout = document.getElementById('modal-book-checkout').value;
        const nights = document.getElementById('modal-book-nights').value;
        const roomType = roomTypeSelect ? roomTypeSelect.value : 'Standard Deluxe';
        const totalPayable = document.getElementById('modal-summary-payable').textContent;

        const booking = window.MHTStoreInstance.saveBooking({
          type: 'Partner Hotel Booking',
          hotelName: this.selectedHotelForBooking.name,
          city: `${this.selectedHotelForBooking.city}, ${this.selectedHotelForBooking.country || 'Malaysia'}`,
          roomType: roomType,
          guestName: guestName,
          guestPhone: guestPhone,
          checkin: checkin,
          checkout: checkout,
          nights: nights,
          totalAmount: totalPayable
        });

        hotelModal.classList.add('hidden');
        this.openVoucherModal(booking);
        this.showToast('Reservation confirmed with 10% MHT Advantage discount!', 'success');
      });
    }

    // Tour Form Submit
    const tourForm = document.getElementById('modal-tour-booking-form');
    if (tourForm) {
      tourForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const guestName = document.getElementById('tour-guest-name').value;
        const guestPhone = document.getElementById('tour-guest-phone').value;
        const travelDate = document.getElementById('tour-travel-date').value;
        const travelers = document.getElementById('tour-travelers-count').value;
        const totalAmount = `₹${(this.selectedTourForBooking.clientPrice * travelers).toLocaleString('en-IN')}`;

        const booking = window.MHTStoreInstance.saveBooking({
          type: 'Curated Tour Package',
          tourTitle: this.selectedTourForBooking.title,
          destination: this.selectedTourForBooking.destination,
          duration: this.selectedTourForBooking.duration,
          guestName: guestName,
          guestPhone: guestPhone,
          travelDate: travelDate,
          travelers: travelers,
          totalAmount: totalAmount
        });

        document.getElementById('tour-booking-modal').classList.add('hidden');
        this.openVoucherModal(booking);
        this.showToast('Tour booking initiated!', 'success');
      });
    }
  },

  startHotelBooking(hotelId) {
    const hotel = window.MHTStoreInstance.getHotels().find(h => h.id === hotelId);
    if (!hotel) return;

    this.selectedHotelForBooking = hotel;
    const modal = document.getElementById('hotel-booking-modal');
    
    document.getElementById('modal-hotel-name').textContent = hotel.name;
    document.getElementById('modal-hotel-location').textContent = `${hotel.city}, ${hotel.country || 'Malaysia'}`;
    document.getElementById('modal-hotel-img').src = hotel.image;

    // Prefill search criteria if user defined on home search bar
    if (this.searchCriteria) {
      const modalCheckin = document.getElementById('modal-book-checkin');
      const modalCheckout = document.getElementById('modal-book-checkout');
      const modalNights = document.getElementById('modal-book-nights');

      if (modalCheckin && this.searchCriteria.checkin) modalCheckin.value = this.searchCriteria.checkin;
      if (modalCheckout && this.searchCriteria.checkout) modalCheckout.value = this.searchCriteria.checkout;
      if (modalNights && this.searchCriteria.nights) modalNights.value = this.searchCriteria.nights;
    }

    const select = document.getElementById('modal-room-type-select');
    if (select && hotel.roomTypes) {
      select.innerHTML = hotel.roomTypes.map(rt => `
        <option value="${rt.name}">${rt.name} — ₹${rt.clientPrice.toLocaleString('en-IN')} (Rack ₹${rt.rack.toLocaleString('en-IN')})</option>
      `).join('');
    }

    modal.classList.remove('hidden');
    const nights = document.getElementById('modal-book-nights');
    if (nights) nights.dispatchEvent(new Event('input'));
  },

  startTourBooking(tourId) {
    const tour = window.MHTStoreInstance.getTourPackages().find(t => t.id === tourId);
    if (!tour) return;

    this.selectedTourForBooking = tour;
    const modal = document.getElementById('tour-booking-modal');
    
    document.getElementById('modal-tour-title').textContent = tour.title;
    document.getElementById('modal-tour-dest').textContent = `${tour.destination} (${tour.duration})`;
    document.getElementById('modal-tour-img').src = tour.image;
    document.getElementById('modal-tour-price').textContent = `₹${tour.clientPrice.toLocaleString('en-IN')} / person (10% Client Privilege)`;

    modal.classList.remove('hidden');
  },

  // ----------------------------------------------------
  // DEDICATED HOTEL DETAILS PAGE (MULTI-PHOTO & CUSTOMIZATION OPTIONS)
  // ----------------------------------------------------
  activeHotelDetailState: null,

  openHotelDetails(hotelId) {
    this.showHotelDetailsPage(hotelId);
  },

  showHotelDetailsPage(hotelId) {
    const hotel = window.MHTStoreInstance.getHotels().find(h => h.id === hotelId) || window.MHTStoreInstance.getHotels()[0];
    if (!hotel) return;

    // Set initial dates from search criteria or default
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const checkin = this.searchCriteria?.checkin || tomorrow.toISOString().split('T')[0];
    const checkout = this.searchCriteria?.checkout || dayAfter.toISOString().split('T')[0];
    const nights = Math.max(1, Math.round((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)));

    const firstRoom = hotel.roomTypes && hotel.roomTypes.length ? hotel.roomTypes[0] : { id: 'rm-default', name: 'Deluxe Room', rack: hotel.rackRate, clientPrice: hotel.discountedRate };
    const defaultMeal = hotel.mealPlans && hotel.mealPlans.find(m => m.default) ? hotel.mealPlans.find(m => m.default) : (hotel.mealPlans ? hotel.mealPlans[0] : null);

    this.activeHotelDetailState = {
      hotel: hotel,
      selectedRoomId: firstRoom.id || firstRoom.name,
      selectedMealId: defaultMeal ? defaultMeal.id : 'room_only',
      selectedAddOns: [],
      checkin: checkin,
      checkout: checkout,
      nights: nights,
      rooms: 1,
      guests: '2 Adults'
    };

    const container = document.getElementById('hotel-detail-container');
    if (!container) return;

    const gallery = hotel.gallery && hotel.gallery.length ? hotel.gallery : [hotel.image];
    const mainImg = gallery[0];

    container.innerHTML = `
      <!-- Breadcrumb & Top Action Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
        <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button onclick="MHTApp.navigateTo('home')" class="hover:text-amber-600 transition">Home</button>
          <span>/</span>
          <button onclick="MHTApp.navigateTo('hotels')" class="hover:text-amber-600 transition">Partner Hotels</button>
          <span>/</span>
          <span class="text-slate-900 font-bold truncate max-w-xs sm:max-w-md">${hotel.name}</span>
        </div>

        <div class="flex items-center gap-3">
          <button onclick="MHTApp.navigateTo('hotels')" class="btn-outline text-xs px-3.5 py-2 flex items-center gap-1.5">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i> Back to Hotels
          </button>
          <button onclick="MHTApp.openDetailWhatsApp()" class="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white">
            <i data-lucide="message-circle" class="w-3.5 h-3.5"></i> WhatsApp Concierge
          </button>
        </div>
      </div>

      <!-- Hotel Title Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span class="mht-advantage-badge text-xs">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-amber-400"></i> MHT Guaranteed 10% Client Privilege
            </span>
            ${hotel.badge ? `<span class="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">${hotel.badge}</span>` : ''}
            <span class="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400"></i> ${hotel.stars || 5}-Star Luxury
            </span>
          </div>

          <h1 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">${hotel.name}</h1>
          
          <p class="text-xs sm:text-sm text-slate-600 mt-1.5 flex items-center gap-1.5">
            <i data-lucide="map-pin" class="w-4 h-4 text-amber-600 shrink-0"></i>
            <span>${hotel.address || `${hotel.city}, ${hotel.country || 'Malaysia'}`}</span>
          </p>
        </div>

        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-right shrink-0">
          <span class="text-[10px] uppercase font-extrabold text-emerald-800 tracking-wider block">Exclusive Client Rate</span>
          <div class="flex items-baseline justify-end gap-1.5">
            <span class="rack-price text-sm">₹${hotel.rackRate.toLocaleString('en-IN')}</span>
            <span class="text-2xl font-black text-slate-900">₹${hotel.discountedRate.toLocaleString('en-IN')}</span>
            <span class="text-xs text-slate-500">/ night</span>
          </div>
          <span class="discount-pill text-[10px] mt-1">Instant 10% Member Savings</span>
        </div>
      </div>

      <!-- LEONARDO 5-PHOTO SHOWCASE GALLERY -->
      <div class="space-y-3 mb-10">
        <div class="gallery-grid-main shadow-lg">
          <div class="gallery-photo-item row-span-2">
            <img id="hotel-detail-main-img" src="${mainImg}" alt="${hotel.name} Featured View" />
            <div class="absolute bottom-3 left-3 bg-slate-950/75 backdrop-blur px-3 py-1 rounded text-white text-xs font-bold flex items-center gap-1.5">
              <i data-lucide="camera" class="w-3.5 h-3.5 text-amber-400"></i> Featured Photo
            </div>
          </div>
          ${gallery.slice(1, 5).map((img, i) => `
            <div class="gallery-photo-item gallery-secondary" onclick="MHTApp.setDetailFeaturedPhoto('${img}')">
              <img src="${img}" alt="Hotel Photo ${i+2}" />
            </div>
          `).join('')}
        </div>

        <!-- Thumbnail Carousel Strip with Click Switcher -->
        <div class="gallery-thumb-track">
          ${gallery.map((img, idx) => `
            <button type="button" class="gallery-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="MHTApp.setDetailFeaturedPhoto('${img}', this)">
              <img src="${img}" alt="Thumbnail ${idx+1}" />
            </button>
          `).join('')}
        </div>
      </div>

      <!-- MAIN CONTENT 2-COLUMN LAYOUT -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- LEFT COLUMN: Room Choices, Meal Plans, Add-ons, Highlights & Policies -->
        <div class="lg:col-span-2 space-y-10">
          
          <!-- Property Overview -->
          <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 class="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="info" class="w-5 h-5 text-amber-600"></i> Property Overview
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${hotel.description}</p>
            
            ${hotel.highlights ? `
              <div class="mt-4 pt-4 border-t border-slate-100">
                <h4 class="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-2">Why Our Clients Love This Property</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  ${hotel.highlights.map(h => `
                    <div class="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg">
                      <i data-lucide="sparkles" class="w-4 h-4 text-amber-500 shrink-0 mt-0.5"></i>
                      <span>${h}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Amenities Badges -->
            <div class="mt-4 pt-4 border-t border-slate-100">
              <h4 class="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-3">Hotel Amenities &amp; Facilities</h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                ${hotel.amenities.map(a => `
                  <div class="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 border border-slate-100 p-2 rounded-lg font-medium">
                    <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-600 shrink-0"></i>
                    <span class="truncate">${a}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- STEP 1: CHOOSE ROOM CATEGORY -->
          <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[10px] uppercase font-extrabold tracking-wider text-amber-600">Step 1</span>
                <h2 class="text-lg sm:text-xl font-extrabold text-slate-900">Choose Your Room Category</h2>
              </div>
              <span class="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-bold">
                10% Discount Applied
              </span>
            </div>

            <div class="space-y-4">
              ${(hotel.roomTypes || []).map((rt, idx) => {
                const isSelected = idx === 0;
                return `
                  <div class="room-selection-card ${isSelected ? 'selected' : ''} p-4 sm:p-5 cursor-pointer" onclick="MHTApp.selectDetailRoom('${rt.id || rt.name}', this)">
                    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div class="flex gap-4 items-center">
                        <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                          <img src="${rt.image || hotel.image}" alt="${rt.name}" class="w-full h-full object-cover" />
                        </div>
                        <div class="space-y-1">
                          <div class="flex items-center gap-2">
                            <span class="room-radio-indicator w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-amber-600 bg-amber-600' : 'border-slate-300'}">
                              ${isSelected ? '<span class="w-1.5 h-1.5 rounded-full bg-white"></span>' : ''}
                            </span>
                            <h3 class="font-bold text-sm sm:text-base text-slate-900">${rt.name}</h3>
                          </div>
                          <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span><i data-lucide="users" class="w-3.5 h-3.5 inline"></i> ${rt.capacity}</span>
                            <span>&bull;</span>
                            <span><i data-lucide="bed" class="w-3.5 h-3.5 inline"></i> ${rt.bed}</span>
                            ${rt.sqft ? `<span>&bull;</span><span><i data-lucide="maximize" class="w-3.5 h-3.5 inline"></i> ${rt.sqft}</span>` : ''}
                          </div>
                          ${rt.features ? `
                            <div class="flex flex-wrap gap-1.5 pt-1">
                              ${rt.features.map(f => `<span class="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">${f}</span>`).join('')}
                            </div>
                          ` : ''}
                        </div>
                      </div>

                      <div class="text-right sm:self-center shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex sm:flex-col items-center sm:items-end justify-between">
                        <div>
                          <span class="rack-price text-xs block">₹${rt.rack.toLocaleString('en-IN')}</span>
                          <span class="text-lg sm:text-xl font-black text-slate-900">₹${rt.clientPrice.toLocaleString('en-IN')}</span>
                          <span class="text-[10px] text-slate-500 font-medium block">/ night</span>
                        </div>
                        <button type="button" class="room-select-btn btn-primary text-xs py-1.5 px-4 rounded-lg mt-2 ${isSelected ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-white'}">
                          ${isSelected ? 'Selected' : 'Select Room'}
                        </button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- STEP 2: CHOOSE MEAL PLAN -->
          <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <span class="text-[10px] uppercase font-extrabold tracking-wider text-amber-600">Step 2</span>
              <h2 class="text-lg sm:text-xl font-extrabold text-slate-900">Choose Meal Plan</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              ${(hotel.mealPlans || [
                { id: "room_only", name: "Room Only (EP)", pricePerNight: 0, tag: "Basic" },
                { id: "breakfast", name: "Gourmet Breakfast Buffet (CP)", pricePerNight: 650, tag: "Popular", default: true },
                { id: "half_board", name: "Half Board (Breakfast + Dinner)", pricePerNight: 1600, tag: "Best Value" }
              ]).map((mp, idx) => {
                const isSelected = mp.default || idx === 1 || (idx === 0 && !hotel.mealPlans);
                return `
                  <div class="option-select-card ${isSelected ? 'selected' : ''}" onclick="MHTApp.selectDetailMeal('${mp.id}', this)">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">${mp.tag || 'Option'}</span>
                      <span class="font-bold text-xs text-slate-900">${mp.pricePerNight === 0 ? 'FREE' : `+₹${mp.pricePerNight}/nt`}</span>
                    </div>
                    <strong class="text-xs text-slate-900 block mt-1">${mp.name}</strong>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- STEP 3: CUSTOMIZE WITH ADD-ONS -->
          <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <span class="text-[10px] uppercase font-extrabold tracking-wider text-amber-600">Step 3</span>
              <h2 class="text-lg sm:text-xl font-extrabold text-slate-900">Optional Client Add-ons &amp; Concierge</h2>
              <p class="text-xs text-slate-500">Select premium airport transfers, late check-outs, or celebration touches.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${(hotel.addOns || [
                { id: "airport_transfer", name: "Private Airport Pickup Transfer", price: 1800, icon: "car" },
                { id: "late_checkout", name: "Guaranteed Late Check-out until 4:00 PM", price: 900, icon: "clock" }
              ]).map(addon => `
                <div class="option-select-card flex items-center justify-between" onclick="MHTApp.toggleDetailAddOn('${addon.id}', this)">
                  <div class="flex items-center gap-2.5">
                    <input type="checkbox" id="chk-${addon.id}" class="rounded text-amber-600 pointer-events-none" />
                    <div>
                      <strong class="text-xs text-slate-900 block">${addon.name}</strong>
                      <span class="text-[10px] text-slate-500">MHT Direct Assistance</span>
                    </div>
                  </div>
                  <span class="font-bold text-xs text-amber-700">+₹${addon.price.toLocaleString('en-IN')}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Hotel Policies & Support -->
          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <h3 class="font-bold text-sm text-slate-900 flex items-center gap-2">
              <i data-lucide="shield-check" class="w-4 h-4 text-amber-600"></i> Booking Guarantee &amp; Check-in Policies
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div><strong>Check-in Time:</strong> ${hotel.policies?.checkin || '14:00 (2:00 PM)'}</div>
              <div><strong>Check-out Time:</strong> ${hotel.policies?.checkout || '12:00 (12:00 PM)'}</div>
              <div><strong>Cancellation Policy:</strong> ${hotel.policies?.cancellation || 'Free cancellation up to 48 hours prior'}</div>
              <div><strong>Children Policy:</strong> ${hotel.policies?.children || 'Children under 6 stay free'}</div>
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN: STICKY BOOKING CALCULATOR SIDEBAR -->
        <div class="lg:col-span-1">
          <div class="sticky-booking-card p-6 space-y-5">
            <div class="border-b border-slate-100 pb-4">
              <span class="text-[10px] uppercase font-extrabold text-amber-600 tracking-wider">MHT Privilege Reservation</span>
              <h3 class="text-lg font-black text-slate-900 mt-0.5">Your Trip Summary</h3>
            </div>

            <!-- Date & Room Selectors -->
            <div class="space-y-3 text-xs">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Check-in Date *</label>
                  <input type="date" id="detail-checkin" value="${checkin}" onchange="MHTApp.updateDetailDates()" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800 text-xs focus:outline-none" />
                </div>
                <div>
                  <label class="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Check-out Date *</label>
                  <input type="date" id="detail-checkout" value="${checkout}" onchange="MHTApp.updateDetailDates()" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800 text-xs focus:outline-none" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Rooms</label>
                  <select id="detail-rooms" onchange="MHTApp.updateDetailGuests()" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800 text-xs focus:outline-none">
                    <option value="1" selected>1 Room</option>
                    <option value="2">2 Rooms</option>
                    <option value="3">3 Rooms</option>
                    <option value="4">4+ Rooms</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Guests</label>
                  <select id="detail-guests" onchange="MHTApp.updateDetailGuests()" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800 text-xs focus:outline-none">
                    <option value="2 Adults" selected>2 Adults</option>
                    <option value="1 Adult">1 Adult</option>
                    <option value="2 Adults + 1 Child">2 Adults + 1 Child</option>
                    <option value="3 Adults">3 Adults</option>
                    <option value="4 Adults">4 Adults</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Price Breakdown Box -->
            <div class="bg-slate-50 rounded-xl p-4 space-y-2.5 text-xs border border-slate-200">
              <div class="flex justify-between text-slate-600">
                <span>Selected Room:</span>
                <strong id="detail-summary-room-name" class="text-slate-900 text-right truncate max-w-[150px]">${firstRoom.name}</strong>
              </div>

              <div class="flex justify-between text-slate-600">
                <span>Duration:</span>
                <strong id="detail-summary-nights">${nights} Night(s) &bull; 1 Room</strong>
              </div>

              <div class="flex justify-between text-slate-600">
                <span>Standard Rack Total:</span>
                <span id="detail-summary-rack" class="rack-price">₹${(firstRoom.rack * nights).toLocaleString('en-IN')}</span>
              </div>

              <div class="flex justify-between text-emerald-700 font-bold bg-emerald-100/70 px-2 py-1 rounded">
                <span>10% MHT Client Privilege:</span>
                <span id="detail-summary-discount">- ₹${Math.round(firstRoom.rack * 0.1 * nights).toLocaleString('en-IN')}</span>
              </div>

              <div id="detail-summary-meal-row" class="flex justify-between text-slate-600">
                <span>Meal Plan:</span>
                <span id="detail-summary-meal-price">Included</span>
              </div>

              <div id="detail-summary-addons-row" class="flex justify-between text-slate-600">
                <span>Add-ons Total:</span>
                <span id="detail-summary-addons-price">₹0</span>
              </div>

              <div class="border-t border-slate-200 pt-2 flex items-baseline justify-between">
                <div>
                  <span class="text-[10px] uppercase font-extrabold text-slate-500 block">Total Payable</span>
                  <span class="text-[10px] text-emerald-700 font-bold">Inclusive of Taxes &amp; 10% OFF</span>
                </div>
                <div class="text-right">
                  <span id="detail-summary-total" class="text-xl font-black text-slate-900">₹${(firstRoom.clientPrice * nights).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <!-- Booking Actions -->
            <div class="space-y-2.5">
              <button type="button" onclick="MHTApp.submitDetailBooking()" class="btn-primary w-full py-3.5 text-xs font-black uppercase tracking-wider justify-center shadow-lg hover:shadow-orange-500/25">
                <i data-lucide="check-circle" class="w-4 h-4"></i> Confirm Reservation (Get Voucher)
              </button>
              
              <button type="button" onclick="MHTApp.openDetailWhatsApp()" class="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition">
                <i data-lucide="message-circle" class="w-4 h-4"></i> Book via WhatsApp Concierge
              </button>
            </div>

            <!-- Trust Badges -->
            <div class="pt-2 text-center text-[11px] text-slate-500 space-y-1">
              <p class="flex items-center justify-center gap-1">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-600"></i> Guaranteed 10% Savings &bull; Instant Confirmation Slip
              </p>
              <p>Call / WhatsApp Concierge Support: <a href="tel:+919893854811" class="font-bold text-amber-600 hover:underline">+91 98938 54811</a></p>
            </div>

          </div>
        </div>

      </div>
    `;

    this.navigateTo('hotel-detail');
    if (window.lucide) lucide.createIcons();
    this.recalculateDetailHotelPrice();
  },

  setDetailFeaturedPhoto(imgUrl, clickedBtn) {
    const mainImg = document.getElementById('hotel-detail-main-img');
    if (mainImg) {
      mainImg.src = imgUrl;
    }
    if (clickedBtn) {
      document.querySelectorAll('.gallery-thumb-btn').forEach(b => b.classList.remove('active'));
      clickedBtn.classList.add('active');
    }
  },

  selectDetailRoom(roomId, cardElem) {
    if (!this.activeHotelDetailState) return;
    this.activeHotelDetailState.selectedRoomId = roomId;

    document.querySelectorAll('.room-selection-card').forEach(card => {
      card.classList.remove('selected');
      const radio = card.querySelector('.room-radio-indicator');
      const btn = card.querySelector('.room-select-btn');
      if (radio) {
        radio.classList.remove('border-amber-600', 'bg-amber-600');
        radio.classList.add('border-slate-300');
        radio.innerHTML = '';
      }
      if (btn) {
        btn.classList.remove('bg-amber-500', 'text-slate-950', 'font-black');
        btn.classList.add('bg-slate-800', 'text-white');
        btn.textContent = 'Select Room';
      }
    });

    if (cardElem) {
      cardElem.classList.add('selected');
      const radio = cardElem.querySelector('.room-radio-indicator');
      const btn = cardElem.querySelector('.room-select-btn');
      if (radio) {
        radio.classList.add('border-amber-600', 'bg-amber-600');
        radio.classList.remove('border-slate-300');
        radio.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-white"></span>';
      }
      if (btn) {
        btn.classList.add('bg-amber-500', 'text-slate-950', 'font-black');
        btn.classList.remove('bg-slate-800', 'text-white');
        btn.textContent = 'Selected';
      }
    }

    this.recalculateDetailHotelPrice();
  },

  selectDetailMeal(mealId, cardElem) {
    if (!this.activeHotelDetailState) return;
    this.activeHotelDetailState.selectedMealId = mealId;

    if (cardElem) {
      const parent = cardElem.parentElement;
      if (parent) {
        parent.querySelectorAll('.option-select-card').forEach(c => c.classList.remove('selected'));
      }
      cardElem.classList.add('selected');
    }

    this.recalculateDetailHotelPrice();
  },

  toggleDetailAddOn(addonId, cardElem) {
    if (!this.activeHotelDetailState) return;
    const list = this.activeHotelDetailState.selectedAddOns;
    const idx = list.indexOf(addonId);
    const chk = document.getElementById(`chk-${addonId}`);

    if (idx > -1) {
      list.splice(idx, 1);
      if (cardElem) cardElem.classList.remove('selected');
      if (chk) chk.checked = false;
    } else {
      list.push(addonId);
      if (cardElem) cardElem.classList.add('selected');
      if (chk) chk.checked = true;
    }

    this.recalculateDetailHotelPrice();
  },

  updateDetailDates() {
    const ciInput = document.getElementById('detail-checkin');
    const coInput = document.getElementById('detail-checkout');
    if (!ciInput || !coInput || !this.activeHotelDetailState) return;

    const ci = new Date(ciInput.value);
    const co = new Date(coInput.value);

    if (co <= ci) {
      const next = new Date(ci);
      next.setDate(next.getDate() + 1);
      coInput.value = next.toISOString().split('T')[0];
    }

    const n = Math.max(1, Math.round((new Date(coInput.value) - new Date(ciInput.value)) / (1000 * 60 * 60 * 24)));
    this.activeHotelDetailState.checkin = ciInput.value;
    this.activeHotelDetailState.checkout = coInput.value;
    this.activeHotelDetailState.nights = n;

    this.recalculateDetailHotelPrice();
  },

  updateDetailGuests() {
    const rSelect = document.getElementById('detail-rooms');
    const gSelect = document.getElementById('detail-guests');
    if (!this.activeHotelDetailState) return;

    this.activeHotelDetailState.rooms = parseInt(rSelect?.value || 1);
    this.activeHotelDetailState.guests = gSelect?.value || '2 Adults';

    this.recalculateDetailHotelPrice();
  },

  recalculateDetailHotelPrice() {
    if (!this.activeHotelDetailState) return;
    const st = this.activeHotelDetailState;
    const hotel = st.hotel;
    const nights = st.nights || 1;
    const rooms = st.rooms || 1;

    // 1. Find Selected Room
    let room = (hotel.roomTypes || []).find(r => (r.id || r.name) === st.selectedRoomId);
    if (!room) room = hotel.roomTypes?.[0] || { name: 'Standard Room', rack: hotel.rackRate, clientPrice: hotel.discountedRate };

    const baseRack = (room.rack || hotel.rackRate) * nights * rooms;
    const baseClient = (room.clientPrice || hotel.discountedRate) * nights * rooms;
    const discountSavings = baseRack - baseClient;

    // 2. Meal Plan
    let mealPrice = 0;
    let mealName = "Room Only";
    const meal = (hotel.mealPlans || []).find(m => m.id === st.selectedMealId);
    if (meal) {
      mealPrice = (meal.pricePerNight || 0) * nights * rooms;
      mealName = meal.name;
    }

    // 3. Add-ons
    let addonsTotal = 0;
    const addonsList = [];
    (hotel.addOns || []).forEach(ao => {
      if (st.selectedAddOns.includes(ao.id)) {
        addonsTotal += (ao.price || 0);
        addonsList.push(ao.name);
      }
    });

    const totalPayable = baseClient + mealPrice + addonsTotal;

    // Update UI elements
    const nameEl = document.getElementById('detail-summary-room-name');
    const nightsEl = document.getElementById('detail-summary-nights');
    const rackEl = document.getElementById('detail-summary-rack');
    const discEl = document.getElementById('detail-summary-discount');
    const mealEl = document.getElementById('detail-summary-meal-price');
    const addEl = document.getElementById('detail-summary-addons-price');
    const totalEl = document.getElementById('detail-summary-total');

    if (nameEl) nameEl.textContent = room.name;
    if (nightsEl) nightsEl.textContent = `${nights} Night(s) • ${rooms} Room(s)`;
    if (rackEl) rackEl.textContent = `₹${baseRack.toLocaleString('en-IN')}`;
    if (discEl) discEl.textContent = `- ₹${discountSavings.toLocaleString('en-IN')}`;
    if (mealEl) mealEl.textContent = mealPrice === 0 ? (meal ? 'Included / Free' : 'Room Only') : `+₹${mealPrice.toLocaleString('en-IN')}`;
    if (addEl) addEl.textContent = addonsTotal === 0 ? '₹0' : `+₹${addonsTotal.toLocaleString('en-IN')}`;
    if (totalEl) totalEl.textContent = `₹${totalPayable.toLocaleString('en-IN')}`;

    st.calculated = {
      roomName: room.name,
      baseRack,
      baseClient,
      discountSavings,
      mealName,
      mealPrice,
      addonsList,
      addonsTotal,
      totalPayable
    };
  },

  submitDetailBooking() {
    if (!this.activeHotelDetailState) return;
    const st = this.activeHotelDetailState;
    const hotel = st.hotel;
    const calc = st.calculated || {};

    const guestName = prompt("Please enter Guest Full Name for Booking Voucher:", "Valued MHT Client") || "Valued MHT Client";
    const guestPhone = prompt("Please enter WhatsApp Contact Number:", "+91 98938 54811") || "+91 98938 54811";

    const booking = window.MHTStoreInstance.saveBooking({
      type: 'Partner Hotel Booking',
      hotelName: hotel.name,
      city: `${hotel.city}, ${hotel.country || 'Malaysia'}`,
      roomType: calc.roomName || 'Deluxe Suite',
      guestName: guestName,
      guestPhone: guestPhone,
      checkin: st.checkin,
      checkout: st.checkout,
      nights: st.nights,
      rooms: st.rooms,
      mealPlan: calc.mealName,
      addOns: calc.addonsList?.join(', ') || 'None',
      totalAmount: `₹${(calc.totalPayable || hotel.discountedRate).toLocaleString('en-IN')}`,
      grossNumeric: calc.totalPayable || hotel.discountedRate,
      hotelCommissionPercent: 15,
      commissionEarned: Math.round((calc.totalPayable || hotel.discountedRate) * 0.15),
      clientSavings: calc.discountSavings || Math.round(hotel.rackRate * 0.1),
      status: 'Confirmed (10% MHT Advantage Rate)'
    });

    this.showToast(`Booking confirmed for ${hotel.name}! Your 10% discounted voucher is ready.`, 'success');
    this.openVoucherModal(booking);
  },

  openDetailWhatsApp() {
    if (!this.activeHotelDetailState) return;
    const st = this.activeHotelDetailState;
    const hotel = st.hotel;
    const calc = st.calculated || {};

    const msg = 
      `*MHT 10% Privilege Partner Hotel Booking*\n\n` +
      `🏨 *Hotel:* ${hotel.name}\n` +
      `📍 *Location:* ${hotel.city}, ${hotel.country || 'Malaysia'}\n` +
      `🛏️ *Room Category:* ${calc.roomName || 'Deluxe Room'}\n` +
      `📅 *Dates:* ${st.checkin} to ${st.checkout} (${st.nights} Nights)\n` +
      `👥 *Occupancy:* ${st.rooms} Room(s) • ${st.guests}\n` +
      `🍽️ *Meal Plan:* ${calc.mealName || 'Included Breakfast'}\n` +
      `✨ *Add-ons:* ${calc.addonsList?.length ? calc.addonsList.join(', ') : 'None'}\n` +
      `💰 *Standard Rack Rate:* ₹${(calc.baseRack || hotel.rackRate).toLocaleString('en-IN')}\n` +
      `🎉 *MHT 10% Client Price:* ₹${(calc.totalPayable || hotel.discountedRate).toLocaleString('en-IN')}\n\n` +
      `Please confirm my reservation with instant voucher.`;

    const waNum = window.MHTStoreInstance?.data?.brand?.whatsapp || '919893854811';
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, '_blank');
  },

  // ----------------------------------------------------
  // DEDICATED TOUR PACKAGE DETAILS PAGE (MULTI-PHOTO & ITINERARY)
  // ----------------------------------------------------
  activeTourDetailState: null,

  openTourDetails(tourId) {
    this.showTourDetailsPage(tourId);
  },

  openTourDetailPage(tourId) {
    this.showTourDetailsPage(tourId);
  },

  showTourDetailsPage(tourId) {
    const tour = window.MHTStoreInstance.getTourPackages().find(t => t.id === tourId) || window.MHTStoreInstance.getTourPackages()[0];
    if (!tour) return;

    const today = new Date();
    const departDate = new Date(today);
    departDate.setDate(departDate.getDate() + 7);
    const departStr = departDate.toISOString().split('T')[0];

    const firstTier = tour.travelTiers && tour.travelTiers.length ? tour.travelTiers[0] : { id: 'default', name: 'Deluxe 4-Star Tour', pricePerPerson: tour.clientPrice, standardPrice: tour.standardPrice };

    this.activeTourDetailState = {
      tour: tour,
      selectedTierId: firstTier.id || firstTier.name,
      selectedAddOns: [],
      travelers: 2,
      children: 0,
      departureDate: departStr
    };

    const container = document.getElementById('tour-detail-container');
    if (!container) return;

    const gallery = tour.gallery && tour.gallery.length ? tour.gallery : [tour.image];
    const mainImg = gallery[0];

    container.innerHTML = `
      <!-- Breadcrumb & Top Action Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
        <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button onclick="MHTApp.navigateTo('home')" class="hover:text-amber-600 transition">Home</button>
          <span>/</span>
          <button onclick="MHTApp.navigateTo('tours')" class="hover:text-amber-600 transition">Tour Packages</button>
          <span>/</span>
          <span class="text-slate-900 font-bold truncate max-w-xs sm:max-w-md">${tour.title}</span>
        </div>

        <div class="flex items-center gap-3">
          <button onclick="MHTApp.navigateTo('tours')" class="btn-outline text-xs px-3.5 py-2 flex items-center gap-1.5">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i> Back to Packages
          </button>
          <button onclick="MHTApp.openTourWhatsApp()" class="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white">
            <i data-lucide="message-circle" class="w-3.5 h-3.5"></i> WhatsApp Concierge
          </button>
        </div>
      </div>

      <!-- Tour Title Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span class="mht-advantage-badge text-xs">
              <i data-lucide="percent" class="w-3.5 h-3.5 text-amber-400"></i> MHT 10% Client Privilege Applied
            </span>
            <span class="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">${tour.duration}</span>
            <span class="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-600"></i> Partner Hotels Included
            </span>
          </div>

          <h1 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">${tour.title}</h1>
          
          <p class="text-xs sm:text-sm text-slate-600 mt-1.5 flex items-center gap-1.5">
            <i data-lucide="map-pin" class="w-4 h-4 text-amber-600 shrink-0"></i>
            <span>${tour.destination}</span>
          </p>
        </div>

        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-right shrink-0">
          <span class="text-[10px] uppercase font-extrabold text-emerald-800 tracking-wider block">Exclusive Client Price</span>
          <div class="flex items-baseline justify-end gap-1.5">
            <span class="rack-price text-sm">₹${tour.standardPrice.toLocaleString('en-IN')}</span>
            <span class="text-2xl font-black text-slate-900">₹${tour.clientPrice.toLocaleString('en-IN')}</span>
            <span class="text-xs text-slate-500">/ person</span>
          </div>
          <span class="discount-pill text-[10px] mt-1">Save ₹${(tour.standardPrice - tour.clientPrice).toLocaleString('en-IN')} per person</span>
        </div>
      </div>

      <!-- 5-PHOTO SHOWCASE GALLERY -->
      <div class="space-y-3 mb-10">
        <div class="gallery-grid-main shadow-lg">
          <div class="gallery-photo-item row-span-2">
            <img id="tour-detail-main-img" src="${mainImg}" alt="${tour.title} Highlights" />
            <div class="absolute bottom-3 left-3 bg-slate-950/75 backdrop-blur px-3 py-1 rounded text-white text-xs font-bold flex items-center gap-1.5">
              <i data-lucide="compass" class="w-3.5 h-3.5 text-amber-400"></i> Tour Experience
            </div>
          </div>
          ${gallery.slice(1, 5).map((img, i) => `
            <div class="gallery-photo-item gallery-secondary" onclick="MHTApp.setTourDetailFeaturedPhoto('${img}')">
              <img src="${img}" alt="Tour Activity ${i+2}" />
            </div>
          `).join('')}
        </div>

        <!-- Thumbnail Carousel Strip -->
        <div class="gallery-thumb-track">
          ${gallery.map((img, idx) => `
            <button type="button" class="gallery-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="MHTApp.setTourDetailFeaturedPhoto('${img}', this)">
              <img src="${img}" alt="Thumbnail ${idx+1}" />
            </button>
          `).join('')}
        </div>
      </div>

      <!-- MAIN CONTENT 2-COLUMN LAYOUT -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- LEFT COLUMN: Itinerary, Inclusions, Options -->
        <div class="lg:col-span-2 space-y-10">
          
          <!-- Package Overview -->
          <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 class="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="file-text" class="w-5 h-5 text-amber-600"></i> Holiday Package Overview
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${tour.description}</p>
          </div>

          <!-- STEP 1: CHOOSE TRAVEL TIER -->
          <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <span class="text-[10px] uppercase font-extrabold tracking-wider text-amber-600">Step 1</span>
              <h2 class="text-lg sm:text-xl font-extrabold text-slate-900">Choose Hotel Stay &amp; Travel Tier</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${(tour.travelTiers || [
                { id: "deluxe_tier", name: "Deluxe 4-Star Partner Hotels", pricePerPerson: tour.clientPrice, standardPrice: tour.standardPrice, default: true }
              ]).map((tier, idx) => {
                const isSelected = tier.default || idx === 0;
                return `
                  <div class="option-select-card ${isSelected ? 'selected' : ''} p-4" onclick="MHTApp.selectTourTier('${tier.id}', this)">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Tier</span>
                      <span class="font-bold text-xs text-slate-900">₹${tier.pricePerPerson.toLocaleString('en-IN')}/pax</span>
                    </div>
                    <strong class="text-xs sm:text-sm text-slate-900 block mt-1">${tier.name}</strong>
                    <span class="text-[11px] text-slate-500 block mt-0.5">Rack: <del>₹${(tier.standardPrice || Math.round(tier.pricePerPerson * 1.11)).toLocaleString('en-IN')}</del> &bull; 10% OFF</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- STEP 2: DAY-BY-DAY INTERACTIVE ITINERARY -->
          <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <span class="text-[10px] uppercase font-extrabold tracking-wider text-amber-600">Day-by-Day Journey</span>
              <h2 class="text-lg sm:text-xl font-extrabold text-slate-900">Detailed Tour Itinerary</h2>
            </div>

            <div class="space-y-6">
              ${(tour.itinerary || []).map((it, idx) => `
                <div class="flex gap-4 items-start p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div class="itinerary-step-circle">
                    ${idx + 1}
                  </div>
                  <div class="space-y-1.5 flex-1">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-amber-600">${it.day}</span>
                      <h4 class="font-bold text-sm sm:text-base text-slate-900 w-full sm:w-auto">${it.title}</h4>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed">${it.desc}</p>
                    ${it.image ? `
                      <div class="mt-2 h-36 sm:h-44 rounded-xl overflow-hidden shadow-sm bg-slate-900">
                        <img src="${it.image}" alt="${it.title}" class="w-full h-full object-cover" />
                      </div>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- STEP 3: INCLUSIONS & EXCLUSIONS -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <!-- Inclusions -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 class="text-sm font-bold text-emerald-800 flex items-center gap-2">
                <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600"></i> What's Included in Package
              </h3>
              <ul class="space-y-2 text-xs text-slate-700">
                ${tour.inclusions.map(inc => `
                  <li class="flex items-start gap-2">
                    <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5"></i>
                    <span>${inc}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Exclusions -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 class="text-sm font-bold text-rose-800 flex items-center gap-2">
                <i data-lucide="x-circle" class="w-4 h-4 text-rose-600"></i> Package Exclusions
              </h3>
              <ul class="space-y-2 text-xs text-slate-600">
                ${(tour.exclusions || [
                  "International / Domestic Airfare",
                  "Personal Shopping & Extra Meals",
                  "Travel Insurance (Available on Request)"
                ]).map(exc => `
                  <li class="flex items-start gap-2">
                    <i data-lucide="x" class="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5"></i>
                    <span>${exc}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

          </div>

          <!-- STEP 4: EXPERIENCE ADD-ONS -->
          ${tour.experienceAddOns ? `
            <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <span class="text-[10px] uppercase font-extrabold tracking-wider text-amber-600">Step 3</span>
                <h2 class="text-lg sm:text-xl font-extrabold text-slate-900">Optional Tour Experiences &amp; Tickets</h2>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${tour.experienceAddOns.map(ao => `
                  <div class="option-select-card flex items-center justify-between" onclick="MHTApp.toggleTourAddOn('${ao.id}', this)">
                    <div class="flex items-center gap-2.5">
                      <input type="checkbox" id="tour-chk-${ao.id}" class="rounded text-amber-600 pointer-events-none" />
                      <div>
                        <strong class="text-xs text-slate-900 block">${ao.name}</strong>
                        <span class="text-[10px] text-slate-500">Fast-track ticketing</span>
                      </div>
                    </div>
                    <span class="font-bold text-xs text-amber-700">+₹${ao.price.toLocaleString('en-IN')}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

        </div>

        <!-- RIGHT COLUMN: STICKY TOUR PRICING SIDEBAR -->
        <div class="lg:col-span-1">
          <div class="sticky-booking-card p-6 space-y-5">
            <div class="border-b border-slate-100 pb-4">
              <span class="text-[10px] uppercase font-extrabold text-amber-600 tracking-wider">Tour Package Booking</span>
              <h3 class="text-lg font-black text-slate-900 mt-0.5">Price &amp; Reservation</h3>
            </div>

            <!-- Date & Travelers -->
            <div class="space-y-3 text-xs">
              <div>
                <label class="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Departure / Travel Date *</label>
                <input type="date" id="tour-detail-date" value="${departStr}" onchange="MHTApp.updateTourPax()" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800 text-xs focus:outline-none" />
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Adults (12+ yrs)</label>
                  <select id="tour-detail-adults" onchange="MHTApp.updateTourPax()" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800 text-xs focus:outline-none">
                    <option value="1">1 Person</option>
                    <option value="2" selected>2 Persons</option>
                    <option value="3">3 Persons</option>
                    <option value="4">4 Persons</option>
                    <option value="6">6+ Persons (Group)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Children (Under 12)</label>
                  <select id="tour-detail-children" onchange="MHTApp.updateTourPax()" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800 text-xs focus:outline-none">
                    <option value="0" selected>0 Children</option>
                    <option value="1">1 Child</option>
                    <option value="2">2 Children</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Price Breakdown Box -->
            <div class="bg-slate-50 rounded-xl p-4 space-y-2.5 text-xs border border-slate-200">
              <div class="flex justify-between text-slate-600">
                <span>Selected Tier:</span>
                <strong id="tour-summary-tier-name" class="text-slate-900 truncate max-w-[150px]">${firstTier.name}</strong>
              </div>

              <div class="flex justify-between text-slate-600">
                <span>Travelers:</span>
                <strong id="tour-summary-pax">2 Adults</strong>
              </div>

              <div class="flex justify-between text-slate-600">
                <span>Standard Tariff Total:</span>
                <span id="tour-summary-rack" class="rack-price">₹${(firstTier.standardPrice * 2).toLocaleString('en-IN')}</span>
              </div>

              <div class="flex justify-between text-emerald-700 font-bold bg-emerald-100/70 px-2 py-1 rounded">
                <span>10% Client Privilege:</span>
                <span id="tour-summary-discount">- ₹${((firstTier.standardPrice - firstTier.pricePerPerson) * 2).toLocaleString('en-IN')}</span>
              </div>

              <div id="tour-summary-addons-row" class="flex justify-between text-slate-600">
                <span>Experience Add-ons:</span>
                <span id="tour-summary-addons-price">₹0</span>
              </div>

              <div class="border-t border-slate-200 pt-2 flex items-baseline justify-between">
                <div>
                  <span class="text-[10px] uppercase font-extrabold text-slate-500 block">Total Package Cost</span>
                  <span class="text-[10px] text-emerald-700 font-bold">10% Privilege Included</span>
                </div>
                <div class="text-right">
                  <span id="tour-summary-total" class="text-xl font-black text-slate-900">₹${(firstTier.pricePerPerson * 2).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <!-- Booking Actions -->
            <div class="space-y-2.5">
              <button type="button" onclick="MHTApp.submitTourDetailBooking()" class="btn-primary w-full py-3.5 text-xs font-black uppercase tracking-wider justify-center shadow-lg">
                <i data-lucide="check-circle" class="w-4 h-4"></i> Confirm Tour Reservation
              </button>
              
              <button type="button" onclick="MHTApp.openTourWhatsApp()" class="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition">
                <i data-lucide="message-circle" class="w-4 h-4"></i> WhatsApp Customizer
              </button>
            </div>

          </div>
        </div>

      </div>
    `;

    this.navigateTo('tour-detail');
    if (window.lucide) lucide.createIcons();
    this.recalculateTourDetailPrice();
  },

  setTourDetailFeaturedPhoto(imgUrl, clickedBtn) {
    const mainImg = document.getElementById('tour-detail-main-img');
    if (mainImg) mainImg.src = imgUrl;
    if (clickedBtn) {
      document.querySelectorAll('.gallery-thumb-btn').forEach(b => b.classList.remove('active'));
      clickedBtn.classList.add('active');
    }
  },

  selectTourTier(tierId, cardElem) {
    if (!this.activeTourDetailState) return;
    this.activeTourDetailState.selectedTierId = tierId;

    if (cardElem) {
      const parent = cardElem.parentElement;
      if (parent) parent.querySelectorAll('.option-select-card').forEach(c => c.classList.remove('selected'));
      cardElem.classList.add('selected');
    }

    this.recalculateTourDetailPrice();
  },

  toggleTourAddOn(addonId, cardElem) {
    if (!this.activeTourDetailState) return;
    const list = this.activeTourDetailState.selectedAddOns;
    const idx = list.indexOf(addonId);
    const chk = document.getElementById(`tour-chk-${addonId}`);

    if (idx > -1) {
      list.splice(idx, 1);
      if (cardElem) cardElem.classList.remove('selected');
      if (chk) chk.checked = false;
    } else {
      list.push(addonId);
      if (cardElem) cardElem.classList.add('selected');
      if (chk) chk.checked = true;
    }

    this.recalculateTourDetailPrice();
  },

  updateTourPax() {
    const adultsEl = document.getElementById('tour-detail-adults');
    const childEl = document.getElementById('tour-detail-children');
    const dateEl = document.getElementById('tour-detail-date');
    if (!this.activeTourDetailState) return;

    this.activeTourDetailState.travelers = parseInt(adultsEl?.value || 2);
    this.activeTourDetailState.children = parseInt(childEl?.value || 0);
    this.activeTourDetailState.departureDate = dateEl?.value || '';

    this.recalculateTourDetailPrice();
  },

  recalculateTourDetailPrice() {
    if (!this.activeTourDetailState) return;
    const st = this.activeTourDetailState;
    const tour = st.tour;
    const pax = (st.travelers || 2);
    const children = (st.children || 0);

    let tier = (tour.travelTiers || []).find(t => (t.id || t.name) === st.selectedTierId);
    if (!tier) tier = tour.travelTiers?.[0] || { name: 'Deluxe Tour', pricePerPerson: tour.clientPrice, standardPrice: tour.standardPrice };

    const standardTotal = (tier.standardPrice || tour.standardPrice) * pax + Math.round((tier.standardPrice || tour.standardPrice) * 0.6 * children);
    const clientBase = (tier.pricePerPerson || tour.clientPrice) * pax + Math.round((tier.pricePerPerson || tour.clientPrice) * 0.6 * children);
    const discountSavings = standardTotal - clientBase;

    let addonsTotal = 0;
    const addonsList = [];
    (tour.experienceAddOns || []).forEach(ao => {
      if (st.selectedAddOns.includes(ao.id)) {
        addonsTotal += (ao.price || 0) * pax;
        addonsList.push(ao.name);
      }
    });

    const totalPayable = clientBase + addonsTotal;

    const tierEl = document.getElementById('tour-summary-tier-name');
    const paxEl = document.getElementById('tour-summary-pax');
    const rackEl = document.getElementById('tour-summary-rack');
    const discEl = document.getElementById('tour-summary-discount');
    const addEl = document.getElementById('tour-summary-addons-price');
    const totalEl = document.getElementById('tour-summary-total');

    if (tierEl) tierEl.textContent = tier.name;
    if (paxEl) paxEl.textContent = `${pax} Adult(s)${children > 0 ? `, ${children} Child` : ''}`;
    if (rackEl) rackEl.textContent = `₹${standardTotal.toLocaleString('en-IN')}`;
    if (discEl) discEl.textContent = `- ₹${discountSavings.toLocaleString('en-IN')}`;
    if (addEl) addEl.textContent = addonsTotal === 0 ? '₹0' : `+₹${addonsTotal.toLocaleString('en-IN')}`;
    if (totalEl) totalEl.textContent = `₹${totalPayable.toLocaleString('en-IN')}`;

    st.calculated = {
      tierName: tier.name,
      standardTotal,
      clientBase,
      discountSavings,
      addonsList,
      addonsTotal,
      totalPayable
    };
  },

  submitTourDetailBooking() {
    if (!this.activeTourDetailState) return;
    const st = this.activeTourDetailState;
    const tour = st.tour;
    const calc = st.calculated || {};

    const guestName = prompt("Please enter Lead Passenger Full Name:", "Valued MHT Client") || "Valued MHT Client";
    const guestPhone = prompt("Please enter WhatsApp Contact Number:", "+91 98938 54811") || "+91 98938 54811";

    const booking = window.MHTStoreInstance.saveBooking({
      type: 'Tour Package Booking',
      hotelName: tour.title,
      city: tour.destination,
      roomType: calc.tierName || 'Deluxe Tier',
      guestName: guestName,
      guestPhone: guestPhone,
      checkin: st.departureDate,
      checkout: `Duration: ${tour.duration}`,
      nights: parseInt(tour.duration) || 4,
      rooms: 1,
      mealPlan: 'Daily Buffet Breakfast Included',
      addOns: calc.addonsList?.join(', ') || 'None',
      totalAmount: `₹${(calc.totalPayable || tour.clientPrice).toLocaleString('en-IN')}`,
      grossNumeric: calc.totalPayable || tour.clientPrice,
      hotelCommissionPercent: 15,
      commissionEarned: Math.round((calc.totalPayable || tour.clientPrice) * 0.15),
      clientSavings: calc.discountSavings || Math.round(tour.standardPrice * 0.1),
      status: 'Confirmed (10% MHT Privilege Rate)'
    });

    this.showToast(`Tour reservation confirmed for ${tour.title}!`, 'success');
    this.openVoucherModal(booking);
  },

  openTourWhatsApp() {
    if (!this.activeTourDetailState) return;
    const st = this.activeTourDetailState;
    const tour = st.tour;
    const calc = st.calculated || {};

    const msg = 
      `*MHT 10% Privilege Tour Package Inquiry*\n\n` +
      `🗺️ *Package:* ${tour.title}\n` +
      `📍 *Destinations:* ${tour.destination}\n` +
      `⏳ *Duration:* ${tour.duration}\n` +
      `🏨 *Travel Tier:* ${calc.tierName || 'Deluxe 4-Star'}\n` +
      `📅 *Target Departure Date:* ${st.departureDate}\n` +
      `👥 *Travelers:* ${st.travelers} Adults, ${st.children} Children\n` +
      `✨ *Experience Add-ons:* ${calc.addonsList?.length ? calc.addonsList.join(', ') : 'None'}\n` +
      `💰 *Standard Tariff:* ₹${(calc.standardTotal || tour.standardPrice).toLocaleString('en-IN')}\n` +
      `🎉 *MHT 10% Client Price:* ₹${(calc.totalPayable || tour.clientPrice).toLocaleString('en-IN')}\n\n` +
      `Please provide customized itinerary details and voucher confirmation.`;

    const waNum = window.MHTStoreInstance?.data?.brand?.whatsapp || '919893854811';
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, '_blank');
  },

  openVoucherModal(booking) {
    const modal = document.getElementById('voucher-modal');
    const content = document.getElementById('voucher-modal-content');
    if (!modal || !content) return;

    const brand = window.MHTStoreInstance?.data?.brand || MHT_DEFAULT_DATA.brand;
    const waText = encodeURIComponent(
      `*MHT Official Booking Confirmation Voucher*\n\n` +
      `📄 *Voucher Reference:* ${booking.id}\n` +
      `👤 *Guest Name:* ${booking.guestName}\n` +
      `🏨 *Property / Tour:* ${booking.hotelName || booking.tourTitle}\n` +
      `📅 *Schedule:* ${booking.checkin ? `${booking.checkin} to ${booking.checkout}` : booking.travelDate}\n` +
      `💰 *Total Amount:* ${booking.totalAmount} (10% MHT Advantage Rate Applied)\n` +
      `✨ *Status:* Confirmed & Guaranteed\n\n` +
      `Official Helpline: +91 98938 54811 | www.myholidaytrip.in`
    );

    const bookingDate = new Date(booking.timestamp || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const isTour = booking.type?.includes('Tour') || booking.tourTitle;

    content.innerHTML = `
      <div id="clean-pdf-voucher" class="bg-white p-6 sm:p-8 space-y-6 text-slate-800 text-xs font-sans">
        
        <!-- Official PDF Letterhead Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b-2 border-slate-900">
          <div class="flex items-center gap-3.5">
            <img src="images/mht-logo.jpg" class="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-sm shrink-0" alt="MHT Logo" />
            <div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">My Holiday Trip</h2>
              <span class="text-[9px] uppercase tracking-widest text-amber-700 font-extrabold block mt-0.5">Travel • Explore • Memories</span>
              <p class="text-[10px] text-slate-500 mt-1">Official B2B &amp; Client Partner &bull; Reg: MHT/TRV/2026/IN</p>
            </div>
          </div>

          <div class="text-left sm:text-right space-y-1">
            <span class="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <i data-lucide="check-circle" class="w-3 h-3 text-emerald-600"></i> CONFIRMED VOUCHER
            </span>
            <div class="font-mono text-xs font-black text-slate-900 mt-1">Ref: ${booking.id}</div>
            <div class="text-[10px] text-slate-400">Issued: ${bookingDate}</div>
          </div>
        </div>

        <!-- Voucher Document Subheading -->
        <div class="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-400 block">Service Type</span>
            <strong class="text-slate-900 text-sm font-black">${isTour ? 'Curated Holiday Tour Package' : 'Luxury Partner Hotel Stay'}</strong>
          </div>
          <div class="sm:text-right">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">Privilege Applied</span>
            <span class="text-amber-700 font-extrabold">10% MHT Advantage Rate Verified</span>
          </div>
        </div>

        <!-- Clean 2-Column Booking Details Table -->
        <div class="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs">
          
          <div class="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-white">
            <div class="p-3.5 space-y-0.5">
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Lead Guest / Traveler</span>
              <strong class="text-slate-900 text-sm block">${booking.guestName}</strong>
              <span class="text-slate-500 text-[11px]">Phone: ${booking.guestPhone}</span>
            </div>
            <div class="p-3.5 space-y-0.5">
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Property / Tour Package</span>
              <strong class="text-slate-900 text-sm block">${booking.hotelName || booking.tourTitle}</strong>
              <span class="text-slate-500 text-[11px]">${booking.city || 'Singapore & Malaysia'}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-slate-50/50">
            <div class="p-3.5 space-y-0.5">
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Dates / Schedule</span>
              <strong class="text-slate-900 block">${booking.checkin ? `${booking.checkin} to ${booking.checkout}` : (booking.travelDate || 'Confirmed 2026')}</strong>
              <span class="text-slate-500 text-[11px]">${booking.nights ? `${booking.nights} Nights Stay` : (booking.duration || '6N/7D Package')}</span>
            </div>
            <div class="p-3.5 space-y-0.5">
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Allocation / Category</span>
              <strong class="text-amber-800 block">${booking.roomType || 'Deluxe Room / 4★ Tier'}</strong>
              <span class="text-slate-500 text-[11px]">${booking.rooms ? `${booking.rooms} Room(s)` : (booking.travelers ? `${booking.travelers} Persons` : 'Confirmed Allocation')}</span>
            </div>
          </div>

          <div class="p-3.5 bg-white space-y-1">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">Included Perks &amp; Amenities</span>
            <div class="text-slate-700 font-medium">
              ${booking.mealPlan ? `&bull; ${booking.mealPlan} ` : '&bull; Daily Breakfast Included '}
              ${booking.addOns && booking.addOns !== 'None' ? `&bull; Add-ons: ${booking.addOns} ` : ''}
              &bull; High-Speed Wi-Fi &bull; 10% Advantage VIP Tariff
            </div>
          </div>

        </div>

        <!-- Tariff & Privilege Calculation Summary -->
        <div class="bg-slate-900 text-white rounded-xl p-4 sm:p-5 space-y-2.5">
          <div class="flex justify-between text-slate-300 text-xs">
            <span>Standard Rack Tariff:</span>
            <span class="line-through text-slate-400">₹${(booking.grossNumeric || 15600).toLocaleString('en-IN')}</span>
          </div>
          <div class="flex justify-between text-emerald-400 text-xs font-bold">
            <span class="flex items-center gap-1"><i data-lucide="shield-check" class="w-3.5 h-3.5"></i> MHT 10% Client Privilege Savings:</span>
            <span>- ₹${Number(booking.clientSavings || 1560).toLocaleString('en-IN')}</span>
          </div>
          <div class="flex justify-between items-baseline border-t border-white/20 pt-2 text-sm">
            <span class="font-extrabold text-white">Net Total Amount Paid:</span>
            <span class="text-xl sm:text-2xl font-black text-amber-300">${booking.totalAmount}</span>
          </div>
          <div class="text-[10px] text-slate-400 pt-0.5">
            * Inclusive of all applicable government hotel taxes, service fees, and local levies.
          </div>
        </div>

        <!-- Barcode / Security Strip & Instructions -->
        <div class="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="space-y-1 text-left">
            <h4 class="font-bold text-slate-900 text-[11px] uppercase tracking-wider">Hotel Check-in Instructions:</h4>
            <p class="text-[10px] text-slate-500 leading-tight">Present this digital confirmation voucher or a printed copy along with valid government photo ID at the hotel reception / coach guide upon arrival.</p>
            <div class="text-[10px] text-slate-600 font-semibold pt-0.5">
              Direct Helpline: <strong>+91 98938 54811</strong>
            </div>
          </div>
          <div class="text-center font-mono text-[9px] text-slate-400 shrink-0 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
            <div class="tracking-widest font-black text-slate-700 text-xs">||| |||| || ||||| ||||</div>
            <span>${booking.id}</span>
          </div>
        </div>

        <!-- Action Buttons (Hidden when Printing) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200 no-print">
          <button onclick="window.print()" class="btn-primary text-xs py-3 justify-center shadow-md">
            <i data-lucide="printer" class="w-4 h-4"></i> Download PDF / Print Voucher
          </button>
          <a href="https://wa.me/${brand.whatsapp}?text=${waText}" target="_blank" class="btn-outline text-xs py-3 justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300">
            <i data-lucide="message-circle" class="w-4 h-4 text-emerald-600"></i> Send Voucher to WhatsApp
          </a>
        </div>

      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  // ----------------------------------------------------
  // 5. USER AUTH & DUMMY OTP CONTROLLER
  // ----------------------------------------------------
  initAuth() {
    // Setup auto-tab for 4-digit OTP inputs
    const digits = ['otp-1', 'otp-2', 'otp-3', 'otp-4'];
    digits.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          if (e.target.value.length === 1 && idx < digits.length - 1) {
            const next = document.getElementById(digits[idx + 1]);
            if (next) next.focus();
          }
        });
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !e.target.value && idx > 0) {
            const prev = document.getElementById(digits[idx - 1]);
            if (prev) prev.focus();
          } else if (e.key === 'Enter') {
            this.verifyOTP();
          }
        });
      }
    });

    const phoneInput = document.getElementById('auth-phone-input');
    if (phoneInput) {
      phoneInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.sendOTP();
        }
      });
    }
  },

  openLoginModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    this.backToPhoneStep();
    modal.classList.remove('hidden');
    const input = document.getElementById('auth-phone-input');
    if (input) {
      setTimeout(() => input.focus(), 100);
    }
    if (window.lucide) lucide.createIcons();
  },

  closeLoginModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('hidden');
  },

  sendOTP() {
    const phoneInput = document.getElementById('auth-phone-input');
    const phoneVal = (phoneInput?.value || '').trim();
    if (!phoneVal || phoneVal.length < 8) {
      this.showToast('Please enter a valid 10-digit phone number', 'info');
      return;
    }

    const stepPhone = document.getElementById('auth-step-phone');
    const stepOtp = document.getElementById('auth-step-otp');
    const sentPhoneLabel = document.getElementById('auth-sent-to-phone');

    if (sentPhoneLabel) {
      sentPhoneLabel.innerText = `+91 ${phoneVal}`;
    }

    if (stepPhone) stepPhone.classList.add('hidden');
    if (stepOtp) stepOtp.classList.remove('hidden');

    this.fillDummyOTP();
    this.showToast('Verification OTP sent! Dummy code is 1234.', 'success');

    // Auto focus first OTP digit
    const otp1 = document.getElementById('otp-1');
    if (otp1) setTimeout(() => otp1.focus(), 150);
  },

  backToPhoneStep() {
    const stepPhone = document.getElementById('auth-step-phone');
    const stepOtp = document.getElementById('auth-step-otp');
    if (stepPhone) stepPhone.classList.remove('hidden');
    if (stepOtp) stepOtp.classList.add('hidden');
  },

  fillDummyOTP() {
    const o1 = document.getElementById('otp-1');
    const o2 = document.getElementById('otp-2');
    const o3 = document.getElementById('otp-3');
    const o4 = document.getElementById('otp-4');
    if (o1) o1.value = '1';
    if (o2) o2.value = '2';
    if (o3) o3.value = '3';
    if (o4) o4.value = '4';
  },

  verifyOTP() {
    const o1 = document.getElementById('otp-1')?.value || '';
    const o2 = document.getElementById('otp-2')?.value || '';
    const o3 = document.getElementById('otp-3')?.value || '';
    const o4 = document.getElementById('otp-4')?.value || '';
    const otp = `${o1}${o2}${o3}${o4}`;
    const phone = document.getElementById('auth-phone-input')?.value || '9893854811';

    const result = window.MHTStoreInstance.loginWithOTP(phone, otp);
    if (result.success) {
      this.closeLoginModal();
      this.updateAuthUI();
      this.showToast(`Welcome back, ${result.user.name}! 10% Advantage pass active.`, 'success');
      this.navigateTo('account');
    } else {
      this.showToast(result.message || 'Invalid OTP code. Enter 1234.', 'info');
    }
  },

  logoutUser() {
    window.MHTStoreInstance.logout();
    this.updateAuthUI();
    this.showToast('You have logged out of MHT Advantage Club.', 'info');
    this.renderAccountDashboard();
  },

  updateAuthUI() {
    const user = window.MHTStoreInstance.getUser();
    const headerAuth = document.getElementById('header-auth-container');
    const drawerAvatar = document.getElementById('drawer-user-avatar');
    const drawerName = document.getElementById('drawer-user-name');
    const drawerId = document.getElementById('drawer-user-id');
    const drawerBadge = document.getElementById('drawer-auth-badge');

    if (user && user.isLoggedIn) {
      if (headerAuth) {
        headerAuth.innerHTML = `
          <div class="flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 py-1 px-2.5 rounded-full border border-slate-200 transition" onclick="MHTApp.navigateTo('account')">
            <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}" class="w-6 h-6 rounded-full object-cover border border-amber-400" alt="${user.name}" />
            <div class="text-left">
              <span class="text-[11px] font-extrabold text-[#0C1E36] block leading-tight">${user.name.split(' ')[0]}</span>
              <span class="text-[9px] font-black text-amber-600 uppercase block leading-tight">10% VIP</span>
            </div>
          </div>
        `;
      }

      if (drawerAvatar) drawerAvatar.src = user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
      if (drawerName) drawerName.innerText = user.name;
      if (drawerId) drawerId.innerText = `ID: ${user.memberId}`;
      if (drawerBadge) {
        drawerBadge.innerText = 'ACTIVE VIP';
        drawerBadge.className = 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 text-[9px] font-black px-2 py-0.5 rounded-full';
      }
    } else {
      if (headerAuth) {
        headerAuth.innerHTML = `
          <button onclick="MHTApp.openLoginModal()" class="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900 transition">
            <i data-lucide="log-in" class="w-3.5 h-3.5 text-amber-700"></i>
            <span>Login / VIP</span>
          </button>
        `;
      }

      if (drawerName) drawerName.innerText = 'Guest Traveler';
      if (drawerId) drawerId.innerText = 'Tap to Login with OTP';
      if (drawerBadge) {
        drawerBadge.innerText = 'GUEST';
        drawerBadge.className = 'bg-white/10 text-slate-300 border border-white/20 text-[9px] font-black px-2 py-0.5 rounded-full';
      }
    }

    if (window.lucide) lucide.createIcons();
  },

  // ----------------------------------------------------
  // 6. MY ACCOUNT DASHBOARD (ALL 4 TABS)
  // ----------------------------------------------------
  renderAccountDashboard() {
    const user = window.MHTStoreInstance.getUser();
    const summary = window.MHTStoreInstance.getUserSavingsSummary();

    // Populate Banner Info
    const avatarEl = document.getElementById('account-user-avatar');
    const nameEl = document.getElementById('account-user-name');
    const idEl = document.getElementById('account-user-id');
    const phoneEl = document.getElementById('account-user-phone');

    if (avatarEl) avatarEl.src = user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
    if (nameEl) nameEl.innerText = user.name || 'Valued Member';
    if (idEl) idEl.innerText = user.memberId || 'MHT-VIP-8821';
    if (phoneEl) phoneEl.innerText = user.phone || '+91 98938 54811';

    // Populate KPIs
    const kpiSavings = document.getElementById('account-kpi-savings');
    const kpiBookings = document.getElementById('account-kpi-bookings');
    const kpiVouchers = document.getElementById('account-kpi-vouchers');

    if (kpiSavings) kpiSavings.innerText = `₹${summary.totalSaved.toLocaleString('en-IN')}`;
    if (kpiBookings) kpiBookings.innerText = `${summary.bookingsCount} Stays`;
    if (kpiVouchers) kpiVouchers.innerText = `${summary.vouchersAvailableCount} Active`;

    const badgeBookings = document.getElementById('acc-tab-badge-bookings');
    if (badgeBookings) badgeBookings.innerText = summary.bookingsCount;

    // Render Panels
    this.renderAccountBookings();
    this.renderAccountSavings();
    this.renderAccountVouchers();
    this.renderAccountRecommended();

    if (window.lucide) lucide.createIcons();
  },

  switchAccountTab(tabName) {
    const tabs = ['bookings', 'savings', 'vouchers', 'recommended'];
    tabs.forEach(t => {
      const btn = document.getElementById(`acc-tab-btn-${t}`);
      const panel = document.getElementById(`acc-panel-${t}`);
      if (t === tabName) {
        if (btn) btn.classList.add('active');
        if (panel) panel.classList.remove('hidden');
      } else {
        if (btn) btn.classList.remove('active');
        if (panel) panel.classList.add('hidden');
      }
    });

    if (window.lucide) lucide.createIcons();
  },

  renderAccountBookings() {
    const container = document.getElementById('my-bookings-container');
    if (!container) return;

    const bookings = window.MHTStoreInstance.getBookings();
    if (!bookings || bookings.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16 bg-white rounded-3xl p-8 border border-slate-200 space-y-3">
          <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <i data-lucide="bookmark-check" class="w-7 h-7"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900">No Confirmed Bookings Yet</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">Explore our luxury partner hotels in Malaysia and start saving 10% on every stay.</p>
          <button onclick="MHTApp.navigateTo('hotels')" class="btn-primary text-xs px-6 py-2.5 mt-2">
            Explore Partner Hotels &rarr;
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = bookings.map(b => {
      const isTour = b.type?.includes('Tour') || b.tourTitle;
      const title = b.hotelName || b.tourTitle || 'Luxury Partner Stay';
      const dateStr = b.checkin ? `${b.checkin} (${b.nights || 1} Nights)` : (b.travelDate || 'Flexible 2026');
      const savings = b.clientSavings || Math.round((b.grossNumeric || 10000) * 0.1);

      return `
        <div class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <span class="text-xs font-mono font-black bg-[#0C1E36] text-amber-300 px-2.5 py-1 rounded-lg shadow-sm">
                ${b.id}
              </span>
              <span class="text-xs text-slate-500 font-medium">
                Booked on ${new Date(b.timestamp || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <i data-lucide="check-circle" class="w-3 h-3 text-emerald-700"></i> Confirmed (10% Advantage Rate)
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            <div class="md:col-span-8 space-y-2">
              <div class="flex items-center gap-2">
                <span class="text-[10px] uppercase font-black px-2 py-0.5 rounded ${isTour ? 'bg-purple-100 text-purple-900' : 'bg-blue-100 text-blue-900'}">
                  ${isTour ? 'Tour Package' : 'Partner Hotel'}
                </span>
                <span class="text-xs text-slate-500">${b.city || 'Malaysia'}</span>
              </div>
              <h4 class="text-base sm:text-lg font-black text-slate-900">${title}</h4>
              
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                <div>
                  <span class="text-slate-400 block text-[10px] uppercase font-bold">Schedule:</span>
                  <strong class="text-slate-800">${dateStr}</strong>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] uppercase font-bold">Guest &amp; Contact:</span>
                  <strong class="text-slate-800">${b.guestName} (${b.guestPhone})</strong>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] uppercase font-bold">Room / Tier:</span>
                  <strong class="text-amber-800">${b.roomType || 'Deluxe Room'}</strong>
                </div>
              </div>

              ${b.mealPlan || (b.addOns && b.addOns !== 'None') ? `
                <div class="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-wrap gap-x-4 gap-y-1">
                  ${b.mealPlan ? `<span><strong>Meal:</strong> ${b.mealPlan}</span>` : ''}
                  ${b.addOns && b.addOns !== 'None' ? `<span><strong>Add-ons:</strong> ${b.addOns}</span>` : ''}
                </div>
              ` : ''}
            </div>

            <div class="md:col-span-4 flex flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              <div class="text-left md:text-right space-y-0.5">
                <div class="text-[10px] text-emerald-700 font-extrabold flex items-center md:justify-end gap-1">
                  <i data-lucide="wallet" class="w-3 h-3"></i> Saved ₹${savings.toLocaleString('en-IN')} (10% OFF)
                </div>
                <span class="text-xs text-slate-400 block">Total MHT Tariff</span>
                <span class="text-xl sm:text-2xl font-black text-slate-900">${b.totalAmount}</span>
              </div>

              <div class="flex items-center gap-2 w-full md:w-auto">
                <button onclick="MHTApp.openVoucherModal(${JSON.stringify(b).replace(/"/g, '&quot;')})" class="btn-primary text-xs py-2 px-3.5 flex-1 md:flex-initial justify-center shadow-sm">
                  <i data-lucide="receipt" class="w-3.5 h-3.5"></i> View Voucher
                </button>
                <a href="https://wa.me/919893854811?text=Hi%20My%20Holiday%20Trip,%20I%20have%20a%20query%20about%20booking%20${encodeURIComponent(b.id)}" target="_blank" class="btn-outline text-xs py-2 px-3 flex items-center justify-center" title="Concierge WhatsApp">
                  <i data-lucide="message-circle" class="w-3.5 h-3.5 text-emerald-600"></i>
                </a>
              </div>
            </div>

          </div>

        </div>
      `;
    }).join('');
  },

  renderAccountSavings() {
    const container = document.getElementById('acc-panel-savings');
    if (!container) return;

    const summary = window.MHTStoreInstance.getUserSavingsSummary();
    const bookings = window.MHTStoreInstance.getBookings();

    container.innerHTML = `
      <!-- Savings Hero Card -->
      <div class="rounded-3xl bg-gradient-to-br from-emerald-900 via-[#0C1E36] to-slate-950 p-6 sm:p-8 text-white border border-emerald-500/30 shadow-xl space-y-6">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span class="text-xs uppercase font-extrabold tracking-wider text-emerald-300">Lifetime Advantage Privilege</span>
            </div>
            <h3 class="text-2xl sm:text-4xl font-black text-white mt-1">
              ₹${summary.totalSaved.toLocaleString('en-IN')} Total Saved
            </h3>
            <p class="text-xs text-slate-300 mt-1">
              Direct wallet savings generated by your guaranteed 10% MHT Advantage Club client tariff.
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-white/10 border border-white/20 text-center sm:text-right space-y-1">
            <span class="text-[10px] uppercase font-bold text-amber-300 block">Total Booking Value</span>
            <span class="text-xl sm:text-2xl font-black text-white">₹${summary.totalSpent.toLocaleString('en-IN')}</span>
            <span class="text-[10px] text-slate-300 block">vs. Rack Rate ₹${summary.totalStandardRack.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <!-- VIP Milestone Progress -->
        <div class="space-y-2">
          <div class="flex justify-between text-xs font-bold">
            <span class="text-slate-200">VIP Tier Milestone: <strong class="text-amber-300">Elite Saver</strong></span>
            <span class="text-emerald-300">Next Goal: Platinum Tier (₹${summary.nextTierGoal.toLocaleString('en-IN')})</span>
          </div>
          <div class="w-full bg-white/10 rounded-full h-3 overflow-hidden p-0.5 border border-white/20">
            <div class="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-700" style="width: ${summary.savingsProgressPercent}%"></div>
          </div>
          <div class="flex justify-between text-[10px] text-slate-400">
            <span>Current: ₹${summary.totalSaved.toLocaleString('en-IN')}</span>
            <span>₹${(summary.nextTierGoal - summary.totalSaved > 0 ? summary.nextTierGoal - summary.totalSaved : 0).toLocaleString('en-IN')} more to unlock 12% Platinum Club!</span>
          </div>
        </div>

      </div>

      <!-- Itemized Savings Comparison Breakdown -->
      <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h4 class="text-lg font-bold text-slate-900">Per-Booking Rate &amp; Savings Comparison</h4>
          <p class="text-xs text-slate-500">Transparent breakdown showing standard public rack price vs your 10% Advantage rate.</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th class="py-3 px-4">Reserved Stay / Tour</th>
                <th class="py-3 px-4">Dates</th>
                <th class="py-3 px-4 text-right">Standard Rack Rate</th>
                <th class="py-3 px-4 text-right font-bold text-[#0C1E36]">Your 10% MHT Price</th>
                <th class="py-3 px-4 text-right font-black text-emerald-700">Cash Saved</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium">
              ${bookings.map(b => {
                const gross = b.grossNumeric || 8000;
                const saved = b.clientSavings || Math.round(gross * (10 / 90));
                const rack = gross + saved;
                return `
                  <tr>
                    <td class="py-3.5 px-4 font-bold text-slate-900">${b.hotelName || b.tourTitle}</td>
                    <td class="py-3.5 px-4 text-slate-600">${b.checkin || b.travelDate || 'Oct 2026'}</td>
                    <td class="py-3.5 px-4 text-right text-slate-400 line-through">₹${rack.toLocaleString('en-IN')}</td>
                    <td class="py-3.5 px-4 text-right font-bold text-slate-900">₹${gross.toLocaleString('en-IN')}</td>
                    <td class="py-3.5 px-4 text-right font-black text-emerald-600 bg-emerald-50/50">+ ₹${saved.toLocaleString('en-IN')}</td>
                  </tr>
                `;
              }).join('')}
              <tr class="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-200">
                <td colspan="2" class="py-3.5 px-4 text-slate-700">Total Lifetime Savings Portfolio</td>
                <td class="py-3.5 px-4 text-right text-slate-400 line-through">₹${summary.totalStandardRack.toLocaleString('en-IN')}</td>
                <td class="py-3.5 px-4 text-right text-base text-[#0C1E36]">₹${summary.totalSpent.toLocaleString('en-IN')}</td>
                <td class="py-3.5 px-4 text-right text-base text-emerald-700 bg-emerald-100/60">₹${summary.totalSaved.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Advantage Perks Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <i data-lucide="percent" class="w-5 h-5"></i>
          </div>
          <h5 class="font-bold text-slate-900 text-sm">Guaranteed 10% Rate</h5>
          <p class="text-xs text-slate-500">Every partner hotel across Malaysia and India comes with a permanent 10% discount off standard rates.</p>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <i data-lucide="headphones" class="w-5 h-5"></i>
          </div>
          <h5 class="font-bold text-slate-900 text-sm">24/7 Dedicated Concierge</h5>
          <p class="text-xs text-slate-500">Direct WhatsApp access to your personal travel manager for flight changes, tours, and special requests.</p>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <i data-lucide="sparkles" class="w-5 h-5"></i>
          </div>
          <h5 class="font-bold text-slate-900 text-sm">Priority Room Upgrades</h5>
          <p class="text-xs text-slate-500">Enjoy early check-in, late check-out, and room category upgrades subject to hotel availability.</p>
        </div>
      </div>
    `;
  },

  renderAccountVouchers() {
    const container = document.getElementById('acc-panel-vouchers');
    if (!container) return;

    const vouchers = window.MHTStoreInstance.getVouchers();

    container.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h3 class="text-lg font-bold text-slate-900">Your Next Trip Vouchers &amp; Rewards</h3>
          <p class="text-xs text-slate-500">Exclusive discount codes and complimentary perks ready to apply on your upcoming bookings.</p>
        </div>
        <span class="bg-amber-100 text-amber-900 border border-amber-300 text-xs px-3 py-1 rounded-full font-bold self-start sm:self-auto">
          5 Vouchers Active
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${vouchers.map(v => `
          <div class="voucher-ticket-card p-5 sm:p-6 space-y-4">
            <div class="voucher-ticket-cutout-left"></div>
            <div class="voucher-ticket-cutout-right"></div>

            <div class="flex items-start justify-between gap-3">
              <div>
                <span class="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  ${v.category}
                </span>
                <h4 class="text-base font-extrabold text-slate-900 mt-1.5">${v.title}</h4>
              </div>
              <span class="bg-gradient-to-r ${v.color} text-white text-xs font-black px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                ${v.discount}
              </span>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed">${v.description}</p>

            <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-dashed border-slate-200">
              <div><span>Min. Spend:</span> <strong class="text-slate-800">${v.minSpend}</strong></div>
              <div><span>Valid Until:</span> <strong class="text-slate-800">${v.validTill}</strong></div>
            </div>

            <!-- Copy Code & Redeem Action Bar -->
            <div class="flex items-center gap-2 pt-1">
              <div class="flex-1 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <span class="text-xs font-mono font-black text-[#0C1E36] tracking-wider">${v.code}</span>
                <button onclick="MHTApp.copyVoucherCode('${v.code}', this)" class="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition">
                  <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                  <span>Copy</span>
                </button>
              </div>
              <button onclick="MHTApp.redeemVoucher('${v.destination}', '${v.code}')" class="btn-primary text-xs py-2 px-3.5 whitespace-nowrap">
                Redeem Now &rarr;
              </button>
            </div>

          </div>
        `).join('')}
      </div>
    `;
  },

  copyVoucherCode(code, btn) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        this.showToast(`Coupon code ${code} copied to clipboard!`, 'success');
        if (btn) {
          const original = btn.innerHTML;
          btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i><span class="text-emerald-600">Copied!</span>`;
          if (window.lucide) lucide.createIcons();
          setTimeout(() => {
            btn.innerHTML = original;
            if (window.lucide) lucide.createIcons();
          }, 2000);
        }
      });
    } else {
      prompt("Copy your voucher code:", code);
    }
  },

  redeemVoucher(destination, code) {
    this.showToast(`Voucher ${code} applied! Redirecting to offers...`, 'success');
    if (destination === 'malaysia') {
      this.navigateTo('malaysia');
    } else if (destination === 'tours') {
      this.navigateTo('tours');
    } else {
      this.navigateTo('hotels');
    }
  },

  renderAccountRecommended() {
    const container = document.getElementById('acc-panel-recommended');
    if (!container) return;

    const hotels = window.MHTStoreInstance.getHotels().slice(0, 3);
    const tours = window.MHTStoreInstance.getTourPackages().slice(0, 2);

    container.innerHTML = `
      <div class="space-y-6">
        
        <!-- Recommended Partner Hotels -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <i data-lucide="building-2" class="w-4 h-4 text-amber-600"></i>
                <span>Recommended Luxury Partner Hotels for You</span>
              </h4>
              <p class="text-xs text-slate-500">Top-rated hotels in Kuala Lumpur, Langkawi &amp; Penang with your 10% Advantage rate.</p>
            </div>
            <button onclick="MHTApp.navigateTo('hotels')" class="text-xs font-bold text-amber-700 hover:text-amber-800">
              View All &rarr;
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${hotels.map(h => `
              <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div class="relative h-40 overflow-hidden">
                    <img src="${h.image}" alt="${h.name}" class="w-full h-full object-cover" />
                    <span class="absolute top-2 right-2 bg-[#0C1E36] text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                      10% OFF
                    </span>
                  </div>
                  <div class="p-4 space-y-1">
                    <span class="text-[10px] text-slate-500 uppercase font-bold">${h.city}</span>
                    <h5 class="font-bold text-slate-900 text-sm line-clamp-1">${h.name}</h5>
                    <div class="flex items-baseline gap-2 pt-1">
                      <span class="text-slate-400 line-through text-xs">₹${h.rackRate.toLocaleString('en-IN')}</span>
                      <span class="text-base font-black text-[#0C1E36]">₹${h.discountedRate.toLocaleString('en-IN')}</span>
                      <span class="text-[10px] text-slate-500">/ night</span>
                    </div>
                  </div>
                </div>
                <div class="p-4 pt-0">
                  <button onclick="MHTApp.openHotelDetailPage('${h.id}')" class="btn-primary w-full py-2 text-xs font-bold justify-center">
                    View Details &amp; Book
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Recommended Tour Packages -->
        <div class="space-y-3 pt-4 border-t border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <i data-lucide="compass" class="w-4 h-4 text-purple-600"></i>
                <span>Curated VIP Holiday Packages</span>
              </h4>
              <p class="text-xs text-slate-500">All-inclusive stays, flights/cabs, island hopping &amp; theme park admissions.</p>
            </div>
            <button onclick="MHTApp.navigateTo('tours')" class="text-xs font-bold text-purple-700 hover:text-purple-800">
              View All Tours &rarr;
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${tours.map(t => `
              <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col sm:flex-row">
                <div class="sm:w-1/3 h-40 sm:h-auto relative overflow-hidden">
                  <img src="${t.image}" alt="${t.title}" class="w-full h-full object-cover" />
                  <span class="absolute top-2 left-2 bg-purple-900 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                    ${t.duration}
                  </span>
                </div>
                <div class="p-4 sm:w-2/3 flex flex-col justify-between space-y-3">
                  <div class="space-y-1">
                    <span class="text-[10px] text-slate-500 uppercase font-bold">${t.destination}</span>
                    <h5 class="font-bold text-slate-900 text-sm leading-snug">${t.title}</h5>
                    <div class="flex items-baseline gap-2">
                      <span class="text-slate-400 line-through text-xs">₹${t.standardPrice.toLocaleString('en-IN')}</span>
                      <span class="text-base font-black text-[#0C1E36]">₹${t.clientPrice.toLocaleString('en-IN')}</span>
                      <span class="text-[10px] text-emerald-700 font-bold">10% Off</span>
                    </div>
                  </div>
                  <button onclick="MHTApp.openTourDetailPage('${t.id}')" class="btn-primary w-full py-2 text-xs font-bold justify-center">
                    Explore Itinerary &rarr;
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  },

  // ----------------------------------------------------
  // 6. ADMIN PORTAL (MANUAL ENTRY & API MIGRATION READY)
  // ----------------------------------------------------
  initAdminForms() {
    const addHotelForm = document.getElementById('admin-add-hotel-form');
    if (addHotelForm) {
      addHotelForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('admin-hotel-name').value;
        const city = document.getElementById('admin-hotel-city').value;
        const country = document.getElementById('admin-hotel-country').value || "Malaysia";
        const rackRate = parseFloat(document.getElementById('admin-hotel-rack').value);
        const discount = parseFloat(document.getElementById('admin-hotel-discount').value) || 10;
        const commission = parseFloat(document.getElementById('admin-hotel-commission')?.value) || 15;
        const image = document.getElementById('admin-hotel-img').value || "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80";
        const desc = document.getElementById('admin-hotel-desc').value;
        const destination = document.getElementById('admin-hotel-dest-cat').value;

        window.MHTStoreInstance.addHotel({
          name: name,
          city: city,
          country: country,
          destinationCategory: destination,
          stars: 4,
          badge: "Partner Hotel",
          address: `${city}, ${country}`,
          rackRate: rackRate,
          clientDiscountPercent: discount,
          partnerCommissionPercent: commission,
          image: image,
          description: desc,
          rating: 4.8,
          amenities: ["Free High-Speed Wi-Fi", "Breakfast Included", "MHT 10% Advantage Discount", "24/7 Room Service"],
          roomTypes: [
            { name: "Deluxe Suite", rack: rackRate, clientPrice: Math.round(rackRate * (1 - discount/100)), capacity: "2 Adults", bed: "1 King Bed" }
          ],
          partnerContact: "+91 98938 54811"
        });

        addHotelForm.reset();
        this.renderAllContent();
        this.renderAdminLists();
        this.showToast(`Partner Hotel "${name}" added with ${commission}% demo commission!`, 'success');
      });
    }

    const addTourForm = document.getElementById('admin-add-tour-form');
    if (addTourForm) {
      addTourForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('admin-tour-title').value;
        const dest = document.getElementById('admin-tour-dest').value;
        const duration = document.getElementById('admin-tour-duration').value;
        const price = parseFloat(document.getElementById('admin-tour-price').value);
        const discount = parseFloat(document.getElementById('admin-tour-discount').value) || 10;
        const img = document.getElementById('admin-tour-img').value || "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80";
        const desc = document.getElementById('admin-tour-desc').value;
        const category = document.getElementById('admin-tour-cat').value;

        window.MHTStoreInstance.addTourPackage({
          title: title,
          destination: dest,
          category: category,
          duration: duration,
          badge: "Curated Tour",
          standardPrice: price,
          discountPercent: discount,
          image: img,
          description: desc,
          inclusions: ["Partner 4-Star Hotel Stay", "AC Cab for Sightseeing", "Daily Breakfast", "Sightseeing & Permits"],
          itinerary: [
            { day: "Day 1", title: "Arrival & Sightseeing", desc: "Airport pickup and check in to partner hotel." },
            { day: "Day 2", title: "Full Day Exploration", desc: "Guided tour and local highlights." }
          ]
        });

        addTourForm.reset();
        this.renderAllContent();
        this.renderAdminLists();
        this.showToast(`Tour Package "${title}" added! (Hotel stay bundled)`, 'success');
      });
    }

    // Initialize the Interactive Client Commission Simulator
    this.initCommissionSimulator();
  },

  initCommissionSimulator() {
    const slider = document.getElementById('sim-bookings-slider');
    const sliderLabel = document.getElementById('sim-bookings-val');
    const avgRateInput = document.getElementById('sim-avg-rate');
    const commButtons = document.querySelectorAll('.sim-comm-btn');

    let currentRate = 15;

    const recalculate = () => {
      const bookingsCount = parseInt(slider ? slider.value : 50) || 50;
      const avgRate = parseFloat(avgRateInput ? avgRateInput.value : 7000) || 7000;

      if (sliderLabel) sliderLabel.textContent = `${bookingsCount} Bookings`;

      const totalGMV = Math.round(bookingsCount * avgRate);
      const clientSavings = Math.round(totalGMV * 0.10); // 10% customer discount
      const totalCommission = Math.round(totalGMV * (currentRate / 100));
      const perBooking = Math.round(totalCommission / bookingsCount);

      const outGmv = document.getElementById('sim-out-gmv');
      const outSavings = document.getElementById('sim-out-savings');
      const outCommission = document.getElementById('sim-out-commission');
      const outPerBooking = document.getElementById('sim-out-per-booking');
      const outBadge = document.getElementById('sim-out-rate-badge');

      if (outGmv) outGmv.textContent = `₹${totalGMV.toLocaleString('en-IN')}`;
      if (outSavings) outSavings.textContent = `₹${clientSavings.toLocaleString('en-IN')}`;
      if (outCommission) outCommission.textContent = `₹${totalCommission.toLocaleString('en-IN')}`;
      if (outPerBooking) outPerBooking.textContent = `₹${perBooking.toLocaleString('en-IN')}`;
      if (outBadge) outBadge.textContent = `${currentRate}% Margin`;
    };

    if (slider) slider.addEventListener('input', recalculate);
    if (avgRateInput) avgRateInput.addEventListener('input', recalculate);

    commButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        commButtons.forEach(b => {
          b.classList.remove('active', 'bg-amber-400', 'text-slate-950', 'border-amber-400', 'font-black');
          b.classList.add('border-white/20', 'font-bold');
        });
        btn.classList.add('active', 'bg-amber-400', 'text-slate-950', 'border-amber-400', 'font-black');
        btn.classList.remove('border-white/20');
        currentRate = parseFloat(btn.getAttribute('data-rate')) || 15;
        recalculate();
      });
    });

    recalculate();
  },

  renderAdminLists() {
    const hotelList = document.getElementById('admin-hotel-list');
    const tourList = document.getElementById('admin-tour-list');
    const commTable = document.getElementById('admin-hotel-commission-table');
    const commLedger = document.getElementById('admin-commission-ledger');

    const bookings = window.MHTStoreInstance.getBookings();
    const hotels = window.MHTStoreInstance.getHotels();
    const tours = window.MHTStoreInstance.getTourPackages();

    // 1. Calculate Overall Revenue & Commission KPIs
    const totalBookings = bookings.length;
    let totalGMV = 0;
    let totalCommission = 0;
    let totalSavings = 0;

    bookings.forEach(b => {
      const gross = b.grossNumeric || (parseInt((b.totalAmount || '').toString().replace(/[^0-9]/g, '')) || 5000);
      const commRate = b.hotelCommissionPercent || 15;
      const comm = b.commissionEarned || Math.round(gross * (commRate / 100));
      const savings = b.clientSavings || Math.round(gross * (10 / 90));

      totalGMV += gross;
      totalCommission += comm;
      totalSavings += savings;
    });

    const kpiBookings = document.getElementById('admin-kpi-total-bookings');
    const kpiGmv = document.getElementById('admin-kpi-gross-gmv');
    const kpiComm = document.getElementById('admin-kpi-total-commission');
    const kpiSavings = document.getElementById('admin-kpi-client-savings');

    if (kpiBookings) kpiBookings.textContent = totalBookings;
    if (kpiGmv) kpiGmv.textContent = `₹${totalGMV.toLocaleString('en-IN')}`;
    if (kpiComm) kpiComm.textContent = `₹${totalCommission.toLocaleString('en-IN')}`;
    if (kpiSavings) kpiSavings.textContent = `₹${totalSavings.toLocaleString('en-IN')}`;

    // 2. Render Hotel-Wise Commission Breakdown Table
    if (commTable) {
      const hotelStats = {};
      hotels.forEach(h => {
        hotelStats[h.name] = {
          hotel: h,
          bookingsCount: 0,
          grossVolume: 0,
          commissionEarned: 0,
          commissionRate: h.partnerCommissionPercent || 15
        };
      });

      bookings.forEach(b => {
        const hotelName = b.hotelName;
        if (hotelName && hotelStats[hotelName]) {
          const gross = b.grossNumeric || (parseInt((b.totalAmount || '').toString().replace(/[^0-9]/g, '')) || 5000);
          const commRate = hotelStats[hotelName].commissionRate;
          const comm = b.commissionEarned || Math.round(gross * (commRate / 100));

          hotelStats[hotelName].bookingsCount += 1;
          hotelStats[hotelName].grossVolume += gross;
          hotelStats[hotelName].commissionEarned += comm;
        }
      });

      const rows = Object.values(hotelStats);
      if (rows.length === 0) {
        commTable.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-400">No partner hotels added yet.</td></tr>`;
      } else {
        commTable.innerHTML = rows.map(stat => {
          const h = stat.hotel;
          return `
            <tr class="hover:bg-slate-50/80 transition">
              <td class="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                <img src="${h.image}" class="w-8 h-8 rounded-lg object-cover shadow-xs shrink-0" />
                <span>${h.name}</span>
              </td>
              <td class="py-3.5 px-4 text-slate-500">${h.city}, ${h.country || 'Malaysia'}</td>
              <td class="py-3.5 px-4 text-center">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${stat.bookingsCount > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'}">
                  ${stat.bookingsCount} ${stat.bookingsCount === 1 ? 'Booking' : 'Bookings'}
                </span>
              </td>
              <td class="py-3.5 px-4 text-right font-semibold text-slate-800">
                ₹${stat.grossVolume.toLocaleString('en-IN')}
              </td>
              <td class="py-3.5 px-4 text-center">
                <span class="bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                  ${stat.commissionRate}%
                </span>
              </td>
              <td class="py-3.5 px-4 text-right font-black text-emerald-700 text-sm">
                ₹${stat.commissionEarned.toLocaleString('en-IN')}
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // 3. Render Itemized Commission Ledger & Booking Receipts
    if (commLedger) {
      if (bookings.length === 0) {
        commLedger.innerHTML = `<p class="text-center py-6 text-slate-400 text-xs">No client bookings recorded yet.</p>`;
      } else {
        commLedger.innerHTML = bookings.map(b => {
          const gross = b.grossNumeric || (parseInt((b.totalAmount || '').toString().replace(/[^0-9]/g, '')) || 5000);
          const commRate = b.hotelCommissionPercent || 15;
          const comm = b.commissionEarned || Math.round(gross * (commRate / 100));
          const savings = b.clientSavings || Math.round(gross * (10 / 90));
          const isSettled = b.payoutStatus === 'Settled / Received';

          return `
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-xs font-mono font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-xs">${b.id}</span>
                  <span class="text-[11px] text-slate-500">${new Date(b.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${isSettled ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}">
                    ${b.payoutStatus || 'Pending Payout'}
                  </span>
                </div>
                <h5 class="font-bold text-slate-900 text-sm">${b.hotelName || b.tourTitle}</h5>
                <p class="text-xs text-slate-600">Guest: <strong>${b.guestName}</strong> &bull; ${b.guestPhone} &bull; ${b.checkin ? `Stay: ${b.checkin} to ${b.checkout} (${b.nights}N)` : `Date: ${b.travelDate}`}</p>
              </div>

              <!-- Revenue & Commission Breakdown -->
              <div class="flex flex-wrap items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shrink-0">
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-extrabold block">Gross Total</span>
                  <span class="font-bold text-slate-800 text-xs">₹${gross.toLocaleString('en-IN')}</span>
                </div>
                <div class="border-l border-slate-200 pl-3">
                  <span class="text-[10px] text-slate-400 uppercase font-extrabold block">10% Client Saved</span>
                  <span class="font-semibold text-slate-500 text-xs">- ₹${savings.toLocaleString('en-IN')}</span>
                </div>
                <div class="border-l border-slate-200 pl-3">
                  <span class="text-[10px] text-emerald-700 uppercase font-extrabold block">Commission Earned (${commRate}%)</span>
                  <span class="font-black text-emerald-700 text-sm">+ ₹${comm.toLocaleString('en-IN')}</span>
                </div>
                <button onclick="MHTApp.togglePayoutStatus('${b.id}')" class="text-xs px-3 py-1.5 rounded-lg border font-bold transition ${isSettled ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-xs'}">
                  ${isSettled ? 'Mark Pending' : 'Mark Settled'}
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 4. Render Active Hotels Catalog List
    if (hotelList) {
      hotelList.innerHTML = hotels.map(h => `
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <img src="${h.image}" class="w-12 h-12 rounded-lg object-cover shadow-sm" />
            <div>
              <h5 class="font-bold text-slate-900 text-sm">${h.name}</h5>
              <p class="text-xs text-slate-500">${h.city}, ${h.country || 'Malaysia'} &bull; Rack: ₹${h.rackRate} &bull; <strong class="text-emerald-700">MHT Client Price: ₹${h.discountedRate} (10% OFF)</strong> &bull; <span class="text-blue-700 font-bold">Our Commission: ${h.partnerCommissionPercent || 15}%</span></p>
            </div>
          </div>
          <button onclick="MHTApp.deleteAdminHotel('${h.id}')" class="p-2 text-rose-600 hover:text-rose-800 rounded bg-rose-50 hover:bg-rose-100">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      `).join('');
    }

    // 5. Render Active Tour Packages Catalog List
    if (tourList) {
      tourList.innerHTML = tours.map(t => `
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <img src="${t.image}" class="w-12 h-12 rounded-lg object-cover shadow-sm" />
            <div>
              <h5 class="font-bold text-slate-900 text-sm">${t.title}</h5>
              <p class="text-xs text-slate-500">${t.duration} &bull; <strong class="text-emerald-700">MHT Price: ₹${t.clientPrice}</strong> (was ₹${t.standardPrice})</p>
            </div>
          </div>
          <button onclick="MHTApp.deleteAdminTour('${t.id}')" class="p-2 text-rose-600 hover:text-rose-800 rounded bg-rose-50 hover:bg-rose-100">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      `).join('');
    }

    if (window.lucide) lucide.createIcons();
  },

  togglePayoutStatus(bookingId) {
    const updated = window.MHTStoreInstance.toggleBookingPayoutStatus(bookingId);
    if (updated) {
      this.renderAdminLists();
      this.showToast(`Booking ${bookingId} payout status updated to: ${updated.payoutStatus}`, 'info');
    }
  },

  deleteAdminHotel(id) {
    if (confirm("Remove this hotel from catalog?")) {
      window.MHTStoreInstance.deleteHotel(id);
      this.renderAllContent();
      this.renderAdminLists();
      this.showToast('Hotel removed from catalog', 'info');
    }
  },

  deleteAdminTour(id) {
    if (confirm("Remove this tour package?")) {
      window.MHTStoreInstance.deleteTour(id);
      this.renderAllContent();
      this.renderAdminLists();
      this.showToast('Tour package removed', 'info');
    }
  },

  // ----------------------------------------------------
  // 7. MOBILE NAVIGATION & TOASTS
  // ----------------------------------------------------
  initMobileNav() {
    const burger = document.getElementById('mobile-burger-btn');
    const bottomMenuBtn = document.getElementById('mobile-bottom-menu-btn');
    const drawer = document.getElementById('mobile-drawer');
    const closeBtn = document.getElementById('mobile-drawer-close');

    const handleOpen = (e) => {
      if (e) e.stopPropagation();
      this.openMobileNav();
    };

    if (burger) {
      burger.addEventListener('click', handleOpen);
    }

    if (bottomMenuBtn) {
      bottomMenuBtn.addEventListener('click', handleOpen);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeMobileNav();
      });
    }

    // Close when clicking links inside drawer
    if (drawer) {
      drawer.querySelectorAll('a, button:not(#mobile-drawer-close)').forEach(el => {
        el.addEventListener('click', () => {
          this.closeMobileNav();
        });
      });

      // Close when clicking directly on the overlay backdrop
      drawer.addEventListener('click', (e) => {
        if (e.target === drawer) {
          this.closeMobileNav();
        }
      });
    }

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileNav();
      }
    });
  },

  openMobileNav() {
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('overflow-hidden');
      if (window.lucide) lucide.createIcons();
    }
  },

  closeMobileNav() {
    const drawer = document.getElementById('mobile-drawer');
    if (drawer && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('overflow-hidden');
    }
  },

  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" class="w-5 h-5 text-amber-600 shrink-0"></i>
      <span class="text-xs leading-normal flex-1 font-medium text-slate-800">${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 4000);
    }, 4000);
  }
};

window.MHTApp = MHTApp;
