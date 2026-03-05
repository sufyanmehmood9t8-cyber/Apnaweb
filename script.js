document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations for text
    const revealItems = document.querySelectorAll('.hero-content > *');

    revealItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 1s cubic-bezier(0.22, 1, 0.36, 1)';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 300 + (index * 150));
    });

    // Advanced 3D tilt effect on the phone
    const phone = document.querySelector('.phone-3d');
    const heroVisual = document.querySelector('.hero-visual');

    if (heroVisual && phone) {
        heroVisual.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = heroVisual.getBoundingClientRect();

            // Calculate center-relative mouse position (-0.5 to 0.5)
            const x = (clientX - left) / width - 0.5;
            const y = (clientY - top) / height - 0.5;

            // Smoothly interpolate rotation
            // Default rotation is Y: -20, X: 10
            const rotateY = -20 + (x * 30);
            const rotateX = 10 - (y * 30);

            phone.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });

        heroVisual.addEventListener('mouseleave', () => {
            phone.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            phone.style.transform = `rotateY(-20deg) rotateX(10deg)`;

            setTimeout(() => {
                phone.style.transition = 'transform 0.1s ease-out';
            }, 600);
        });

        heroVisual.addEventListener('mouseenter', () => {
            phone.style.transition = 'transform 0.1s ease-out';
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for scroll reveals
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(el => {
        el.classList.add('reveal-init');
        observer.observe(el);
    });

    // Add CSS for reveal-init state if not already in CSS file
    const revealStyle = document.createElement('style');
    revealStyle.textContent = `
        .reveal-init {
            opacity: 0;
            transform: translateY(40px);
            transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .reveal-init.active {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(revealStyle);
    // Login Form Logic
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginSubmitBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const firstNameInput = document.getElementById('firstName');
            const lastNameInput = document.getElementById('lastName');
            const emailInput = document.getElementById('email');

            const firstName = firstNameInput ? firstNameInput.value : 'Guest';
            const lastName = lastNameInput ? lastNameInput.value : '';
            const email = emailInput ? emailInput.value : '';

            // Show loading state
            if (loginBtn) loginBtn.classList.add('loading');

            // Simulate API call
            setTimeout(() => {
                const userData = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email || "sufyan@example.com",
                    isLoggedIn: true
                };

                localStorage.setItem('sufyan_user', JSON.stringify(userData));

                // Redirect to home
                window.location.href = 'index.html';
            }, 2000);
        });
    }

    // User Display Logic
    const updateUIForUser = () => {
        const userDataStr = localStorage.getItem('sufyan_user');
        const userInfos = document.querySelectorAll('.user-info');

        if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            if (userData.isLoggedIn) {
                userInfos.forEach(userInfo => {
                    const nameEl = userInfo.querySelector('.user-name');
                    const emailEl = userInfo.querySelector('.user-email');
                    const avatarEl = userInfo.querySelector('.user-avatar');
                    const initialsEl = userInfo.querySelector('#initialsText');

                    if (nameEl) nameEl.textContent = `${userData.firstName} ${userData.lastName}`;
                    if (emailEl) emailEl.textContent = userData.email;

                    // Display stored profile image if available
                    if (avatarEl) {
                        let img = avatarEl.querySelector('img');
                        if (userData.profilePic) {
                            if (initialsEl) initialsEl.style.display = 'none';
                            if (!img) {
                                img = document.createElement('img');
                                avatarEl.appendChild(img);
                            }
                            img.src = userData.profilePic;
                        } else {
                            if (initialsEl) {
                                initialsEl.style.display = 'block';
                                initialsEl.textContent = userData.firstName.charAt(0).toUpperCase();
                            }
                            if (img) img.remove();
                        }
                    }

                    userInfo.classList.add('logged-in');

                    // Setup profile picture upload per header instance
                    const avatarInput = userInfo.querySelector('#avatarInput');
                    if (avatarEl && avatarInput && !avatarEl.dataset.listenerAdded) {
                        avatarEl.addEventListener('click', () => avatarInput.click());
                        avatarInput.addEventListener('change', (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    const dataUrl = event.target.result;
                                    userData.profilePic = dataUrl;
                                    localStorage.setItem('sufyan_user', JSON.stringify(userData));
                                    updateUIForUser(); // Refresh UI site-wide
                                };
                                reader.readAsDataURL(file);
                            }
                        });
                        avatarEl.dataset.listenerAdded = "true";
                    }
                });
            }
        }
    };

    const logoutBtns = document.querySelectorAll('#logoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('sufyan_user');
            window.location.reload();
        });
    });

    updateUIForUser();

    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-theme');

            const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('portfolio-theme', currentTheme);
        });
    }
});


