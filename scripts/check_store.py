with open("src/lib/store.ts", "r", encoding="utf-8") as f:
    code = f.read()

# check formatSEK export
if "export" in code and "formatSEK" in code:
    print("formatSEK is exported")
    # print context
    idx = code.index("formatSEK")
    print(code[max(0,idx-100):idx+200])
else:
    print("NOT exported or missing!")
