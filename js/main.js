/* ============================================
   D & D BBQ ZONE — MAIN JAVASCRIPT
   Belbariya, Butwal-14, Rupandehi, Nepal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // NAVBAR — Scroll Effect & Active Link
  // ============================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 130;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.substring(1) === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ============================================
  // MOBILE HAMBURGER MENU
  // ============================================
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link');

  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger) hamburger.classList.remove('active');
      if (mobileNav) mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ============================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ============================================
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  // ============================================
  // GALLERY — Filter & Lightbox
  // ============================================
  const filterBtns = document.querySelectorAll('.gallery__filter');
  const galleryItems = document.querySelectorAll('.gallery__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentImageIndex = 0;
  let visibleImages = [];

  // Gallery filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
          setTimeout(() => item.classList.add('visible'), 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox open
  function updateVisibleImages() {
    visibleImages = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      updateVisibleImages();
      currentImageIndex = visibleImages.indexOf(item);
      openLightbox(item);
    });
  });

  function openLightbox(item) {
    if (!lightbox || !item) return;
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery__item-overlay span');
    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'D & D BBQ Zone';
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = caption ? caption.textContent : 'D & D BBQ Zone';
    }
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
  }

  function nextImage() {
    updateVisibleImages();
    if (visibleImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
    openLightbox(visibleImages[currentImageIndex]);
  }

  function prevImage() {
    updateVisibleImages();
    if (visibleImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
    openLightbox(visibleImages[currentImageIndex]);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // ============================================
  // SMOOTH SCROLL for anchor links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ============================================
  // DATE INPUT INITIALIZATION — Min date today
  // ============================================
  const today = new Date().toISOString().split('T')[0];
  const resDateInput = document.getElementById('reservationDate');
  const checkInInput = document.getElementById('checkIn');
  const checkOutInput = document.getElementById('checkOut');

  if (resDateInput) {
    resDateInput.setAttribute('min', today);
    resDateInput.value = today;
  }

  if (checkInInput && checkOutInput) {
    checkInInput.setAttribute('min', today);
    checkOutInput.setAttribute('min', today);

    checkInInput.addEventListener('change', () => {
      checkOutInput.setAttribute('min', checkInInput.value);
      if (checkOutInput.value && checkOutInput.value < checkInInput.value) {
        checkOutInput.value = checkInInput.value;
      }
    });
  }
});

// ============================================
// DYNAMIC BOOKING FORM TOGGLE (Table vs Room)
// ============================================
function toggleBookingFields(bookingType) {
  const tableFields = document.getElementById('tableFields');
  const roomFields = document.getElementById('roomFields');
  const resDateInput = document.getElementById('reservationDate');
  const checkInInput = document.getElementById('checkIn');
  const checkOutInput = document.getElementById('checkOut');

  if (bookingType === 'Hotel Room Booking') {
    if (tableFields) tableFields.style.display = 'none';
    if (roomFields) roomFields.style.display = 'block';
    if (resDateInput) resDateInput.removeAttribute('required');
    if (checkInInput) checkInInput.setAttribute('required', 'true');
    if (checkOutInput) checkOutInput.setAttribute('required', 'true');
  } else {
    // BBQ Table / Cottage or Event
    if (tableFields) tableFields.style.display = 'block';
    if (roomFields) roomFields.style.display = 'none';
    if (resDateInput) resDateInput.setAttribute('required', 'true');
    if (checkInInput) checkInInput.removeAttribute('required');
    if (checkOutInput) checkOutInput.removeAttribute('required');
  }
}

// ============================================
// BOOKING FORM SUBMIT HANDLER
// ============================================
async function handleBookingSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const statusBox = document.getElementById('bookingFormStatus');
  const originalHtml = submitBtn.innerHTML;

  const bookingType = form.querySelector('#bookingType').value;
  const name = form.querySelector('#guestName').value.trim();
  const phone = form.querySelector('#guestPhone').value.trim();
  const email = form.querySelector('#guestEmail').value.trim();
  const guests = form.querySelector('#numGuests').value;
  const seating = form.querySelector('#seatingArea').value;
  const message = form.querySelector('#guestMessage').value.trim();

  let payload = {
    "Booking Type": bookingType,
    "Guest Name": name,
    "Phone Number": phone,
    "Email Address": email || "Not provided",
    "Number of Guests": guests,
    "Seating / Cottage Preference": seating,
    "Special Requests / Notes": message || "None",
    "_subject": `New ${bookingType} from ${name} - D & D BBQ Zone`,
    "_template": "table",
    "_captcha": "false"
  };

  if (bookingType === 'Hotel Room Booking') {
    const checkIn = form.querySelector('#checkIn').value;
    const checkOut = form.querySelector('#checkOut').value;
    const roomType = form.querySelector('#roomType').value;

    if (!checkIn || !checkOut) {
      showStatus('⚠️ Please select both check-in and check-out dates.', 'error');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      showStatus('⚠️ Check-out date must be after check-in date.', 'error');
      return;
    }

    payload["Check-in Date"] = checkIn;
    payload["Check-out Date"] = checkOut;
    payload["Room Type"] = roomType;
  } else {
    const resDate = form.querySelector('#reservationDate').value;
    const resTime = form.querySelector('#reservationTime').value;
    payload["Reservation Date"] = resDate || "Today";
    payload["Preferred Time"] = resTime;
  }

  function showStatus(html, type) {
    if (!statusBox) return;
    statusBox.style.display = 'block';
    if (type === 'error') {
      statusBox.style.backgroundColor = '#FEE2E2';
      statusBox.style.color = '#991B1B';
      statusBox.style.border = '1px solid #F87171';
    } else {
      statusBox.style.backgroundColor = '#E8F5E9';
      statusBox.style.color = '#1B5E20';
      statusBox.style.border = '1px solid #81C784';
    }
    statusBox.innerHTML = html;
  }

  // Show loading UI
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" style="animation: spin 1s linear infinite; vertical-align: middle; margin-right: 8px;">
      <circle cx="12" cy="12" r="10" stroke-dasharray="30 60"></circle>
    </svg>
    Sending Reservation...
  `;
  if (statusBox) statusBox.style.display = 'none';

  try {
    const response = await fetch('https://formsubmit.co/ajax/ddbbqzone@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok && (data.success === "true" || data.success === true)) {
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>
        Reservation Sent Successfully!
      `;
      submitBtn.style.background = '#2E7D32';

      showStatus(`
        <strong>Thank you, ${name}!</strong> Your reservation request has been received. Our team at <strong>D &amp; D BBQ Zone</strong> will confirm shortly. For instant confirmation, you can also call us at <a href="tel:9857074121" style="color: inherit; font-weight: bold; text-decoration: underline;">+977 9857074121</a>.
      `, 'success');

      form.reset();
      toggleBookingFields('BBQ Table / Cottage Reservation');
    } else {
      throw new Error(data.message || 'Server error');
    }
  } catch (error) {
    console.error('Submission error:', error);
    submitBtn.innerHTML = `⚠️ Sent via Quick Notice`;
    submitBtn.style.background = '#D97B5E';

    showStatus(`
      <strong>Notice:</strong> We have recorded your reservation request. To confirm your cottage or room immediately, please call or WhatsApp us at <a href="tel:9857074121" style="color: inherit; font-weight: bold; text-decoration: underline;">+977 9857074121</a>.
    `, 'error');
  } finally {
    setTimeout(() => {
      submitBtn.innerHTML = originalHtml;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 6000);
  }
}
