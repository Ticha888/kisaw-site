import os
import re

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        changed = False
        
        # Find all <div class="nav-links"> and insert <a href="/">Home</a> if not present
        def replacer(match):
            div_start = match.group(1)
            whitespace = match.group(2)
            links_content = match.group(3)
            
            if '>Home<' not in links_content and '>home<' not in links_content:
                return f'{div_start}{whitespace}<a href="/">Home</a>{whitespace}{links_content}'
            return match.group(0)

        new_content = re.sub(r'(<div class="nav-links">)(\s*)(.*?</div>)', replacer, content, flags=re.DOTALL)

        if new_content != content:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated {filename}')
