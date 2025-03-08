document.addEventListener('DOMContentLoaded', () => {
    const App = {
        config: {
            mobileBreakpoint: 992,
            scrollOffset: 100,
            animationOffset: 150,
            videoVolume: 0.2
        },

        init() {
            this.setupNav();
            this.setupSmoothScroll();
            this.setupAnimations();
            this.setupVideo();
            this.setupLanguageSwitcher();
            this.setupProgressBars();
            this.setupFormValidation();
            this.setupIntersectionObservers();
            this.setupUIEventListeners();
            this.setupServiceWorker();
        },

        setupNav() {
            this.navToggle = document.querySelector('.nav-toggle');
            this.navMenu = document.querySelector('.nav-menu');
            
            this.navToggle?.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.addEventListener('mouseenter', this.handleDropdownShow);
                dropdown.addEventListener('mouseleave', this.handleDropdownHide);
            });

            document.querySelectorAll('.nav-item.dropdown').forEach(item => {
                item.addEventListener('click', e => {
                    if (window.innerWidth < this.config.mobileBreakpoint) {
                        e.preventDefault();
                        item.classList.toggle('active');
                    }
                });
            });
        },

        toggleMobileMenu() {
            this.navToggle?.classList.toggle('active');
            this.navMenu?.classList.toggle('active');
            document.body.classList.toggle('nav-active');
        },

        handleDropdownShow(e) {
            if (window.innerWidth > App.config.mobileBreakpoint) {
                e.currentTarget.classList.add('active');
            }
        },

        handleDropdownHide(e) {
            if (window.innerWidth > App.config.mobileBreakpoint) {
                e.currentTarget.classList.remove('active');
            }
        },

        setupSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', e => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop - this.config.scrollOffset,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        },

        setupAnimations() {
            this.animatedElements = document.querySelectorAll('[data-animate]');
            this.animateOnScroll();
        },

        animateOnScroll() {
            this.animatedElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementBottom = element.getBoundingClientRect().bottom;
                
                if (elementTop < window.innerHeight - this.config.animationOffset &&
                    elementBottom > this.config.animationOffset) {
                    element.classList.add('active');
                }
            });
        },

        setupVideo() {
            this.heroVideo = document.querySelector('.hero-video');
            if (this.heroVideo) {
                this.heroVideo.volume = this.config.videoVolume;
                this.heroVideo.muted = true;
            }
        },

        setupLanguageSwitcher() {
            const engButton = document.querySelector(".lang-option.active");
            const langButton = document.querySelector(".languages-btn");
            const langOptions = document.querySelectorAll(".languages-content a");

            langOptions.forEach(option => {
                option.addEventListener("click", function (event) {
                    event.preventDefault();
                    engButton.classList.remove("active");
                    langButton.innerHTML = option.getAttribute("data-lang") + " ▼";
                    langButton.classList.add("active");
                });
            });
        },

        setupProgressBars() {
            this.initProgressBars();
            this.initHoverEffects();
            this.initLiveUpdates();
        },

        initProgressBars() {
            document.querySelectorAll('.progress-bar').forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                bar.style.setProperty('--progress-width', `${progress}%`);
            });
        },

        initHoverEffects() {
            document.querySelectorAll('.metric-card, .timeline-content').forEach(element => {
                element.addEventListener('mouseenter', () => {
                    element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                });
            });
        },

        initLiveUpdates() {
            const updateTime = document.getElementById('update-time');
            
            function updateTimestamp() {
                updateTime.textContent = new Date().toLocaleString();
            }
            
            if(updateTime) {
                setInterval(updateTimestamp, 1000);
                updateTimestamp();
            }
        },

        setupFormValidation() {
            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', e => {
                    if (!this.validateForm(form)) {
                        e.preventDefault();
                    }
                });
            });
        },

        validateForm(form) {
            let isValid = true;
            form.querySelectorAll('[required]').forEach(input => {
                if (!input.checkValidity()) {
                    isValid = false;
                    this.showFormError(input);
                }
            });
            return isValid;
        },

        showFormError(input) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'form-error';
            errorMessage.textContent = input.validationMessage;
            input.parentNode.appendChild(errorMessage);
            
            setTimeout(() => {
                errorMessage.remove();
            }, 3000);
        },

        setupIntersectionObservers() {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const elementObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    }
                });
            }, observerOptions);

            document.querySelectorAll('[data-observe]').forEach(element => {
                elementObserver.observe(element);
            });

            function startCounter(element) {
                const target = parseInt(element.getAttribute('data-target'));
                let count = 0;
                const increment = Math.ceil(target / 500);

                function updateCounter() {
                    count += increment;
                    if (count >= target) {
                        element.innerText = target;
                    } else {
                        element.innerText = count;
                        requestAnimationFrame(updateCounter);
                    }
                }

                updateCounter();
            }

            const counterElement = document.querySelector('.stat-number.counter');

            if (counterElement) {
                const counterObserver = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            startCounter(entry.target);
                            counterObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });

                counterObserver.observe(counterElement);
            }
        },

        setupUIEventListeners() {
            window.addEventListener('scroll', this.debounce(this.handleScroll));
            window.addEventListener('resize', this.debounce(this.handleResize));
        },

        handleScroll() {
            App.animateOnScroll();
            App.trackScrollPosition();
        },

        handleResize() {
            if (window.innerWidth >= App.config.mobileBreakpoint) {
                App.navMenu?.classList.remove('active');
                App.navToggle?.classList.remove('active');
            }
        },

        trackScrollPosition() {
            const scrollY = window.scrollY;
            document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
        },

        setupServiceWorker() {
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                        .then(registration => {
                            console.log('ServiceWorker registration successful');
                        })
                        .catch(err => {
                            console.log('ServiceWorker registration failed: ', err);
                        });
                });
            }
        },

        debounce(func, timeout = 100) {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    func.apply(this, args);
                }, timeout);
            };
        }
    };

    App.init();

    setTimeout(() => {
        document.getElementById("popup-form").style.opacity = "1";
        document.getElementById("popup-form").style.visibility = "visible";
    }, 2000);

    const form = document.getElementById('idCardForm');
    const modal = document.getElementById('cardModal');
    const closeModal = document.querySelector('.close-modal');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('userName').value,
            gender: document.getElementById('userGender').value,
            age: document.getElementById('userAge').value,
            city: document.getElementById('userCity').value
        };
        
        document.getElementById('previewName').textContent = formData.name;
        document.getElementById('previewGender').textContent = formData.gender;
        document.getElementById('previewAge').textContent = formData.age;
        document.getElementById('previewCity').textContent = formData.city;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    document.getElementById('modalDownload').addEventListener('click', () => {
        html2canvas(document.getElementById('idCardPreview')).then(canvas => {
            const link = document.createElement('a');
            link.download = 'libertarian-card.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    });
});

function closePopup() {
    document.getElementById("popup-form").style.opacity = "0";
    document.getElementById("popup-form").style.visibility = "hidden";
}

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    const languageSwitcher = document.querySelector('.language-switcher');
    
    navToggle.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !expanded);
        navMenu.classList.toggle('active');
        
        if (!expanded) {
            this.classList.add('is-active');
        } else {
            this.classList.remove('is-active');
        }
    });
    
    document.addEventListener('click', function(event) {
        const isOutside = !event.target.closest('.nav-menu') && 
                          !event.target.closest('.nav-toggle');
        
        if (isOutside && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.classList.remove('is-active');
            
            dropdownItems.forEach(item => {
                item.classList.remove('js-dropdown-active');
            });
            
            if (languageSwitcher) {
                languageSwitcher.classList.remove('is-open');
            }
        }
    });
    
    dropdownItems.forEach(item => {
        const dropdownToggle = item.querySelector('a');
        
        dropdownToggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('js-dropdown-active');
                    }
                });
                
                item.classList.toggle('js-dropdown-active');
            }
        });
    });
    
    if (languageSwitcher) {
        const langButton = languageSwitcher.querySelector('.languages-btn');
        const langContent = languageSwitcher.querySelector('.languages-content');
        
        langButton.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                languageSwitcher.classList.toggle('is-open');
                
                if (langContent) {
                    if (languageSwitcher.classList.contains('is-open')) {
                        langContent.style.display = 'block';
                        setTimeout(() => {
                            langContent.style.opacity = '1';
                            langContent.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        langContent.style.opacity = '0';
                        langContent.style.transform = 'translateY(10px)';
                        setTimeout(() => {
                            langContent.style.display = 'none';
                        }, 300);
                    }
                }
            }
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.classList.remove('is-active');
            
            dropdownItems.forEach(item => {
                item.classList.remove('js-dropdown-active');
            });
            
            if (languageSwitcher) {
                languageSwitcher.classList.remove('is-open');
            }
        }
    });
    
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1024) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('is-active');
                
                dropdownItems.forEach(item => {
                    item.classList.remove('js-dropdown-active');
                });
            }
        });
    });
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 1024) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('is-active');
                
                dropdownItems.forEach(item => {
                    item.classList.remove('js-dropdown-active');
                });
                
                if (languageSwitcher) {
                    languageSwitcher.classList.remove('is-open');
                    const langContent = languageSwitcher.querySelector('.languages-content');
                    if (langContent) {
                        langContent.style.display = '';
                        langContent.style.opacity = '';
                        langContent.style.transform = '';
                    }
                }
            }
        }, 250);
    });
});
