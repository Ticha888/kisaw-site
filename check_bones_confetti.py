with open('bones-confetti.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
matches = re.finditer(r'.*gradient.*|.*social.*|.*svg.*|.*behance.*|.*fill.*', js, re.IGNORECASE)
for m in matches:
    print(m.group(0).strip())
