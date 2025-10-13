let isProgrammaticScrolling = false;
async function loadSiteConfig() {
    try {
        const response = await fetch('base.json');
        const config = await response.json();
        renderSite(config);
    } catch (error) {
        console.error('Error loading site config:', error);
    }
}

function renderSite(config) {
    // Set favicon
    if (config.fav) {
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = config.fav;
        document.head.appendChild(favicon);
    }

    // Set document title
    document.getElementById('site-title').textContent = config.title;

    // Apply semantic theme
    document.documentElement.style.setProperty('--color-bg-primary', config.theme.colors.bgPrimary);
    document.documentElement.style.setProperty('--color-bg-secondary', config.theme.colors.bgSecondary);

    document.documentElement.style.setProperty('--color-text-logo', config.theme.colors.textLogo);
    document.documentElement.style.setProperty('--color-text-nav', config.theme.colors.textNav);
    document.documentElement.style.setProperty('--color-text-primary', config.theme.colors.textPrimary);
    document.documentElement.style.setProperty('--color-text-secondary', config.theme.colors.textSecondary);

    document.documentElement.style.setProperty('--color-border', config.theme.colors.border);
    document.documentElement.style.setProperty('--color-input-bg', config.theme.colors.inputBg);
    document.documentElement.style.setProperty('--color-placeholder', config.theme.colors.placeholder);

    document.documentElement.style.setProperty('--color-mobile-nav', config.theme.colors.mobileNav);
    document.documentElement.style.setProperty('--color-mobile-nav-border', config.theme.colors.mobileNavBorder);

    document.documentElement.style.setProperty('--color-accent-primary', config.theme.colors.accentPrimary);
    document.documentElement.style.setProperty('--color-accent-secondary', config.theme.colors.accentSecondary);
    document.documentElement.style.setProperty('--color-accent-gradient', config.theme.colors.accentGradient);

    document.documentElement.style.setProperty('--color-button-bg', config.theme.colors.buttonBg);
    document.documentElement.style.setProperty('--color-button-text', config.theme.colors.buttonText);
    document.documentElement.style.setProperty('--color-button-hover-border', config.theme.colors.buttonHoverBorder);

    document.documentElement.style.setProperty('--color-link', config.theme.colors.link);
    document.documentElement.style.setProperty('--color-link-hover', config.theme.colors.linkHover);

    document.documentElement.style.setProperty('--color-error-bg', config.theme.colors.errorBg);
    document.documentElement.style.setProperty('--color-error-text', config.theme.colors.errorText);
    document.documentElement.style.setProperty('--color-error-border', config.theme.colors.errorBorder);

    document.documentElement.style.setProperty('--color-overlay', config.theme.colors.overlay);
    document.documentElement.style.setProperty('--color-overlay-opacity', config.theme.colors.overlayOpacity);
    document.documentElement.style.setProperty('--color-overlay-blocks', config.theme.colors.overlayBlocks);

    // Fonts
    document.documentElement.style.setProperty('--main-font', config.theme.fonts.main);
    document.documentElement.style.setProperty('--heading-font', config.theme.fonts.heading);
    document.documentElement.style.setProperty('--heading-font-weight', config.theme.fonts.headingWeight);
    
    // Load custom fonts if available
    if (config.theme.fonts.files && Array.isArray(config.theme.fonts.files)) {
        config.theme.fonts.files.forEach(font => {
            const fontFace = new FontFace(
                font.name,
                `url(${font.path}) format('${font.format || 'woff2'}')`,
                {
                    weight: font.weight || 'normal',
                    style: font.style || 'normal',
                }
            );
            fontFace.load().then(loadedFace => {
                document.fonts.add(loadedFace);
                console.log(`Loaded custom font: ${font.name}`);
            }).catch(err => console.error('Error loading font:', err));
        });
    }

    // Set header title
    document.getElementById('header-content').querySelector('h2').textContent = config.title;

    // Render navigation links
    const navLinks = document.getElementById('nav-links');
    navLinks.innerHTML = config.pages.map(page => 
        `<a href="#${page.name.toLowerCase().replace(/\s+/g, '-')}" onclick="smoothScroll(event, '${page.name.toLowerCase().replace(/\s+/g, '-')}')" ${page.name === 'Home' ? 'class="active"' : ''}>${page.name}</a>`
    ).join('');

    document.getElementById('mobile-title').textContent = config.title;

    const mobileNavLinks = document.getElementById('mobile-nav-links');
    mobileNavLinks.innerHTML = config.pages.map(page => 
        `<a href="#${page.name.toLowerCase().replace(/\s+/g, '-')}" onclick="smoothScroll(event, '${page.name.toLowerCase().replace(/\s+/g, '-')}')" ${page.name === 'Home' ? 'class="active"' : ''}>${page.name}</a>`
    ).join('');

    // Render pages
    const contentDiv = document.getElementById('content');
    config.pages.forEach(page => {
        const section = document.createElement('div');
        section.id = page.name.toLowerCase().replace(/\s+/g, '-');
        section.style.background = page.background || 'var(--main-color, #000000)';

        if (page.type === 'main') {
            section.style.backgroundSize = 'cover';
            section.style.backgroundPosition = 'center';
            section.style.backgroundRepeat = 'no-repeat';

            section.className = 'main-section';
            section.innerHTML = `
                <div class="elementor-background-overlay"></div>
                <div class="content-wrapper">
                    <h1>${page.title}</h1>
                    <p>${page.text}</p>
                    <div class="buttons">
                        ${Array.isArray(page.buttons) ? page.buttons.map(button => 
                            `<button onclick="smoothScroll(event, '${button.link.toLowerCase().replace(/\s+/g, '-')}')">${button.name}</button>`
                        ).join('') : `<button onclick="smoothScroll(event, '${page.buttons.link.toLowerCase().replace(/\s+/g, '-')}')">${page.buttons.name}</button>`}
                    </div>
                </div>
            `;
        } else if (page.type === 'blocks') {
            section.style.backgroundPosition = 'top center';
            section.className = `blocks-section subtype-${page.subtype || 2}`;
            section.innerHTML = `
                <div class="elementor-background-overlay"></div>
                ${page.text && Array.isArray(page.text) ? `
                    <div class="intro">
                        ${page.text.map(text => `
                            <div class="intro-item">
                                <h3>${text.title}</h3>
                                <p>${text.text}</p>
                            </div>
                        `).join('')}
                    </div>` : page.text ? `
                    <div class="intro">
                        <h3>${page.text.title}</h3>
                        <p>${page.text.text}</p>
                    </div>` : ''
                }
                <div class="list">
                    ${page.blocks.map(block => `
                        <div class="block">
                            ${block.imageURL ? `<img src="${block.imageURL}" alt="${block.title}">` : ''}
                            <div>
                                <h3>${block.title}</h3>
                                <p>${Array.isArray(block.text) ? block.text.map(text => `<span>${text}</span>`).join('<br>') : `<span>${block.text}</span>`}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (page.type === 'text-image') {
            section.className = 'text-image-section';
            section.innerHTML = `
                <div class="elementor-background-overlay"></div>
                <div class="text-image-container">
                    <div class="text-area">
                        <span>${page.subtitle || ''}</span>
                        <h2>${page.title}</h2>
                        ${Array.isArray(page.text) ? page.text.map(text => `<p>${text}</p>`).join('') : `<p>${page.text}</p>`}
                    </div>
                    ${page.imageURL ? `<img src="${page.imageURL}" alt="${page.title}">` : ''}
                </div>
            `;
        } else if (page.type === 'text') {
            section.style.backgroundSize = 'cover';
            section.style.backgroundPosition = 'center';
            section.style.backgroundRepeat = 'no-repeat';
            section.className = 'text-section';
            section.innerHTML = `
                <div class="elementor-background-overlay"></div>
                <div class="quote-container">
                ${page.quotes ? `
                    <div class="quote">
                        ${Array.isArray(page.quotes) ? 
                            page.quotes.map(quote => 
                                `<blockquote><p>${quote}</p></blockquote>`
                            ).join('') : `
                            <blockquote><p>${page.quotes}</p></blockquote>`
                        }
                    </div>
                ` : ''}
                </div>
                <div class="text-container">
                    <div class="title-area">
                        <span>${page.subtitle}</span>
                        <h2>${page.title}</h2>
                    </div>
                    <div class="text-area">
                        ${Array.isArray(page.text) ? page.text.map(text => `<p>${text}</p>`).join('') : `<p>${page.text}</p>`}
                    </div>

                </div>
            `;
        } else if (page.type === 'contact') {
            section.className = 'contact-section';
            section.innerHTML = `
                <div class="data-area">
                    <div class="image-area" style="background-image: url('${page.imageURL}');"></div>
                    <div class="form-area">
                        <span>${page.textSmall}</span>
                        <h3>${page.textBig}</h3>
                        <div class="form-group">
                            <input type="text" placeholder="Your name*" required>
                        </div>
                        <div class="form-group">
                            <input type="email" placeholder="Your mail*" required>
                        </div>
                        <div class="form-group">
                            <input type="tel" placeholder="Phone*" required>
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Message"></textarea>
                        </div>
                        <button>  
                            <img src="${page.buttonIcon}" alt="Send Icon" class="button-icon">
                            Send
                        </button>
                        <p>This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.</p>
                    </div>
                </div>
                <footer>
                    <div class="footer-content">
                        <div class="address">
                            <span>Registered office address:</span>
                            <p>${page.footer.address}</p>
                        </div>
                        <div class="media">
                            ${page.footer.links.map(link => `
                                <a href="https://${link.link}" target="_blank" class="social-link">
                                    <img src="${link.icon}" alt="${link.name} icon" class="social-icon">
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </footer>
            `;
        }
        contentDiv.appendChild(section);
    });
    setupFixedNavDots();
    setupSectionScrolling();
    setupContactForm(config);
}

function smoothScroll(event, target) {
    event.preventDefault();
    const section = document.querySelector(`#${target}`);
    section.scrollIntoView();

    document.querySelectorAll('.fixed-header nav a').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('#content > div').forEach(sec => sec.classList.remove('active'));

    event.target.classList.add('active');
    section.classList.add('active');

    isProgrammaticScrolling = true;
    setTimeout(() => { isProgrammaticScrolling = false; }, 1200);
}

function setupSectionScrolling() {
    const sections = [...document.querySelectorAll('#content > div')];
    const navLinks = [...document.querySelectorAll('#nav-links a')];
    let currentIndex = 0;
    function goToSection(index) {
        if (isProgrammaticScrolling) return;
        isProgrammaticScrolling = true;

        if (index < 0) index = 0;
        if (index >= sections.length) index = 0;    

        currentIndex = index;
        sections[index].scrollIntoView({ behavior: 'smooth' });

        // update nav active
        navLinks.forEach(link => link.classList.remove('active'));
        sections.forEach(sec => sec.classList.remove('active'));

        navLinks[index].classList.add('active');
        sections[index].classList.add('active');


        setTimeout(() => { isProgrammaticScrolling = false }, 1200);
    }

    // Listen for wheel scroll
    document.addEventListener('wheel', (e) => {
        if (isProgrammaticScrolling) return;
        if (e.deltaY > 0) {
            goToSection(currentIndex + 1);
        } else if (e.deltaY < 0) {
            goToSection(currentIndex - 1);
        }
    });

    window.addEventListener('resize', () => {
        const activeSection = document.querySelector('#content > div.active');
        if (!activeSection) return;

        if (isProgrammaticScrolling) return;
        isProgrammaticScrolling = true;

        activeSection.scrollIntoView({ behavior: 'auto' });

        setTimeout(() => {
            isProgrammaticScrolling = false;
        }, 300);
    });

    goToSection(0);

}

function setupContactForm(config) {
    const contactSection = document.querySelector('.contact-section');
    if (!contactSection) return;

    const requiredInputs = contactSection.querySelectorAll('input[required], textarea[required]');
    const button = contactSection.querySelector('button');

    // Create error message element
    let errorMessage = contactSection.querySelector('.form-error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'form-error-message';
        
        button.insertAdjacentElement('afterend', errorMessage);
    }

    button.addEventListener('click', (e) => {
        e.preventDefault(); // prevent default form submission
        let hasError = false;

        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'red';
                hasError = true;
            } else {
                input.style.borderColor = ''; // reset if valid
            }
        });

        if (hasError) {
            errorMessage.style.display = "block";
            errorMessage.textContent = 'One or more fields have an error. Please check and try again.';
            return;
        } else {
            errorMessage.style.display = "none";
            errorMessage.textContent = '';
        }

        const contactPage = config.pages.find(page => page.type === 'contact');
        const contactEmail = contactPage && contactPage.email ? contactPage.email : 'default@example.com'; // Fallback email

        // Construct mailto link
        const name = contactSection.querySelector('input[type="text"]').value.trim();
        const email = contactSection.querySelector('input[type="email"]').value.trim();
        const phone = contactSection.querySelector('input[type="tel"]').value.trim();
        const message = contactSection.querySelector('textarea').value.trim();

        const subject = encodeURIComponent("Contact Form Submission");
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
        );
        const mailtoLink = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

        window.location.href = mailtoLink;
    });
}

