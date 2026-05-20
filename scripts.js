(function () {
    'use strict';

    var SUPPORTED_LANGS = ['en', 'pt', 'es'];
    var DEFAULT_LANG = 'en';
    var contentContainer = null;
    var loadedStylesheets = {};
    var navLabels = {
        en: {
            about: 'About',
            experience: 'Experience',
            skills: 'Skills',
            certifications: 'Certifications',
            contact: 'Contact'
        },
        pt: {
            about: 'Sobre',
            experience: 'Experiencia',
            skills: 'Habilidades',
            certifications: 'Certificacoes',
            contact: 'Contato'
        },
        es: {
            about: 'Sobre Mi',
            experience: 'Experiencia',
            skills: 'Habilidades',
            certifications: 'Certificaciones',
            contact: 'Contacto'
        }
    };

    function detectLanguage() {
        var saved = localStorage.getItem('portfolio-lang');
        if (saved && SUPPORTED_LANGS.indexOf(saved) !== -1) {
            return saved;
        }
        var browser = navigator.language.slice(0, 2);
        if (SUPPORTED_LANGS.indexOf(browser) !== -1) {
            return browser;
        }
        return DEFAULT_LANG;
    }

    function loadStylesheet(href) {
        if (loadedStylesheets[href]) {
            return Promise.resolve();
        }
        return new Promise(function (resolve) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = function () {
                loadedStylesheets[href] = true;
                resolve();
            };
            link.onerror = resolve;
            document.head.appendChild(link);
        });
    }

    function loadPage(lang) {
        return new Promise(function (resolve, reject) {
            var template = document.getElementById('page-template-' + lang);
            if (!template) {
                reject(new Error('Template not found for language: ' + lang));
                return;
            }
            resolve(template.innerHTML);
        });
    }

    function updateNavigationLabels(lang) {
        var labels = navLabels[lang] || navLabels.en;
        document.querySelectorAll('[data-nav]').forEach(function (link) {
            var key = link.getAttribute('data-nav');
            if (labels[key]) {
                link.textContent = labels[key];
            }
        });
    }

    // ── Mobile menu helpers ────────────────────────────────────────────────
    function closeMobileMenu() {
        var toggle = document.querySelector('.nav-toggle');
        var navLinks = document.querySelector('.nav-links');
        if (!toggle || !navLinks) return;
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
        document.body.classList.remove('menu-open');
    }

    function initMobileMenu() {
        var toggle = document.querySelector('.nav-toggle');
        var navLinks = document.querySelector('.nav-links');
        if (!toggle || !navLinks) return;

        toggle.addEventListener('click', function () {
            var isOpen = navLinks.classList.toggle('open');
            toggle.classList.toggle('open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('menu-open', isOpen);
        });

        // Close when a nav link is tapped
        navLinks.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                closeMobileMenu();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMobileMenu();
        });
    }
    // ──────────────────────────────────────────────────────────────────────

    function setLanguage(lang) {
        if (SUPPORTED_LANGS.indexOf(lang) === -1) {
            lang = DEFAULT_LANG;
        }

        document.documentElement.setAttribute('lang', lang);
        localStorage.setItem('portfolio-lang', lang);
        updateNavigationLabels(lang);

        // Close mobile menu when language is switched
        closeMobileMenu();

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Load section styles on demand then inject page content
        loadStylesheet('./css/sections.css?v=20260520').then(function () {
            return loadPage(lang);
        }).then(function (html) {
            contentContainer.innerHTML = html;
            applyFadeIn();
            if (window.location.hash) {
                var target = document.querySelector(window.location.hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }).catch(function () {
            contentContainer.innerHTML = '<section class="hero"><div class="hero-content"><h2 class="hero-title">Content could not be loaded.</h2></div></section>';
        });
    }

    function applyFadeIn() {
        var elements = contentContainer.querySelectorAll(
            '.about, .experience, .skills, .certifications, .contact'
        );
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(function (el) {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        contentContainer = document.getElementById('page-content');

        // Mobile menu
        initMobileMenu();

        // Language switcher
        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                setLanguage(this.getAttribute('data-lang'));
            });
        });

        // Initial load
        setLanguage(detectLanguage());
    });
})();
