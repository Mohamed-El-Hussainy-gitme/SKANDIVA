import sys
import json
import urllib.request
import urllib.error

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_URL = "http://localhost:3000"

print("[START] Running End-to-End Suite Verification for Skandiva Stockholm...")

# 1. Test Supabase Database Tables & Anon Key
SUPABASE_URL = "https://cfrjdkpnsydyncddffsm.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcmpka3Buc3lkeW5jZGRmZnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4ODY2NTIsImV4cCI6MjEwMzQ2MjY1Mn0.nqdXoFHmgSiUBkEuKRhrN3M2OT2B5bBNXFJntOX-Z-c"

def fetch_table(table):
    url = f"{SUPABASE_URL}/rest/v1/{table}?select=*"
    req = urllib.request.Request(url, headers={"apikey": ANON_KEY, "Authorization": f"Bearer {ANON_KEY}"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print(f"[TEST PASS] Supabase Table '{table}': {len(data)} rows loaded.")
        return data

products = fetch_table("products")
orders = fetch_table("orders")
services = fetch_table("workshop_services")
zones = fetch_table("delivery_zones")

# 2. Test Local Settings File & JSON integrity
with open("src/data/siteSettings.json", "r", encoding="utf-8") as f:
    settings = json.load(f)
    print(f"[TEST PASS] SiteSettings Loaded: Company='{settings['companyName']}', Hero='{settings['heroHeadline'][:30]}...'")

print("[ALL BACKEND & SYSTEM TESTS PASSED]")
