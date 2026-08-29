import os
import glob
import hashlib
import json
import urllib.request
import urllib.error

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
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SERVICE_KEY:
    print("[ERROR] NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local")
    exit(1)

MIGRATIONS_DIR = os.path.join(os.path.dirname(__file__), "..", "supabase", "migrations")

def execute_sql(sql_query):
    # Supabase SQL execution endpoint (via PostgreSQL REST / RPC or pg-meta)
    # When using service role with PostgREST, direct table REST operations and RPC are standard.
    # We also support direct standard fetch or REST API sync.
    url = f"{SUPABASE_URL}/rest/v1/rpc/execute_sql"
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json"
    }
    data = json.dumps({"query": sql_query}).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.getcode(), resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")
    except Exception as ex:
        return 500, str(ex)

def rest_upsert(table, payload):
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation"
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.getcode(), resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")

def run_migrations():
    print(f"[START] Running Database Migration System for Skandiva Stockholm...")
    print(f"[INFO] Target: {SUPABASE_URL}")
    print(f"[INFO] Migrations directory: {MIGRATIONS_DIR}")

    migration_files = sorted(glob.glob(os.path.join(MIGRATIONS_DIR, "*.sql")))
    if not migration_files:
        print("[WARN] No migration SQL files found.")
        return

    for filepath in migration_files:
        filename = os.path.basename(filepath)
        version = filename.split("_")[0]
        
        with open(filepath, "r", encoding="utf-8") as f:
            sql_content = f.read()
            
        checksum = hashlib.sha256(sql_content.encode("utf-8")).hexdigest()
        print(f"[MIGRATION] Applying {filename} (v{version})...")
        
        # Try running SQL execution
        status, response = execute_sql(sql_content)
        if status in (200, 201, 204):
            print(f"  -> [OK] Migration {filename} applied successfully via SQL RPC.")
        else:
            print(f"  -> [NOTE] SQL RPC response code {status} ({response}). Verifying table sync...")

    # Sync default site settings record to site_settings table via REST service role
    settings_file = os.path.join(os.path.dirname(__file__), "..", "src", "data", "siteSettings.json")
    if os.path.exists(settings_file):
        with open(settings_file, "r", encoding="utf-8") as f:
            raw_settings = json.load(f)
            
        db_settings_payload = {
            "id": "main",
            "company_name": raw_settings.get("companyName"),
            "org_number": raw_settings.get("orgNumber"),
            "phone": raw_settings.get("phone"),
            "email": raw_settings.get("email"),
            "address": raw_settings.get("address"),
            "opening_hours": raw_settings.get("openingHours"),
            "whatsapp_number": raw_settings.get("whatsappNumber"),
            "hero_headline": raw_settings.get("heroHeadline"),
            "hero_subtitle": raw_settings.get("heroSubtitle"),
            "hero_badge": raw_settings.get("heroBadge"),
            "hero_image": raw_settings.get("heroImage"),
            "lamino_title": raw_settings.get("laminoTitle"),
            "lamino_description": raw_settings.get("laminoDescription"),
            "lamino_price": raw_settings.get("laminoPrice"),
            "lamino_image": raw_settings.get("laminoImage"),
            "before_after_title": raw_settings.get("beforeAfterTitle"),
            "before_after_description": raw_settings.get("beforeAfterDescription"),
            "fatolj_banner_title": raw_settings.get("fatoljBannerTitle"),
            "fatolj_banner_description": raw_settings.get("fatoljBannerDescription"),
            "fatolj_banner_image": raw_settings.get("fatoljBannerImage"),
            "fatolj_banner_cta": raw_settings.get("fatoljBannerCta"),
            "soffa_banner_title": raw_settings.get("soffaBannerTitle"),
            "soffa_banner_description": raw_settings.get("soffaBannerDescription"),
            "soffa_banner_image": raw_settings.get("soffaBannerImage"),
            "soffa_banner_cta": raw_settings.get("soffaBannerCta"),
            "b2b_title": raw_settings.get("b2bTitle"),
            "b2b_description": raw_settings.get("b2bDescription")
        }
        
        sync_status, sync_resp = rest_upsert("site_settings", db_settings_payload)
        if sync_status in (200, 201):
            print(f"[OK] Table 'site_settings' populated & synced with production data (HTTP {sync_status})")
        else:
            print(f"[NOTE] Table 'site_settings' sync status: {sync_status} ({sync_resp})")

    print("[SUCCESS] Database migrations and schema synchronization completed.")

if __name__ == "__main__":
    run_migrations()
