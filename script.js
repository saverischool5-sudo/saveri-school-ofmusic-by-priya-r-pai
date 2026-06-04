document.addEventListener('DOMContentLoaded', () => {

    /* --- Lenis Smooth Scroll --- */
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    /* --- Navbar Scroll Effect --- */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
                navbar.style.padding = '';
                navbar.style.boxShadow = '';
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    /* --- Active Navigation Link --- */
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    /* --- Fade In Scroll Reveal --- */
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.card, .about-text, .about-image-wrapper, .section-header');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
    });

    /* --- Number Counter Animation --- */
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
                obs.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    const counters = document.querySelectorAll('.stat-counter');

    /* --- Mouse-Tracking Glow on Cards --- */
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });

    /* --- Gallery Lightbox and 3D Tilt --- */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const src = item.getAttribute('data-src');
                if (src) { lightboxImg.src = src; lightbox.classList.add('active'); }
            });
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -12;
                const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 12;
                item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                item.style.zIndex = 10;
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                item.style.zIndex = 1;
            });
        });
        lightboxClose?.addEventListener('click', () => lightbox.classList.remove('active'));
        lightbox.addEventListener('click', (e) => { if (e.target !== lightboxImg) lightbox.classList.remove('active'); });
    }

    /* --- Page Transition (Fade in on load) --- */
    document.body.classList.add('page-transition');
    setTimeout(() => document.body.classList.remove('page-transition'), 1050);

    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && href !== '' && link.target !== '_blank') {
                e.preventDefault();
                document.body.classList.add('page-transition-out');
                setTimeout(() => { window.location.href = href; }, 400);
            }
        });
    });

    /* --- Staggered Scroll Reveals --- */
    const fadeElementsAdvanced = document.querySelectorAll('.card, .about-image, .section-header, .stat-item, .blog-card');
    const advancedObserver = new IntersectionObserver((entries, obs) => {
        let delay = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                delay += 100;
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    fadeElementsAdvanced.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
        advancedObserver.observe(el);
    });

    /* --- Text-Split Reveal Animations --- */
    const titleElements = document.querySelectorAll('.page-title, .section-title');
    titleElements.forEach(title => {
        const text = title.innerText;
        title.innerHTML = '';
        const words = text.split(' ');
        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';
            word.split('').forEach(char => {
                const wrapper = document.createElement('span');
                wrapper.className = 'split-text-wrapper';
                const span = document.createElement('span');
                span.className = 'char';
                span.innerHTML = char;
                wrapper.appendChild(span);
                wordSpan.appendChild(wrapper);
            });
            title.appendChild(wordSpan);
            if (index < words.length - 1) {
                const space = document.createElement('span');
                space.innerHTML = '&nbsp;';
                title.appendChild(space);
            }
        });
    });

    const textObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.char').forEach((char, index) => {
                    setTimeout(() => char.classList.add('revealed'), index * 20);
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    /* --- FAQ Accordion Logic --- */
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const answer = q.nextElementSibling;
            const item = q.parentElement;
            const isOpen = answer.classList.contains('open');
            document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isOpen) { answer.classList.add('open'); item.classList.add('active'); }
        });
    });

    /* =========================================
       PREMIUM MICRO-INTERACTIONS
       ========================================= */

    const body = document.body;

    /* --- Scroll Progress Bar --- */
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'scroll-progress-container';
    scrollContainer.innerHTML = '<div class="scroll-progress-bar" id="scrollBar"></div>';
    body.appendChild(scrollContainer);

    /* --- Page Loader (Hero pages only) --- */
    const isLandingPage = document.querySelector('.hero') !== null;

    if (isLandingPage) {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-ripple-container">
                <div class="loader-ripple"></div>
                <div class="loader-ripple delay-1"></div>
                <img src="assets/priya-r-pai.webp" class="loader-logo" alt="Loading..." width="150" height="150">
            </div>
            <div class="loader-message">Tuning the instruments...</div>
        `;
        body.appendChild(loader);

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('loaded');
                setTimeout(() => {
                    loader.remove();
                    document.body.classList.add('page-loaded');
                    fadeElements.forEach(el => observer.observe(el));
                    counters.forEach(counter => counterObserver.observe(counter));
                    titleElements.forEach(title => textObserver.observe(title));
                }, 800);
            }, 1500);
        });
    } else {
        document.body.classList.add('page-loaded');
        window.addEventListener('load', () => {
            fadeElements.forEach(el => observer.observe(el));
            counters.forEach(counter => counterObserver.observe(counter));
            titleElements.forEach(title => textObserver.observe(title));
        });
    }

    /* --- Scroll Progress & Parallax (rAF-throttled) --- */
    const scrollBar = document.getElementById('scrollBar');
    const heroBg = document.querySelector('.hero-bg-instrument');
    const pageHeader = document.querySelector('.page-header');
    let rafPending = false;

    window.addEventListener('scroll', () => {
        if (!rafPending) {
            rafPending = true;
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                if (scrollBar) {
                    const docHeight = document.body.scrollHeight - window.innerHeight;
                    scrollBar.style.width = ((scrolled / docHeight) * 100) + '%';
                }
                if (heroBg && scrolled < window.innerHeight) {
                    heroBg.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;
                }
                if (pageHeader && scrolled < window.innerHeight) {
                    pageHeader.style.backgroundPositionY = `calc(50% + ${scrolled * 0.3}px)`;
                }
                rafPending = false;
            });
        }
    }, { passive: true });

    /* --- Magnetic Buttons --- */
    document.querySelectorAll('.btn, .social-icon').forEach(btn => {
        btn.classList.add('magnetic');
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.3;
            const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.3;
            this.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0px, 0px)';
            this.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        });
        btn.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.1s linear';
        });
    });

    /* --- 3D Tilt Effect --- */
    document.querySelectorAll('.about-image img, .gallery-item img, .course-card').forEach(card => {
        card.classList.add('tilt-card');
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const xRotation = -((e.clientY - rect.top - rect.height / 2) / rect.height) * 15;
            const yRotation = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 15;
            this.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            this.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        });
        card.addEventListener('mouseenter', function() { this.style.transition = 'none'; });
    });

    /* --- Floating Musical Particles (IntersectionObserver-throttled) --- */
    const notes = ['♩', '♪', '♫', '♬', '♭', '♮'];
    document.querySelectorAll('.hero, .page-header, .footer').forEach(container => {
        container.style.position = 'relative';
        container.style.overflow = 'hidden';

        let particleInterval = null;

        const createParticle = () => {
            const note = document.createElement('div');
            note.className = 'particle-note';
            note.innerText = notes[Math.floor(Math.random() * notes.length)];
            note.style.left = Math.random() * 100 + '%';
            note.style.fontSize = (Math.random() * 15 + 10) + 'px';
            note.style.opacity = Math.random() * 0.5 + 0.1;
            const duration = Math.random() * 5 + 5;
            note.style.animationDuration = duration + 's';
            container.appendChild(note);
            setTimeout(() => note.remove(), duration * 1000);
        };

        // Only run particles when container is visible
        const visibilityObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!particleInterval) particleInterval = setInterval(createParticle, 800);
                } else {
                    clearInterval(particleInterval);
                    particleInterval = null;
                }
            });
        }, { threshold: 0.1 });

        visibilityObserver.observe(container);
    });

    /* --- YouTube Facade (lazy-load iframes on click) --- */
    document.querySelectorAll('.yt-facade').forEach(facade => {
        facade.addEventListener('click', function() {
            const videoId = this.dataset.videoid;
            const title = this.dataset.title || 'YouTube video player';
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            iframe.title = title;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.setAttribute('allowfullscreen', '');
            iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none;';
            this.innerHTML = '';
            this.appendChild(iframe);
            this.style.cursor = 'default';
        });
    });

    /* --- Load More Albums (works with both facade and iframe layouts) --- */
    const videoContainers = document.querySelectorAll('.video-gallery .video-container');
    const loadMoreBtn = document.getElementById('load-more-albums');
    const loadMoreContainer = document.getElementById('load-more-container');

    if (videoContainers.length > 3 && loadMoreBtn) {
        for (let i = 3; i < videoContainers.length; i++) {
            videoContainers[i].style.display = 'none';
        }
        loadMoreBtn.addEventListener('click', () => {
            for (let i = 3; i < videoContainers.length; i++) {
                videoContainers[i].style.display = 'block';
            }
            if (loadMoreContainer) loadMoreContainer.style.display = 'none';
            if (typeof AOS !== 'undefined') setTimeout(() => AOS.refresh(), 50);
        });
    }

});

/* --- Bulletproof Mobile Menu Toggle --- */
document.addEventListener('click', function(e) {
    const btn = e.target.closest('#mobile-menu-btn');
    if (btn) {
        const menu = document.getElementById('nav-menu');
        if (menu) {
            btn.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        }
    }
    const link = e.target.closest('#nav-menu a');
    if (link) {
        const menu = document.getElementById('nav-menu');
        const menuBtn = document.getElementById('mobile-menu-btn');
        if (menu && menuBtn) {
            menuBtn.classList.remove('active');
            menu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
});
