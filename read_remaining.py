import re
for fn in ['frozenbro.html', 'boilingbrains.html']:
    content = open(fn, encoding='utf-8').read()
    print(f"\n=== {fn} ===")
    m = re.search(r'id="lore"[^>]*>(.*?)(</div>\s*</main>|<!-- Look Other|</div>\s*</div>\s*</div>\s*</main>)', content, flags=re.DOTALL)
    if m:
        print(m.group(1).strip())
