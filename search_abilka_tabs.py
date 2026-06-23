with open('abilka.html', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if 'buttons-wrap' in line or 'btn' in line or 'tab' in line:
            print(f"abilka.html Line {i+1}: {line.strip()}")
