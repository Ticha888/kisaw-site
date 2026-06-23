import re, os

files = ['frozenbro.html', 'boilingbrains.html', 'drwdy.html', 'skrepki.html']
for fn in files:
    content = open(fn, encoding='utf-8').read()
    idx = content.find('id="lore"')
    if idx != -1:
        # Find closing tag of <div id="lore"
        start_content = content[idx:]
        # Find the end of this div by counting opening and closing divs
        # Or simple regex to find the matching section closing
        print(f"\n=================== {fn} LORE FULL HTML ===================")
        # Let's extract between id="lore" and the next section or container close
        m = re.search(r'id="lore"[^>]*>(.*?)(</div>\s*</main>|<!-- Look Other|</div>\s*</div>\s*</div>\s*</main>)', content, flags=re.DOTALL)
        if m:
            print(m.group(1).strip())
        else:
            print(content[idx:idx+2500])
