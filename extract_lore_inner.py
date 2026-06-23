import re, os

files = ['abilka.html', 'frozenbro.html', 'boilingbrains.html', 'drwdy.html', 'skrepki.html']
for fn in files:
    if not os.path.exists(fn):
        continue
    content = open(fn, encoding='utf-8').read()
    print(f"\n=================== {fn} LORE DIV ===================")
    # Find the block from <div id="lore" to the closing div of the tab-content
    # Since the structure is:
    # <div id="lore" class="tab-content">
    #     ...
    # </div>
    # Let's search for '<div id="lore"' and grab up to the next 4000 characters, then find the matching closing div.
    match = re.search(r'<div id="lore".*?>(.*?)</div>\s*(<!--|</main>|<!-- Look Other Projects Carousel -->)', content, flags=re.DOTALL)
    if match:
        lore_inner = match.group(1)
        # Clean up inner html spacing and print a summary of text tags (h1-h6, p, div)
        print("Length:", len(lore_inner))
        # Let's extract any text inside elements
        elements = re.findall(r'<([a-zA-Z0-9]+)[^>]*>(.*?)</\1>', lore_inner, flags=re.DOTALL)
        text_elements = []
        for tag, inner in elements:
            # strip tags from inner
            text = re.sub(r'<[^>]+>', '', inner).strip()
            if text and tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'a']:
                text_elements.append((tag, text))
        print(f"Found {len(text_elements)} text elements:")
        for tag, text in text_elements[:15]:
            print(f"  <{tag}>: {text[:150]}")
    else:
        # Let's just print search results for "id=\"lore\"" and the next 1500 chars
        idx = content.find('id="lore"')
        if idx != -1:
            print(content[idx:idx+1500])
        else:
            print("No id=\"lore\" found!")
