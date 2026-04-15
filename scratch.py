import re

file_path = r'c:\Users\user\Desktop\kisaw-site\services.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'<svg width="22" height="22" viewBox="0 0 24 24" fill="none"[\s\S]*?</svg>'
new_svg = '''<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.66602 15.0001L14.9993 1.66675M14.9993 1.66675H1.66602M14.9993 1.66675V15.0001" stroke="#007EFA" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>'''

new_content = re.sub(pattern, new_svg, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Done replacing SVGs.')
