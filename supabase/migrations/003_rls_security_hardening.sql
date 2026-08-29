-- ============================================================
-- Migration 003: RLS Security Hardening & Zero Public Writes
-- Project: Skandiva Tapetserarverkstad Stockholm
-- ============================================================

-- Enable RLS on all tables
alter table delivery_zones enable row level security;
alter table products enable row level security;
alter table workshop_services enable row level security;
alter table orders enable row level security;
alter table quote_requests enable row level security;
alter table reviews enable row level security;
alter table site_settings enable row level security;

-- Drop obsolete or loose policies if they exist
drop policy if exists "Allow public read for products" on products;
drop policy if exists "Allow public read for services" on workshop_services;
drop policy if exists "Allow public read for delivery_zones" on delivery_zones;
drop policy if exists "Allow public read for reviews" on reviews;
drop policy if exists "Allow public read for site_settings" on site_settings;
drop policy if exists "Allow public tracking of orders" on orders;
drop policy if exists "Allow public insert orders" on orders;
drop policy if exists "Allow public insert quotes" on quote_requests;
drop policy if exists "Allow full access for service_role products" on products;
drop policy if exists "Allow full access for service_role orders" on orders;
drop policy if exists "Allow full access for service_role quotes" on quote_requests;

-- 1. Strict Public Read Policies (SELECT only)
create policy "public_read_products" on products for select using (true);
create policy "public_read_workshop_services" on workshop_services for select using (true);
create policy "public_read_delivery_zones" on delivery_zones for select using (true);
create policy "public_read_reviews" on reviews for select using (true);
create policy "public_read_site_settings" on site_settings for select using (true);
create policy "public_read_order_tracking" on orders for select using (true);

-- 2. Privileged Service Role Policies (ALL operations)
create policy "service_role_all_products" on products for all to service_role using (true) with check (true);
create policy "service_role_all_services" on workshop_services for all to service_role using (true) with check (true);
create policy "service_role_all_zones" on delivery_zones for all to service_role using (true) with check (true);
create policy "service_role_all_orders" on orders for all to service_role using (true) with check (true);
create policy "service_role_all_quotes" on quote_requests for all to service_role using (true) with check (true);
create policy "service_role_all_reviews" on reviews for all to service_role using (true) with check (true);
create policy "service_role_all_settings" on site_settings for all to service_role using (true) with check (true);
