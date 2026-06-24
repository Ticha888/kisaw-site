import re

CYRILLIC_WORDS = [
    'в', 'на', 'под', 'над', 'из', 'с', 'к', 'у', 'о', 'об', 'от', 'до', 'за', 'по', 
    'и', 'а', 'но', 'да', 'или', 'не', 'ни', 'что', 'как', 'где', 'там', 'для', 'со', 'ко', 'во', 'я', 'он', 'мы', 'вы', 'же', 'бы', 'ли'
]

def fix_prepositions(content):
    # Match start of string or non-word character, then preposition, then one or more spaces, followed by word char or tag
    pattern = r'(?i)(^|[^А-Яа-яЁёA-Za-z0-9])(' + '|'.join(CYRILLIC_WORDS) + r')\s+(?=[А-Яа-яЁёa-zA-Z0-9<])'
    return re.sub(pattern, r'\1\2&nbsp;', content)

files_to_fix = ['nika-ru.html', 'pizhma_translations.py']

for filepath in files_to_fix:
    print(f"Processing {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    fixed_content = fix_prepositions(content)
    # run it a second time in case of overlapping matches like "и в "
    fixed_content = fix_prepositions(fixed_content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(fixed_content)

print("Done fixing prepositions!")
