import re
with open('form.html', 'r') as f:
    content = f.read()
    matches = re.findall(r'\[[0-9]+,"([^"]+)",null,0,\[\[([0-9]+),', content)
    for m in matches:
        print(f"Field Name: {m[0]}, Entry ID: entry.{m[1]}")
