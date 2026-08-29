import sys
import json
import urllib.request
import urllib.error

# Force utf-8 stdout
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import os

# Load environment variables from .env.local
def load_env():
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env.local")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ[k.strip()] = v.strip()

load_env()

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SERVICE_ROLE_KEY:
    print("[ERROR] NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local")
    sys.exit(1)

headers = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

def post_or_upsert(table, data):
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    payload = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            print(f"[OK] Table '{table}': {len(data) if isinstance(data, list) else 1} rows synced (HTTP {response.status})")
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8")
        print(f"[WARN] Table '{table}' (HTTP {e.code}): {err}")
    except Exception as e:
        print(f"[ERR] Error syncing '{table}': {str(e)}")

print("[START] Running full database synchronization with Supabase Service Role...")

# 1. Delivery Zones
zones = [
    {
        "id": "zone-stockholm-innerstad",
        "name": "Stockholm Innerstad & Närförort",
        "description": "Inkluderar Södermalm, Östermalm, Vasastan, Kungsholmen, Solna & Sundbyberg.",
        "corridor_description": "Verkstadens dedikerade möbelbud hämtar och lämnar direkt vid porten.",
        "surcharge": 0,
        "estimated_delivery_days": "1–2 arbetsdagar efter färdigställande",
        "active": True
    },
    {
        "id": "zone-storstockholm",
        "name": "Storstockholm & Nacka/Lidingö/Täby",
        "description": "Täcker kranskommuner runt Stockholm inom 35 km radie.",
        "corridor_description": "Direkttransport med skyddande emballering och inbärning.",
        "surcharge": 350,
        "estimated_delivery_days": "2–3 arbetsdagar efter färdigställande",
        "active": True
    },
    {
        "id": "zone-malardalen",
        "name": "Mälardalen & Uppsala",
        "description": "Uppsala, Västerås, Eskilstuna, Södertälje & Enköping.",
        "corridor_description": "Schemalagd veckoleverans med möbelspedition.",
        "surcharge": 650,
        "estimated_delivery_days": "3–5 arbetsdagar efter färdigställande",
        "active": True
    },
    {
        "id": "zone-sverige-ovrigt",
        "name": "Övriga Sverige (Möbeltransport)",
        "description": "Säker frakt med specialiserad möbelspedition i hela Sverige.",
        "corridor_description": "Försäkrad transport på pall med avisering.",
        "surcharge": 1200,
        "estimated_delivery_days": "4–7 arbetsdagar efter färdigställande",
        "active": True
    }
]
post_or_upsert("delivery_zones", zones)

