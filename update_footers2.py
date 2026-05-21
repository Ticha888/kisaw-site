import re

OLD_SOCIALS = """                            <div class="footer-socials">
                                <a href="#" class="footer-social-link" aria-label="X (Twitter)">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                                <a href="#" class="footer-social-link" aria-label="Instagram">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </a>
                                <a href="#" class="footer-social-link" aria-label="YouTube">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                                <a href="#" class="footer-social-link" aria-label="LinkedIn">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            </div>"""

NEW_SOCIALS = """                            <div class="footer-socials">
                                <a href="https://www.behance.net/kisawawaw" target="_blank" class="footer-social-link" aria-label="Behance">
                                    <img src="img/icons/mage_behance.svg" alt="Behance" width="40" height="40">
                                </a>
                                <a href="https://www.instagram.com/kisaw.design/" target="_blank" class="footer-social-link" aria-label="Instagram">
                                    <img src="img/icons/ri_instagram-fill.svg" alt="Instagram" width="40" height="40">
                                </a>
                                <a href="https://www.linkedin.com/company/kisaw-studio/" target="_blank" class="footer-social-link" aria-label="LinkedIn">
                                    <img src="img/icons/mdi_linkedin.svg" alt="LinkedIn" width="40" height="40">
                                </a>
                            </div>"""

OLD_NAV = """                        <div class="footer-nav-col">
                            <a href="about.html" class="footer-nav-link">About</a>
                            <a href="services.html" class="footer-nav-link">Services</a>
                            <a href="index.html#cases-nav" class="footer-nav-link">Cases</a>
                        </div>"""

NEW_NAV = """                        <div class="footer-nav-col">
                            <a href="about.html" class="footer-nav-link">About</a>
                            <a href="services.html" class="footer-nav-link">Services</a>
                            <a href="index.html#cases-nav" class="footer-nav-link">Cases</a>
                            <a href="privacypolicy.html" class="footer-nav-link">Privacy policy</a>
                        </div>"""

OLD_CR = """                    <div class="footer-copyright-row">
                        <span>Made by</span>
                        <a href="/" class="footer-bone-link"><img src="img/imgs_for_main/kisaw_logo_white.svg" alt="" class="footer-bone-icon"></a>
                        <span>KISAW 2026</span>
                    </div>"""

NEW_CR = """                    <div class="footer-copyright-row">
                        <span>Vibecoded by</span>
                        <a href="/" class="footer-bone-link"><img src="img/imgs_for_main/kisaw_logo_white.svg" alt="" class="footer-bone-icon"></a>
                        <span><strong>KISAW</strong> <em>2026</em></span>
                    </div>"""

files = ['abilka.html', 'drwdy.html', 'boilingbrains.html', 'skrepki.html']
for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    orig = content
    content = content.replace(OLD_SOCIALS, NEW_SOCIALS)
    content = content.replace(OLD_NAV, NEW_NAV)
    content = content.replace(OLD_CR, NEW_CR)
    if content != orig:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(content)
        print(f'Updated: {f}')
    else:
        print(f'No match found in: {f}')
