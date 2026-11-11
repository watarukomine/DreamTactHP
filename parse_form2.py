import re
with open('form.html', 'r') as f:
    content = f.read()
    # Broaden regex to find field names and IDs. The data structure is like:
    # [[123456789,"Question Title",null,TYPE,[[987654321,null,0]]]
    # Let's just find "Question Title" and the number after it.
    matches = re.findall(r'\[[0-9]+,"([^"]+)",null,[0-9]+,\[\[([0-9]+),', content)
    for m in matches:
        print(f"Field Name: {m[0]}, Entry ID: entry.{m[1]}")
