import json
import os
import re
import unicodedata
import urllib.error
import urllib.request


def load_env():
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env.local")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    os.environ[key.strip()] = value.strip()


load_env()

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SERVICE_ROLE_KEY:
    raise SystemExit("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local")

HEADERS = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value)
    value = value.encode("ascii", "ignore").decode("ascii")
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = value.strip("-")
    return value or "produkt"


def product_record(
    id_value: str,
    slug_value: str,
    name: str,
    price: int,
    designer: str,
    model: str,
    category: str,
    collection: str,
    description: str,
    primary_image: str,
    featured: bool = False,
):
    return {
        "id": id_value,
        "slug": slug_value,
        "name": name,
        "designer": designer,
        "model": model,
        "category": category,
        "category_name_swedish": "Fåtöljer" if category == "Fatolj" else "Tillbehör" if category == "Tillbehor" else "Stolar",
        "collection": collection,
        "base_price": int(price),
        "description": description,
        "historical_context": f"{designer} formgav {model} som en svensk möbelklassiker och den har i årtionden återfått popularitet genom varsam restaurering och omklädsel.",
        "dimensions": "Anpassad efter originalmodell och skick.",
        "condition_grade": "Nyskick",
        "provenance_crest_text": f"Skandiva — certifierad {designer} {model} renovering",
        "stock_status": "i_lager",
        "primary_image": primary_image,
        "gallery_images": [primary_image, "/IMG_0611.jpeg", "/IMG_0948.png"],
        "material_ids": [],
        "before_image": primary_image,
        "after_image": primary_image,
        "featured": featured,
    }


