// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initCounterAnimation();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initFormSubmission();
    initImageLazyLoading();
    initFloatingButton();
  });
  
// Updated Counter Animation
function initCounterAnimation() {
    const counterElement = document.querySelector('.stat-number');
    if (!counterElement) return;
  
    const targetCount = parseInt(counterElement.dataset.count);
    let currentCount = 0;
    const duration = 6000; // Animation duration in ms
    const startTime = Date.now();
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter();
          observer.unobserve(counterElement);
        }
      });
    }, { threshold: 0.5 });
  
    observer.observe(counterElement);
  
    function animateCounter() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
  
      currentCount = Math.floor(progress * targetCount);
      counterElement.textContent = currentCount.toLocaleString() + '+';
  
      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      } else {
        counterElement.textContent = targetCount.toLocaleString() + '+';
      }
    }
  }
//   
  // Smooth Scroll Behavior
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
  
  // Scroll Animation Triggers
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px'
    };
  
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
  
    document.querySelectorAll('.hidden').forEach(el => {
      fadeObserver.observe(el);
    });
  }
  
  // Form Submission Handler
  function initFormSubmission() {
    const form = document.querySelector('.membership-form');
    if (!form) return;
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Simulated API call
      try {
        // Show loading state
        form.querySelector('button').disabled = true;
        
        // Simulated delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update member count
        const counter = document.querySelector('.stat-number');
        const currentCount = parseInt(counter.dataset.count) || 15327;
        counter.dataset.count = currentCount + 1;
        counter.textContent = (currentCount + 1).toLocaleString() + '+';
        
        // Reset form
        form.reset();
        
        // Show success message
        showFormMessage('Thank you for joining the movement!', 'success');
      } catch (error) {
        showFormMessage('Error submitting form. Please try again.', 'error');
      } finally {
        form.querySelector('button').disabled = false;
      }
    });
  
    function showFormMessage(message, type) {
      const existingMessage = document.querySelector('.form-message');
      if (existingMessage) existingMessage.remove();
  
      const messageEl = document.createElement('div');
      messageEl.className = `form-message ${type}`;
      messageEl.textContent = message;
      
      form.parentNode.insertBefore(messageEl, form.nextSibling);
      
      setTimeout(() => {
        messageEl.style.opacity = '1';
      }, 100);
      
      setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => messageEl.remove(), 500);
      }, 3000);
    }
  }
  
  // Image Lazy Loading
  function initImageLazyLoading() {
    const lazyImages = document.querySelectorAll('.gallery-item img');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });
  
    lazyImages.forEach(img => {
      img.dataset.src = img.src;
      img.src = '';
      imageObserver.observe(img);
    });
  }
  


// Initialize Floating Button Effect
function initFloatingButton() {
    const button = document.querySelector('.hero-cta');
    if (!button) return;
  
    let floating = true;
  
    function animate() {
      if (floating) {
        button.style.transform = `translateY(${Math.sin(Date.now() / 600) * 5}px)`;
        requestAnimationFrame(animate);
      }
    }
  
    button.addEventListener('mouseenter', () => {
      floating = false;
      button.style.transform = 'translateY(0)';
    });
  
    button.addEventListener('mouseleave', () => {
      floating = true;
      animate();
    });
  
    animate();
  }
  
  
  function initMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');

    // Debugging: Log elements to verify selection
    console.log('Menu Button:', menuButton);
    console.log('Nav Links:', navLinks);

    if (!menuButton || !navLinks) {
        console.error('Mobile menu elements not found!');
        return;
    }

    const toggleMenu = (shouldOpen) => {
        const isOpen = navLinks.classList.contains('active');
        if (typeof shouldOpen !== 'undefined') {
            if (shouldOpen !== isOpen) {
                navLinks.classList.toggle('active');
                menuButton.classList.toggle('active');
            }
        } else {
            navLinks.classList.toggle('active');
            menuButton.classList.toggle('active');
        }
        
        // Debugging: Log current state
        console.log('Menu State:', navLinks.classList.contains('active') ? 'OPEN' : 'CLOSED');
    };

    // Click handler with proper event delegation
    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuButton.contains(e.target)) {
            toggleMenu(false);
        }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMenu(false);
        }
    });

    // Responsive cleanup with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768) {
                toggleMenu(false);
            }
        }, 100);
    });

    // Touch gesture support
    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        if (Math.abs(touchEndX - touchStartX) > 50 && navLinks.classList.contains('active')) {
            toggleMenu(false);
        }
    }, { passive: true });
}