function setupFixedNavDots() {
    const sections = [...document.querySelectorAll('#content > div')];
    const navList = document.querySelector('#fp-nav ul');
    const navLinks = [...document.querySelectorAll('#nav-links a')];

    navList.innerHTML = sections.map((sec, index) => `
        <li>
            <a href="#" data-index="${index}">
                <span></span>
            </a>
        </li>
    `).join('');

    const navDots = [...navList.querySelectorAll('a')];


    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const index = parseInt(dot.dataset.index);
            sections[index].scrollIntoView({ behavior: 'smooth' });

            navDots.forEach(d => d.classList.remove('active'));
            navLinks.forEach(link => link.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));
            navDots[index].classList.add('active');
            navLinks[index].classList.add('active');
            sections[index].classList.add('active');

            // Start programmatic scroll
            isProgrammaticScrolling = true;
            sections[index].scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => { isProgrammaticScrolling = false; }, 1200);
        });
    });

    // Update active dot on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollPos = window.scrollY + window.innerHeight / 2;
                sections.forEach((sec, i) => {
                    const offsetTop = sec.offsetTop;
                    const offsetBottom = offsetTop + sec.offsetHeight;
                    if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
                        navDots.forEach(d => d.classList.remove('active'));
                        navDots[i].classList.add('active');
                    

                        if (isProgrammaticScrolling) return;

                        navLinks.forEach(link => link.classList.remove('active'));
                        sections.forEach(sec => sec.classList.remove('active'));

                        navLinks[i].classList.add('active');
                        sections[i].classList.add('active');
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
        
    });

    // Initialize first active
    navDots[0].classList.add('active');

    
}

function setupMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    mobileNav.classList.toggle("open");
  });

  // close nav when link clicked
  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      toggle.classList.remove("active");
      mobileNav.classList.remove("open");
    });
  });
}

window.onload = () => {
  loadSiteConfig();
  setupMobileNav();
};
