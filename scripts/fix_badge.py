with open("src/components/ui/Badge.tsx", "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace(
    '"Utmarkt skick": "bg-[#EAE4D9] text-wood-dark border-stone",',
    '"Utmärkt skick": "bg-[#EAE4D9] text-wood-dark border-stone",\n    "Utmarkt skick": "bg-[#EAE4D9] text-wood-dark border-stone",'
)

with open("src/components/ui/Badge.tsx", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated Badge.tsx")
