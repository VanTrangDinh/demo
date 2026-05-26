/**
 * main.js - Premium B2B Landing Page Logic
 * Handcrafted interactive features for high B2B conversions.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. STICKY HEADER ON SCROLL
  // ==========================================================================
  const header = document.querySelector('.header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  // Run once on load to ensure state correctness
  handleScroll();

  // ==========================================================================
  // 2. MOBILE MENU INTERACTIVE TOGGLE
  // ==========================================================================
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================================================
  // 3. SCROLL-TRIGGERED ENTRANCE REVEAL ANIMATIONS
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Stop observing once revealed
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ==========================================================================
  // 4. INTERACTIVE LIGHTBOX GALLERY
  // ==========================================================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (galleryItems.length > 0 && lightbox && lightboxImg && lightboxClose) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('.gallery-img').getAttribute('src');
        const imgAlt = item.querySelector('.gallery-img').getAttribute('alt');
        
        lightboxImg.setAttribute('src', imgSrc);
        lightboxImg.setAttribute('alt', imgAlt || 'Premium Bead Image');
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Restore background scroll
      // Small timeout to prevent flashing old image when reopening
      setTimeout(() => {
        lightboxImg.setAttribute('src', '');
      }, 300);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on click outside content
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ==========================================================================
  // 5. B2B CONTACT FORM VALIDATION & SUCCESS FEEDBACK (TOAST & FEEDBACK STATE)
  // ==========================================================================
  const contactForm = document.getElementById('b2bContactForm');
  const toast = document.getElementById('successToast');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent standard page reload
      
      // Grab inputs
      const nameInput = document.getElementById('fullname');
      const phoneInput = document.getElementById('phone');
      const companyInput = document.getElementById('company');
      const quantityInput = document.getElementById('quantity');
      const notesInput = document.getElementById('notes');
      const submitBtn = contactForm.querySelector('.form-submit-btn');

      // Basic local validation
      if (!nameInput.value.trim()) {
        alert('Vui lòng điền Họ tên.');
        nameInput.focus();
        return;
      }

      if (!phoneInput.value.trim()) {
        alert('Vui lòng điền Số điện thoại liên hệ.');
        phoneInput.focus();
        return;
      }

      // Format check (basic Vietnamese phone number style check)
      const phoneReg = /^(0|84)[3|5|7|8|9][0-9]{8}$/;
      if (phoneInput.value.trim().length < 9) {
        alert('Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.');
        phoneInput.focus();
        return;
      }

      if (quantityInput.value === '') {
        alert('Vui lòng chọn nhu cầu số lượng dự kiến.');
        quantityInput.focus();
        return;
      }

      // Save initial button state and enter loading state
      const origBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite; margin-right: 8px;">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity: 0.25;"></circle>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Đang gửi yêu cầu...
      `;

      // CSS for spinner rotation
      const spinStyle = document.createElement('style');
      spinStyle.innerHTML = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(spinStyle);

      // Simulate B2B API call (1.2s delay)
      setTimeout(() => {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnText;

        // Reset form inputs
        contactForm.reset();

        // Show elegant success toast
        if (toast) {
          toast.classList.add('show');
          
          // Auto hide toast after 5 seconds
          setTimeout(() => {
            toast.classList.remove('show');
          }, 5000);
        } else {
          alert('Gửi yêu cầu thành công! Đội ngũ tư vấn sỉ của chúng tôi sẽ liên hệ lại trong vòng 2 giờ.');
        }

      }, 1500);

    });
  }

  // Close toast manually on click
  if (toast) {
    toast.addEventListener('click', () => {
      toast.classList.remove('show');
    });
  }

  // ==========================================================================
  // 6. SMOOTH SCROLL ANCHOR NAVIGATION WITH OFFSET
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
