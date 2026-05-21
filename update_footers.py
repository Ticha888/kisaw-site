import os
import re

files_to_update = ['skrepki.html', 'drwdy.html', 'boilingbrains.html', 'frozenbro.html']

new_footer_html = """                <footer class="new-site-footer">
                    <div class="footer-main-row">
                        <div class="footer-brand-col">
                            <div class="footer-brand-logo"><a href="/" class="footer-animated-bone-link"><img src="img/bone white.svg" alt="KISAW Logo" class="footer-animated-bone"></a>
                            </div>
                            <div class="footer-socials">
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
                            </div>
                            <a href="mailto:hello@kisaw.studio" class="footer-email">hello@kisaw.studio</a>
                        </div>
                        <div class="footer-nav-col">
                            <a href="about.html" class="footer-nav-link">About</a>
                            <a href="services.html" class="footer-nav-link">Services</a>
                            <a href="index.html#cases-nav" class="footer-nav-link">Cases</a>
                        </div>
                    </div>
                    <div class="footer-copyright-row">
                        <span>Made by</span>
                        <a href="/" class="footer-bone-link"><img src="img/imgs_for_main/kisaw_logo_white.svg" alt="" class="footer-bone-icon"></a>
                        <span>KISAW 2026</span>
                    </div>
                </footer>"""

for filename in files_to_update:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace footer
    content = re.sub(r'<footer class="new-site-footer">.*?</footer>', new_footer_html, content, flags=re.DOTALL)

    # Make sure .other-projects-section has the width rules
    if '.other-projects-section' in content:
        content = re.sub(
            r'(\.other-projects-section\s*\{[^}]*?background-color:\s*#1E1E1E\s*!important;)[^}]*?\}',
            r'\1\n            width: calc(100% + 160px) !important;\n            max-width: none !important;\n            margin-left: -80px !important;\n            margin-right: -80px !important;\n        }',
            content, flags=re.DOTALL
        )

    # Make sure .request-form-section has the width rules
    if '.request-form-section' in content:
        content = re.sub(
            r'(\.request-form-section\s*\{[^}]*?border-radius:\s*0\s*!important;)[^}]*?\}',
            r'\1\n            width: calc(100% + 160px) !important;\n            margin-left: -80px !important;\n            margin-right: -80px !important;\n        }',
            content, flags=re.DOTALL
        )

    # Ensure .new-site-footer exists in style and has the rules
    if '.new-site-footer {' in content:
        content = re.sub(
            r'\.new-site-footer\s*\{[^}]*?\}',
            r'.new-site-footer {\n            margin-top: 0 !important;\n            border-radius: 0 !important;\n            padding: 80px !important;\n            width: calc(100% + 160px) !important;\n            margin-left: -80px !important;\n            margin-right: -80px !important;\n            background-color: #1E1E1E !important;\n        }',
            content, flags=re.DOTALL
        )
    else:
        # Inject it before </style>
        content = content.replace('</style>', 
"""        .new-site-footer {
            margin-top: 0 !important;
            border-radius: 0 !important;
            padding: 80px !important;
            width: calc(100% + 160px) !important;
            margin-left: -80px !important;
            margin-right: -80px !important;
            background-color: #1E1E1E !important;
        }
    </style>""")

    # Clean up any potential double insertions of the width rules
    content = re.sub(r'(width:\s*calc\(100%\s*\+\s*160px\)\s*!important;\s*)+', r'width: calc(100% + 160px) !important;\n            ', content)
    content = re.sub(r'(margin-left:\s*-80px\s*!important;\s*)+', r'margin-left: -80px !important;\n            ', content)
    content = re.sub(r'(margin-right:\s*-80px\s*!important;\s*)+', r'margin-right: -80px !important;\n            ', content)
    content = re.sub(r'(max-width:\s*none\s*!important;\s*)+', r'max-width: none !important;\n            ', content)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated all footers and CSS.")
