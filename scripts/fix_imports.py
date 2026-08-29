import os
content = open('src/app/page.tsx', encoding='utf-8').read()
content = content.replace(
    "import { formatSEK } from \"@/lib/store\";",
    "import { formatSEK } from \"@/lib/utils\";"
)
open('src/app/page.tsx', 'w', encoding='utf-8').write(content)
print('Fixed page.tsx import')
