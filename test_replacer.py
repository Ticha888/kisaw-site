import re

html = """
<div class="strategy-text">
    Frozen Bro reached out to me in 2023 for a systematic branding project. They
    already
    had a frozen product line.
</div>
"""

search = "Frozen Bro reached out to me in 2023 for a systematic branding project. They already had a frozen product line."

# Normalize search string spaces
def make_regex(text):
    words = text.split()
    pattern = r'\s*'.join(re.escape(w) for w in words)
    return pattern

regex = make_regex(search)
print("Regex:", regex)

match = re.search(regex, html, flags=re.DOTALL)
if match:
    print("MATCH FOUND!")
    # Replace it with span structure
    replacement = f'<span class="lang-en">{match.group(0)}</span><span class="lang-ru">RU VERSION</span>'
    new_html = html.replace(match.group(0), replacement)
    print("New HTML:", new_html)
else:
    print("NO MATCH")
