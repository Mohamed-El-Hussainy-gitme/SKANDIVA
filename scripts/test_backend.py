import sys
import json
import urllib.request
import urllib.error

# Force utf-8 stdout
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

SUPABASE_URL = "https://cfrjdkpnsydyncddffsm.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcmpka3Buc3lkeW5jZGRmZnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4ODY2NTIsImV4cCI6MjEwMzQ2MjY1Mn0.nqdXoFHmgSiUBkEuKRhrN3M2OT2B5bBNXFJntOX-Z-c"

def fetch_table(table):
    url = f"{SUPABASE_URL}/rest/v1/{table}?select=*"
    req = urllib.request.Request(url, headers={"apikey": ANON_KEY, "Authorization": f"Bearer {ANON_KEY}"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print(f"[TEST PASS] Successfully queried '{table}' via Supabase Anon Key — Found {len(data)} records.")
        return data

print("[START] Verifying Live Supabase PostgreSQL Connection & Data Layer...")
products = fetch_table("products")
orders = fetch_table("orders")
services = fetch_table("workshop_services")
zones = fetch_table("delivery_zones")
reviews = fetch_table("reviews")

print(f"[VERIFY] Primary Product: {products[0]['name']} ({products[0]['base_price']} SEK)")
print(f"[VERIFY] Seeded Order: {orders[0]['order_number']} -> Customer: {orders[0]['customer_name']}")
print("[ALL TESTS PASSED] Backend database is online, authentic, and operational.")
