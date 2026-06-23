import re, os

files = ['abilka.html', 'frozenbro.html', 'boilingbrains.html', 'drwdy.html', 'skrepki.html']
for fn in files:
    if not os.path.exists(fn):
        continue
    content = open(fn, encoding='utf-8').read()
    # Find <div id="lore" ... > and extract everything inside until its matching closing div or end of section
    # Let's search for '<div id="lore"' and print the next 2000 chars or find all strategy-title and strategy-text
    print(f"\n=================== {fn} ===================")
    titles = re.findall(r'<h3 class="strategy-title"[^>]*>(.*?)</h3>', content, flags=re.DOTALL)
    texts = re.findall(r'<div class="strategy-text"[^>]*>(.*?)</div>', content, flags=re.DOTALL)
    subtitles = re.findall(r'<p class="strategy-subtitle"[^>]*>(.*?)</p>', content, flags=re.DOTALL)
    
    print("Titles:", [t.strip() for t in titles])
    print("Texts count:", len(texts))
    for i, t in enumerate(texts[:5]):
        print(f"  Text {i+1}: {t.strip()[:100]}...")
    print("Subtitles:", [s.strip() for s in subtitles])
