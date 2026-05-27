import os
import re

overlay_html = """                    <!-- Popup Menu -->
                    <div class="nav-overlay">
                        <nav class="nav-popup">
                            <button class="menu-close-btn" aria-label="Close Menu">
                                <img src="img/closewindow.svg" alt="Close">
                            </button>
                            <div class="nav-links">
                                <a href="about.html">About</a>
                                <a href="services.html">Services</a>
                                <a href="index.html#cases-nav">Cases</a>
                                <a href="privacypolicy.html">Privacy policy</a>
                            </div>
                            <div class="nav-socials">
                                <a href="https://www.behance.net/kisawawaw" target="_blank" class="nav-social-link" aria-label="Behance">
                                    <img src="img/icons/mage_behance.svg" alt="Behance">
                                </a>
                                <a href="https://www.instagram.com/kisaw.design/" target="_blank" class="nav-social-link" aria-label="Instagram">
                                    <img src="img/icons/ri_instagram-fill.svg" alt="Instagram">
                                </a>
                                <a href="https://www.linkedin.com/company/kisaw-studio/" target="_blank" class="nav-social-link" aria-label="LinkedIn">
                                    <img src="img/icons/mdi_linkedin.svg" alt="LinkedIn">
                                </a>
                            </div>
                            <a href="/#request-form" class="send-signal-btn-mobile">Send the Signal</a>
                        </nav>
                    </div>
"""

for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.html'):
            with open(f, 'r', encoding='utf-8') as file:
                content = file.read()
            
            if 'class="nav-overlay"' not in content and re.search(r'</header>', content):
                # Replace the LAST occurrence or any occurrence of </header> with the overlay + </header>
                content = re.sub(r'(</header>)', overlay_html + r'\1', content, count=1)
                with open(f, 'w', encoding='utf-8') as file:
                    file.write(content)
                print(f'Added nav-overlay to {f}')
