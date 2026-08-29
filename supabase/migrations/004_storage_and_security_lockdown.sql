-- ============================================================
-- Migration 004: Storage Bucket, Performance Indexes & RLS Lockdown
-- Project: Skandiva Tapetserarverkstad Stockholm
-- ============================================================

-- 1. Storage Bucket Creation (Media for Products & CMS)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Storage Policies for 'media' bucket
drop policy if exists "Public Access to Media Bucket" on storage.objects;
drop policy if exists "Service Role Full Access to Media Bucket" on storage.objects;

create policy "Public Access to Media Bucket"
  on storage.objects for select
  using ( bucket_id = 'media' );

create policy "Service Role Full Access to Media Bucket"
  on storage.objects for all
  to service_role
  using ( bucket_id = 'media' )
  with check ( bucket_id = 'media' );

-- 2. Performance & High-Concurrency Indexes
create index if not exists idx_orders_order_number on orders (order_number);
create index if not exists idx_orders_customer_email on orders (customer_email);
create index if not exists idx_orders_created_at on orders (created_at desc);
create index if not exists idx_quotes_quote_number on quote_requests (quote_number);
create index if not exists idx_quotes_created_at on quote_requests (created_at desc);
create index if not exists idx_products_slug on products (slug);
create index if not exists idx_services_slug on workshop_services (slug);

-- 3. Lock down public SELECT on orders (Strict PII Protection)
-- All public order tracking is now handled securely and sanitized via server-side /api/tracking
drop policy if exists "public_read_order_tracking" on orders;

-- Ensure service_role has exclusive write & read access to orders and quotes
drop policy if exists "service_role_all_orders" on orders;
create policy "service_role_all_orders" on orders for all to service_role using (true) with check (true);

drop policy if exists "service_role_all_quotes" on quote_requests;
create policy "service_role_all_quotes" on quote_requests for all to service_role using (true) with check (true);

-- 4. Ensure site_settings has default record
insert into site_settings (id)
values ('main')
on conflict (id) do nothing;
