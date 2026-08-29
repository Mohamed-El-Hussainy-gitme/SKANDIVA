with open("src/types/index.ts", "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace(
    'export type ConditionGrade = "Nyskick" | "Utmarkt skick" | "Gott skick" | "Vacker patina";',
    'export type ConditionGrade = "Nyskick" | "Utmärkt skick" | "Utmarkt skick" | "Gott skick" | "Vacker patina";'
)

with open("src/types/index.ts", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated types/index.ts")