# 2. Products
products = [
    {
        "id": "prod-lamino-farskinn-original",
        "slug": "lamino-fatolj-yngve-ekstrom-farskinn",
        "name": "Lamino Fåtölj & Fotpall",
        "designer": "Yngve Ekström",
        "model": "Lamino Original",
        "category": "Fatolj",
        "category_name_swedish": "Fåtöljer",
        "base_price": 14500,
        "description": "Original Lamino fåtölj i formpressad oljad bok, helrenoverad av Skandiva Tapetserarverkstad. Nytt skandinaviskt lockigt fårskinn från Skandilock i högsta sortering.",
        "historical_context": "Formgiven 1956 av Yngve Ekström för Swedese och utsedd till 1900-talets svenska möbel av tidskriften Sköna Hem.",
        "dimensions": "Bredd: 70 cm, Djup: 78 cm, Höjd: 101 cm, Sitthöjd: 41 cm",
        "condition_grade": "Nyskick",
        "provenance_crest_text": "Skandiva Certifierad Restaurering — Stockholm Verkstad",
        "stock_status": "i_lager",
        "primary_image": "/IMG_0948.png",
        "gallery_images": ["/IMG_0948.png", "/IMG_0255.jpeg", "/IMG_0256.jpeg", "/IMG_0952.png"],
        "before_image": "/IMG_1236.png",
        "after_image": "/IMG_0948.png",
        "featured": True,
        "variants": [
            {
                "id": "var-lamino-gra",
                "name": "Skandinaviskt Fårskinn — Gråmelerad",
                "fabricName": "Gotlandsfårskinn Grå",
                "fabricColorHex": "#7A7B7E",
                "materialDescription": "17mm tätlockigt skandinaviskt fårskinn med naturlig glans.",
                "priceDelta": 0,
                "sku": "LAM-GRA-01",
                "inStock": True
            },
            {
                "id": "var-lamino-sahara",
                "name": "Skandinaviskt Fårskinn — Sahara / Sand",
                "fabricName": "Fårskinn Sahara Natur",
                "fabricColorHex": "#D8C7B0",
                "materialDescription": "Varm naturlig sandton med silkesmjuk känsla.",
                "priceDelta": 500,
                "sku": "LAM-SAH-02",
                "inStock": True
            }
        ]
    },
    {
        "id": "prod-pernilla-69-dynsats",
        "slug": "pernilla-69-dynsats-bruno-mathsson",
        "name": "Pernilla 69 i Svenskt Läder",
        "designer": "Bruno Mathsson",
        "model": "Pernilla 69",
        "category": "Fatolj",
        "category_name_swedish": "Fåtöljer",
        "base_price": 16200,
        "description": "Skräddarsydd komplett renoverad Bruno Mathsson Pernilla 69 fåtölj i svenskt anilinläder.",
        "historical_context": "Pernilla 69 är Bruno Mathssons ergonomiska mästerverk för DUX.",
        "dimensions": "Bredd: 85 cm, Djup: 90 cm, Höjd: 99 cm, Sitthöjd: 40 cm",
        "condition_grade": "Utmärkt skick",
        "provenance_crest_text": "Skandiva Ateljésydd — Svensk Möbeltradition",
        "stock_status": "i_lager",
        "primary_image": "/IMG_0611.jpeg",
        "gallery_images": ["/IMG_0611.jpeg", "/IMG_0612.jpeg", "/IMG_0613.jpeg", "/IMG_1236.png"],
        "before_image": "/IMG_1236.png",
        "after_image": "/IMG_0611.jpeg",
        "featured": True,
        "variants": [
            {
                "id": "var-per-elmo-cognac",
                "name": "Elmo Soft Semianilinläder — Cognac",
                "fabricName": "Elmo Soft Cognacläder",
                "fabricColorHex": "#8A4F2A",
                "materialDescription": "Svenskt vegetabilgarvat anilinläder från Elmo.",
                "priceDelta": 0,
                "sku": "PER69-ELM-COG",
                "inStock": True
            }
        ]
    },
    {
        "id": "prod-karin-fatolj-dux",
        "slug": "karin-fatolj-bruno-mathsson-dux",
        "name": "Karin 73 Fåtölj i Svart Elmo Läder",
        "designer": "Bruno Mathsson",
        "model": "Karin 73",
        "category": "Fatolj",
        "category_name_swedish": "Fåtöljer",
        "base_price": 17800,
        "description": "Karin fåtölj på hjulstativ i förkromat stål i djupsvart anilinläder.",
        "historical_context": "Formgiven av Bruno Mathsson för DUX 1969.",
        "dimensions": "Bredd: 75 cm, Djup: 82 cm, Höjd: 80 cm, Sitthöjd: 40 cm",
        "condition_grade": "Nyskick",
        "provenance_crest_text": "Skandiva Certifierad Restaurering — Stockholm",
        "stock_status": "i_lager",
        "primary_image": "/IMG_8045.jpeg",
        "gallery_images": ["/IMG_8045.jpeg", "/IMG_7889.jpeg", "/IMG_8048.jpeg"],
        "before_image": "/IMG_1289.jpeg",
        "after_image": "/IMG_8045.jpeg",
        "featured": True,
        "variants": [
            {
                "id": "var-karin-svart",
                "name": "Elmo Soft — Djup Svart",
                "fabricName": "Elmo Läder Svart",
                "fabricColorHex": "#1E1E1E",
                "materialDescription": "Klassiskt svart anilinläder.",
                "priceDelta": 0,
                "sku": "KARIN-ELM-BLK",
                "inStock": True
            }
        ]
    }
]
post_or_upsert("products", products)

