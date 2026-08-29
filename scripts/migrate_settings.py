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

default_settings = [
    {
        "id": "main",
        "company_name": "Skandiva Tapetserarverkstad AB",
        "org_number": "559281-3942",
        "phone": "08-640 22 90",
        "email": "kontakt@skandiva.se",
        "address": "Åsögatan 142, 116 24 Södermalm, Stockholm",
        "opening_hours": "Mån–Fre: 08:30 – 17:00 • Lör: Enligt tidsbokning",
        "whatsapp_number": "+4686402290",
        "hero_headline": "Ge nytt liv åt svenska designklassiker.",
        "hero_subtitle": "Professionell omklädsel och restaurering av Lamino, Bruno Mathsson och DUX — utförd för hand på Södermalm med originalfårskinn från Skandilock och 5 års garanti.",
        "hero_badge": "Stockholms Mästare i Möbelrestaurering sedan 2018",
        "hero_image": "/IMG_0948.png",
        "lamino_title": "LAMINO — OMKLÄDSEL MEST ÄLSKADE FÅTÖLJ",
        "lamino_description": "Ge din klassiska Lamino-fåtölj ett nytt sekel med Skandivas Lamino Express-tjänst. Vi byter bärväv, spänner om konstruktionen och klär om med förstklassigt fårskinn från Skandilock i valfri kulör.",
        "lamino_price": 4900,
        "lamino_image": "/IMG_0948.png",
        "before_after_title": "Se förvandlingen från sliten klassiker till nyskick.",
        "before_after_description": "Dra i reglaget för att se hur en 50 år gammal designikon återfår sin ursprungliga spänst, komfort och skönhet i händerna på våra tapetserare.",
        "b2b_title": "Ska ni renovera 5+ möbler för ert kontor?",
        "b2b_description": "Vi hjälper företag och inredningsarkitekter med cirkulär renovering. Vi hämtar, renoverar och återlämnar med miljödeklaration för ert hållbarhetsarbete."
    }
]

url = f"{SUPABASE_URL}/rest/v1/site_settings"
payload = json.dumps(default_settings).encode("utf-8")
req = urllib.request.Request(url, data=payload, headers=headers, method="POST")

try:
    with urllib.request.urlopen(req) as response:
        print(f"[OK] Successfully initialized site_settings table in Supabase (HTTP {response.status})")
except urllib.error.HTTPError as e:
    err_body = e.read().decode("utf-8")
    print(f"[WARN] site_settings HTTP {e.code}: {err_body}")
except Exception as e:
    print(f"[ERR] Error initializing site_settings: {str(e)}")