PRODUCTS = [
    product_record(
        "fanins-dux-jetson-69-dakota-lader",
        "kuddsats-till-jetson-69-i-dakota-lader-dux",
        "KUDDSATS TILL JETSON 69 DUX i EXKLUSIVE LÄDER",
        9825,
        "Bruno Mathsson",
        "Jetson 69",
        "Fatolj",
        "dux",
        "Kuddsats till Jetson 69 DUX i exklusivt läder med originalkänsla, noggrant anpassad för Bruno Mathssons klassiska form.",
        "/IMG_0611.jpeg",
        True,
    ),
    product_record(
        "fanins-dux-jetson-69-flax-canvas",
        "kuddsats-till-jetson-69-dux-fatolj",
        "Kuddsats till Jetson 69 Dux flax canvas",
        6325,
        "Bruno Mathsson",
        "Jetson 69",
        "Fatolj",
        "dux",
        "Flax canvas-kudde anpassad för Jetson 69 DUX med ljus, elegant känsla och tydlig skandinavisk profil.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-omkladsel-jetson-barande-vav",
        "omkladsel-jetson-barandevav-fatolj",
        "Omklädsel Jetson (omklädsel av bärande väv)",
        5200,
        "Bruno Mathsson",
        "Jetson 69",
        "Fatolj",
        "dux",
        "Omklädsel av Jetson med bärande väv för bevarande av konstruktion, komfort och ursprunglig form.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-pernilla-69-lader",
        "kuddsats-till-pernilla-69-i-lader",
        "Kuddsats till Pernilla 69 läder",
        23800,
        "Bruno Mathsson",
        "Pernilla 69",
        "Fatolj",
        "dux",
        "Premiumkudde i läder för Pernilla 69 med noggrann passform och exklusiv finish.",
        "/IMG_0611.jpeg",
        True,
    ),
    product_record(
        "fanins-dux-pernilla-69-flax21",
        "kuddsats-till-pernilla-69-i-flax21-dakota-24",
        "Kuddsats till Pernilla 69 i Flax21 Dux",
        11900,
        "Bruno Mathsson",
        "Pernilla 69",
        "Fatolj",
        "dux",
        "Ljus och modern flax-kudde för Pernilla 69 som ger ett tidlöst och praktiskt uttryck.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-pernilla-elmo-soft",
        "kuddsats-till-pernilla-dux-i-elmo-soft-lader",
        "Kuddsats till Pernilla DUX i ELMO Soft läder",
        19900,
        "Bruno Mathsson",
        "Pernilla DUX",
        "Fatolj",
        "dux",
        "ELMO Soft kombinerar mjukhet och hållbarhet i en elegant, modern läderkudde för Pernilla DUX.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-karin-73-original-lader",
        "kuddsats-till-karin-73-i-dakota-lader",
        "Kuddsats till Karin 73 original Dux i läder",
        19500,
        "Bruno Mathsson",
        "Karin 73",
        "Fatolj",
        "dux",
        "Original DUX-läderkudde för Karin 73 med återställd komfort och autentisk svensk designkaraktär.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-karin-73-flax-canvas",
        "kuddsats-till-karin-73-flax-canvas",
        "Kuddsats till Karin 73 Flax Canvas original Dux",
        8500,
        "Bruno Mathsson",
        "Karin 73",
        "Fatolj",
        "dux",
        "Flax canvas med klassisk DUX-profil för Karin 73 i ett lättare och tidlöst utförande.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-barande-vav-karin",
        "barandevav-till-karin-fatolj",
        "Bärande väv till Karin",
        4500,
        "Bruno Mathsson",
        "Karin 73",
        "Tillbehor",
        "dux",
        "Bärande väv till Karin för att återställa struktur, styvhet och komfort i originalkonstruktionen.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-ingrid-hog-dakota-lader",
        "kuddsats-ingrid-dux-hog-dakota-lader",
        "Kuddsats Ingrid hög DUX Dakota läder",
        19500,
        "Bruno Mathsson",
        "Ingrid hög",
        "Fatolj",
        "dux",
        "Dakota-läderkudde för Ingrid hög DUX med imponerande finish, komfort och ett vackert naturligt uttryck.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-ingrid-hog-dakota-lader-version-2",
        "kuddsats-till-ingrid-hog-dakota-lader",
        "Kuddsats till Ingrid hög Dakota läder",
        12900,
        "Bruno Mathsson",
        "Ingrid hög",
        "Fatolj",
        "dux",
        "Alternativt Dakota-läder för Ingrid hög med högt hantverksvärde och gjort för lång livslängd.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-barande-vav-ingrid",
        "ingrid-fatolj-brunomathsson",
        "Bärandeväv till Ingrid fåtölj",
        3900,
        "Bruno Mathsson",
        "Ingrid",
        "Tillbehor",
        "dux",
        "Bärande väv för Ingrid fåtölj med fokus på originalstomme, funktion och hållbarhet.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-pernilla-3-dakota-metal-stomme",
        "kuddsats-pernilla-dakota-lader",
        "Omklädsel Pernilla 3 i Dakota läder (metal stomme)",
        15900,
        "Bruno Mathsson",
        "Pernilla 3",
        "Fatolj",
        "dux",
        "Dakota-läder omklädsel för Pernilla 3 med metallstomme, utförd i svensk restaureringsstil.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-pernilla-liggfatolj-farskinn",
        "omkladsel-pernilla-liggfatolj-3-i-farskinn",
        "Omklädsel Pernilla liggfåtölj i fårskinn",
        15900,
        "Bruno Mathsson",
        "Pernilla liggfåtölj",
        "Fatolj",
        "dux",
        "Pernilla liggfåtölj i fårskinn med utsökt textur, låg profil och gedigen komfort.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-pernilla-3-stol-sadelgjord",
        "omkladsel-pernilla-stol-med-sadelgjord",
        "Omklädsel Pernilla 3 stol med sadelgjord",
        13900,
        "Bruno Mathsson",
        "Pernilla 3 stol",
        "Stol",
        "dux",
        "Sadelgjordsomklädsel till Pernilla 3 stol för ett rikt, autentiskt och långvarigt uttryck.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-superspider-farskinn",
        "omkladsel-superspider-farskinn",
        "Omklädsel Superspider fåtölj",
        15900,
        "Bruno Mathsson",
        "Superspider",
        "Fatolj",
        "dux",
        "Superspider fåtölj omklädd i fårskinn med korrekt passform och bevarad originalkonstruktion.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-superspider-dakota-lader",
        "omkladsel-superspider-fatolj-dakota-lader",
        "Omklädsel Superspider fåtölj Dakota läder",
        17900,
        "Bruno Mathsson",
        "Superspider",
        "Fatolj",
        "dux",
        "Dakota-läder för Superspider fåtölj med tydlig, modern finish och vacker patina.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-superspider-dakota-lader-dux",
        "omkladsel-superspider-fatolj-dakota-lader-dux",
        "Omklädsel Superspider fåtölj Dakota läder DUX",
        25900,
        "Bruno Mathsson",
        "Superspider DUX",
        "Fatolj",
        "dux",
        "Premium DUX-variant av Superspider med Dakota-läder och högre grad av exklusivitet.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-barande-vav-pernilla-69",
        "barande-vav-till-dux-pernilla-69",
        "Bärande väv till DUX Pernilla 69 fåtölj",
        4720,
        "Bruno Mathsson",
        "Pernilla 69",
        "Tillbehor",
        "dux",
        "Bärande väv för DUX Pernilla 69 som återupplivar konstruktionens bärförmåga och komfort.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-dux-lagning-underredet-jetson",
        "lagning-underredet-till-jetson-copy",
        "Lagning av underredet till Jetson",
        2320,
        "Bruno Mathsson",
        "Jetson 69",
        "Tillbehor",
        "dux",
        "Reparation och lagning av underredet till Jetson för att återställa styvhet och funktion.",
        "/IMG_0611.jpeg",
        False,
    ),
    product_record(
        "fanins-lamino-omkladsel-fatolj",
        "omkladsel-av-lamino-fatolj-fanins-mobelverkstad",
        "Omklädsel av lamino fåtölj",
        3900,
        "Yngve Ekström",
        "Lamino",
        "Fatolj",
        "lamino",
        "Specialiserad omklädsel av Lamino-fåtölj i premiumfårskinn, byggd för lång livslängd och klassisk estetik.",
        "/IMG_0948.png",
        True,
    ),
]


def upsert_products():
    for product in PRODUCTS:
        url = f"{SUPABASE_URL}/rest/v1/products"
        payload = json.dumps(product).encode("utf-8")
        request = urllib.request.Request(url, data=payload, headers=HEADERS, method="POST")
        try:
            with urllib.request.urlopen(request) as response:
                print(f"[OK] {product['name']} -> HTTP {response.status}")
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            print(f"[WARN] {product['name']} -> HTTP {exc.code} :: {body}")
        except Exception as exc:
            print(f"[ERR] {product['name']} -> {exc}")


if __name__ == "__main__":
    upsert_products()
    print(f"[SUMMARY] Seeded {len(PRODUCTS)} products from fanins.se DUX + Lamino into Supabase.")