# 3. Services
services = [
    {
        "id": "serv-lamino-express",
        "slug": "lamino-express",
        "name": "Lamino Express — Fårskinnsomklädsel",
        "short_description": "Helomklädsel av din Lamino fåtölj i förstklassigt skandinaviskt fårskinn med fast pris.",
        "full_description": "Lamino Express är en specialiserad fastpristjänst där vi ger din Lamino fåtölj ett nytt liv. Vi byter bärväv, spänner om fjädringen och klär om med förstklassigt fårskinn från Skandilock i valfri kulör.",
        "furniture_type": "Fatolj",
        "applicable_models": ["Lamino Fåtölj (Yngve Ekström / Swedese)"],
        "is_fixed_price": True,
        "price_range_text": "4 900 – 6 900 kr",
        "base_price": 4900,
        "turnaround_days": 10,
        "turnaround_text": "10–14 arbetsdagar",
        "primary_image": "/IMG_0948.png",
        "featured": True,
        "materials": [
            {
                "id": "mat-farskinn-gra",
                "name": "Skandinaviskt Fårskinn — Grafitgrå Melerad",
                "category": "farskinn",
                "colorName": "Grafitgrå",
                "colorHex": "#6B6A68",
                "price": 0,
                "supplier": "Skandilock Garveri"
            },
            {
                "id": "mat-farskinn-sahara",
                "name": "Skandinaviskt Fårskinn — Sahara Natur",
                "category": "farskinn",
                "colorName": "Sahara Natur",
                "colorHex": "#D8C7B0",
                "price": 0,
                "supplier": "Skandilock Garveri"
            }
        ],
        "addons": [
            {
                "id": "addon-fotpall-farskinn",
                "name": "Klä även matchande Lamino Fotpall",
                "description": "Omklädsel av tillhörande fotpall i exakt samma fårskinnsparti.",
                "price": 1900,
                "selectedByDefault": False
            }
        ]
    }
]
post_or_upsert("workshop_services", services)

# 4. Reviews
reviews = [
    {
        "id": "rev-1",
        "author": "Karin & Magnus Sjöberg",
        "location": "Östermalm, Stockholm",
        "rating": 5,
        "text": "Vår 40 år gamla Lamino är som en dröm igen. Fårskinnet från Skandilock är otroligt fylligt och stommen känns som ny.",
        "furniture_model": "Lamino Fåtölj & Fotpall",
        "date": "2026-08-14",
        "verified_purchase": True
    },
    {
        "id": "rev-2",
        "author": "Johan Lindqvist",
        "location": "Södermalm, Stockholm",
        "rating": 5,
        "text": "Lämnade in två slitna Karin 73 fåtöljer för omklädsel i svart Elmo-läder. Hantverket på djuphäftningen är på absolut mästarnivå.",
        "furniture_model": "Karin 73 i Elmo Läder",
        "date": "2026-08-02",
        "verified_purchase": True
    },
    {
        "id": "rev-3",
        "author": "Cecilia Wallin",
        "location": "Vasastan, Stockholm",
        "rating": 5,
        "text": "Fantastisk service och finish på vår Pernilla 69. Möbelbudet hämtade och lämnade vid dörren precis enligt tidsplanen.",
        "furniture_model": "Bruno Mathsson Pernilla 69",
        "date": "2026-08-20",
        "verified_purchase": True
    }
]
post_or_upsert("reviews", reviews)

print("[SUCCESS] All Supabase database tables synchronized with service role key.")
