-- ============================================================
-- Migration 006: Cumulative Production Update & Security Hardening
-- Project: Skandiva Tapetserarverkstad Stockholm
-- Safe, Idempotent Incremental Update for Existing Databases
-- ============================================================

-- 1. Ensure Column Name Consistency (base_price in products)
do $$
begin
  if exists (
    select 1 from information_schema.columns 
    where table_name = 'products' and column_name = 'baseprice'
  ) then
    alter table products rename column baseprice to base_price;
  end if;
end $$;

-- 2. Add site_settings CMS Table (if not exists)
create table if not exists site_settings (
  id text primary key default 'main',
  company_name text not null default 'Skandiva Tapetserarverkstad AB',
  org_number text not null default '559281-3942',
  phone text not null default '08-640 22 90',
  email text not null default 'kontakt@skandiva.se',
  address text not null default 'Åsögatan 142, 116 24 Södermalm, Stockholm',
  opening_hours text not null default 'Mån–Fre: 08:30 – 17:00 • Lör: Enligt tidsbokning',
  whatsapp_number text not null default '+4686402290',
  hero_headline text not null default 'Ge nytt liv åt svenska designklassiker.',
  hero_subtitle text not null default 'Professionell omklädsel och restaurering av Lamino, Bruno Mathsson och DUX.',
  hero_badge text not null default 'Stockholms Mästare i Möbelrestaurering sedan 2018',
  hero_image text not null default 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=2200&q=85',
  lamino_title text not null default 'LAMINO — OMKLÄDSEL MEST ÄLSKADE FÅTÖLJ',
  lamino_description text not null default 'Ge din klassiska Lamino-fåtölj ett nytt sekel med Skandivas Lamino Express-tjänst.',
  lamino_price numeric not null default 4900,
  lamino_image text not null default '/IMG_0948.png',
  before_after_title text not null default 'Se förvandlingen från sliten klassiker till nyskick.',
  before_after_description text not null default 'Dra i reglaget för att se hantverket.',
  fatolj_banner_title text not null default 'OMKLÄDSEL FÅTÖLJ',
  fatolj_banner_description text not null default 'Vi klär om fåtöljer.',
  fatolj_banner_image text not null default 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80',
  fatolj_banner_cta text not null default 'BEGÄR OFFERT FÖR FÅTÖLJ',
  soffa_banner_title text not null default 'OMKLÄDSEL SOFFA',
  soffa_banner_description text not null default 'Vi restaurerar och klär om soffor.',
  soffa_banner_image text not null default 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80',
  soffa_banner_cta text not null default 'BEGÄR OFFERT FÖR SOFFA',
  b2b_title text not null default 'Ska ni renovera 5+ möbler för ert kontor?',
  b2b_description text not null default 'Vi hjälper företag med cirkulär renovering.',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

insert into site_settings (id) values ('main') on conflict (id) do nothing;

-- 3. Add admin_users RBAC Table (if not exists)
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text default 'Tapetserarmästare',
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Storage Bucket Setup (Media)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- 5. Auto-admin registration trigger on auth.users
create or replace function public.handle_new_auth_admin()
returns trigger as $$
begin
  if (new.raw_app_meta_data->>'role' = 'admin' or new.raw_user_meta_data->>'role' = 'admin' or not exists (select 1 from public.admin_users)) then
    insert into public.admin_users (user_id, email, full_name, role, is_active)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data->>'full_name', 'Mästare'),
      'admin',
      true
    )
    on conflict (email) do update set
      user_id = new.id,
      is_active = true,
      updated_at = now();
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_admin on auth.users;
create trigger on_auth_user_created_admin
  after insert on auth.users
  for each row execute function public.handle_new_auth_admin();

-- 6. Enable RLS on All Tables
alter table delivery_zones enable row level security;
alter table products enable row level security;
alter table workshop_services enable row level security;
alter table orders enable row level security;
alter table quote_requests enable row level security;
alter table reviews enable row level security;
alter table site_settings enable row level security;
alter table admin_users enable row level security;

-- 7. Drop Obsolete / Loose Policies
drop policy if exists "Allow public read for products" on products;
drop policy if exists "Allow public read for services" on workshop_services;
drop policy if exists "Allow public read for delivery_zones" on delivery_zones;
drop policy if exists "Allow public read for reviews" on reviews;
drop policy if exists "Allow public read for site_settings" on site_settings;
drop policy if exists "Allow public tracking of orders" on orders;
drop policy if exists "public_read_order_tracking" on orders;
drop policy if exists "Allow public insert orders" on orders;
drop policy if exists "Allow public insert quotes" on quote_requests;
drop policy if exists "Allow full access for service_role products" on products;
drop policy if exists "Allow full access for service_role orders" on orders;
drop policy if exists "Allow full access for service_role quotes" on quote_requests;
drop policy if exists "service_role_all_products" on products;
drop policy if exists "service_role_all_orders" on orders;
drop policy if exists "service_role_all_quotes" on quote_requests;
drop policy if exists "service_role_all_services" on workshop_services;
drop policy if exists "service_role_all_delivery_zones" on delivery_zones;
drop policy if exists "service_role_all_reviews" on reviews;
drop policy if exists "service_role_all_site_settings" on site_settings;
drop policy if exists "service_role_all_admin_users" on admin_users;
drop policy if exists "public_read_products" on products;
drop policy if exists "public_read_workshop_services" on workshop_services;
drop policy if exists "public_read_delivery_zones" on delivery_zones;
drop policy if exists "public_read_reviews" on reviews;
drop policy if exists "public_read_site_settings" on site_settings;
drop policy if exists "public_insert_orders" on orders;
drop policy if exists "public_insert_quotes" on quote_requests;

-- 8. Strict Public Policies (SELECT and Safe Inserts)
create policy "public_read_products" on products for select using (true);
create policy "public_read_workshop_services" on workshop_services for select using (true);
create policy "public_read_delivery_zones" on delivery_zones for select using (true);
create policy "public_read_reviews" on reviews for select using (true);
create policy "public_read_site_settings" on site_settings for select using (true);
create policy "public_insert_orders" on orders for insert with check (true);
create policy "public_insert_quotes" on quote_requests for insert with check (true);

-- 9. Explicit Service Role Policies (ALL operations restricted to service_role)
create policy "service_role_all_products" on products for all to service_role using (true) with check (true);
create policy "service_role_all_services" on workshop_services for all to service_role using (true) with check (true);
create policy "service_role_all_delivery_zones" on delivery_zones for all to service_role using (true) with check (true);
create policy "service_role_all_orders" on orders for all to service_role using (true) with check (true);
create policy "service_role_all_quotes" on quote_requests for all to service_role using (true) with check (true);
create policy "service_role_all_reviews" on reviews for all to service_role using (true) with check (true);
create policy "service_role_all_site_settings" on site_settings for all to service_role using (true) with check (true);
create policy "service_role_all_admin_users" on admin_users for all to service_role using (true) with check (true);

-- 10. Storage Bucket Policies
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

-- 11. Performance Indexes
create index if not exists idx_orders_order_number on orders (order_number);
create index if not exists idx_orders_customer_email on orders (customer_email);
create index if not exists idx_orders_created_at on orders (created_at desc);
create index if not exists idx_quotes_quote_number on quote_requests (quote_number);
create index if not exists idx_quotes_created_at on quote_requests (created_at desc);
create index if not exists idx_products_slug on products (slug);
create index if not exists idx_services_slug on workshop_services (slug);
