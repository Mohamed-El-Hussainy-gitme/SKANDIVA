-- ============================================================
-- Skandiva Tapetserarverkstad — PostgreSQL Schema for Supabase
-- ============================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Products Table
create table if not exists products (
  id text primary key,
  slug text unique not null,
  name text not null,
  designer text not null,
  model text not null,
  category text not null,
  category_name_swedish text not null,
  collection text not null default 'none',
  base_price numeric not null,
  description text not null,
  historical_context text,
  dimensions text,
  condition_grade text,
  provenance_crest_text text,
  stock_status text not null default 'i_lager',
  primary_image text not null,
  gallery_images jsonb default '[]'::jsonb,
  material_ids jsonb not null default '[]'::jsonb,
  before_image text,
  after_image text,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Reusable Material Library
create table if not exists materials (
  id text primary key,
  name text not null,
  material_type text not null,
  color_hex text,
  image_url text not null,
  price numeric not null default 0,
  supplier text,
  description text,
  sort_order integer not null default 0,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Orders Table
create table if not exists orders (
  id text primary key,
  order_number text unique not null,
  order_type text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_address text not null,
  customer_postal_code text not null,
  customer_city text not null,
  subtotal numeric not null,
  tax_amount numeric not null,
  total_amount numeric not null,
  payment_method text not null,
  payment_status text not null default 'betald',
  status text not null default 'mottagen',
  items jsonb default '[]'::jsonb,
  estimated_completion_date text,
  workshop_notes text,
  assigned_upholsterer text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Quote Requests Table
create table if not exists quote_requests (
  id text primary key,
  quote_number text unique not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  furniture_type text not null,
  designer_model text,
  number_of_pieces integer default 1,
  fabric_preference text,
  current_condition_description text,
  dimensions text,
  images jsonb default '[]'::jsonb,
  status text not null default 'ny',
  quoted_price numeric,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Site Settings CMS
create table if not exists site_settings (
  id text primary key default 'main',
  company_name text not null default 'Skandiva Tapetserarverkstad AB',
  org_number text not null default '559281-3942', phone text not null default '08-640 22 90',
  email text not null default 'kontakt@skandiva.se', address text not null default 'Åsögatan 142, 116 24 Södermalm, Stockholm',
  opening_hours text not null default 'Mån-Fre: 08:30 - 17:00', whatsapp_number text not null default '+4686402290',
  hero_headline text not null default 'Ge nytt liv åt svenska designklassiker.', hero_subtitle text not null default '', hero_badge text not null default '', hero_image text not null default '',
  lamino_title text not null default 'Lamino', lamino_description text not null default '', lamino_price numeric not null default 4900, lamino_image text not null default '',
  before_after_title text not null default 'Före & Efter', before_after_description text not null default '',
  fatolj_banner_title text not null default 'Omklädsel fåtölj', fatolj_banner_description text not null default '', fatolj_banner_image text not null default '', fatolj_banner_cta text not null default 'Begär offert',
  soffa_banner_title text not null default 'Omklädsel soffa', soffa_banner_description text not null default '', soffa_banner_image text not null default '', soffa_banner_cta text not null default 'Begär offert',
  b2b_title text not null default '', b2b_description text not null default '',
  about_title text not null default 'Om Skandiva', about_description text not null default '', about_image text not null default '',
  lamino_page_title text default 'Lamino Omklädsel i Fårskinn', lamino_page_subtitle text default '', lamino_page_image text default '', lamino_process_title text default 'Så renoverar vi din Lamino', lamino_process_description text default '',
  dux_page_title text default 'DUX & Bruno Mathsson', dux_page_subtitle text default '', dux_page_image text default '', dux_services_title text default 'Specialanpassad renovering', dux_services_description text default '',
  tax_enabled boolean not null default true, tax_rate numeric not null default 0.25,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
insert into site_settings (id) values ('main') on conflict (id) do nothing;

-- 7. Row Level Security (RLS)
alter table products enable row level security;
alter table materials enable row level security;
alter table orders enable row level security;
alter table quote_requests enable row level security;

-- Allow public read access to catalog and active materials
create policy "Allow public read for products" on products for select using (true);
create policy "Allow public read for active materials" on materials for select using (active = true);
create policy "Allow full access for service_role materials" on materials using (true) with check (true);

-- Allow public read for orders by order_number for order tracking
create policy "Allow public tracking of orders" on orders for select using (true);
-- Allow public insert of orders and quote requests
create policy "Allow public insert orders" on orders for insert with check (true);
create policy "Allow public insert quotes" on quote_requests for insert with check (true);

-- Allow service role full access
create policy "Allow full access for service_role products" on products using (true) with check (true);
create policy "Allow full access for service_role orders" on orders using (true) with check (true);
create policy "Allow full access for service_role quotes" on quote_requests using (true) with check (true);
