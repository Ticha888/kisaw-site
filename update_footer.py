import os
import re

new_footer_nav = """                        <div class="footer-nav-col">
                            <a href="about.html" class="footer-nav-link">About</a>
                            <a href="services.html" class="footer-nav-link">Services</a>
                            <a href="index.html#cases-nav" class="footer-nav-link">Cases</a>
                            <a href="privacypolicy.html" class="footer-nav-link">Privacy policy</a>
                        </div>"""

for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.html'):
            with open(f, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Use regex to find the footer-nav-col div and its contents up to the closing div
            pattern = re.compile(r'<div class="footer-nav-col">.*?</div>', re.DOTALL)
            
            if pattern.search(content):
                new_content = pattern.sub(new_footer_nav, content)
                if new_content != content:
                    with open(f, 'w', encoding='utf-8') as file:
                        file.write(new_content)
                    print(f'Updated footer in {f}')
