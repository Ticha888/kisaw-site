with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
matches = re.finditer(r'.*social.*|.*icon.*|.*gradient.*', js, re.IGNORECASE)
for m in matches:
    print(m.group(0).strip())
