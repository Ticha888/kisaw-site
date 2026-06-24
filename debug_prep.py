import re

content = "Я родилась в Москве, сейчас живу в Черногории и работаю удаленно как на русском, так и на английском языке."
CYRILLIC_WORDS = ['в', 'на', 'под', 'и', 'как', 'так']

pattern = r'(?i)(^|[^А-Яа-яЁёA-Za-z0-9])(' + '|'.join(CYRILLIC_WORDS) + r')\s+(?=[А-Яа-яЁёa-zA-Z0-9<])'

def rep(m):
    print("MATCHED:", repr(m.group(0)))
    return m.group(1) + m.group(2) + "&nbsp;"

res = re.sub(pattern, rep, content)
print("RESULT:", res)
