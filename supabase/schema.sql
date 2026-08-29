-- ============================================================
-- Skandiva Tapetserarverkstad — PostgreSQL Schema for Supabase
-- ============================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Delivery Zones Table
create table if not exists delivery_zones (
  id text primary key,
  name text not null,
  description text,
  corridor_description text,
  surcharge numeric not null default 0,
  estimated_delivery_days text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Products Table
create table if not exists products (
  id text primary key,
  slug text unique not null,
  name text not null,
  designer text not null,
  model text not null,
  category text not null,
  category_name_swedish text not null,
  base_price numeric not null,
  description text not null,
  historical_context text,
  dimensions text,
  condition_grade text,
  provenance_crest_text text,
  stock_status text not null default 'i_lager',
  primary_image text not null,
  gallery_images jsonb default '[]'::jsonb,
  before_image text,
  after_image text,
  featured boolean default false,
  variants jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Workshop Services Table
create table if not exists workshop_services (
  id text primary key,
  slug text unique not null,
  name text not null,
  short_description text not null,
  full_description text not null,
  furniture_type text not null,
  applicable_models jsonb default '[]'::jsonb,
  is_fixed_price boolean default false,
  price_range_text text not null,
  base_price numeric not null default 0,
  turnaround_days integer default 14,
  turnaround_text text,
  primary_image text not null,
  before_after_pair jsonb,
  materials jsonb default '[]'::jsonb,
  addons jsonb default '[]'::jsonb,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Orders Table
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
  delivery_zone_id text,
  delivery_zone_name text,
  delivery_fee numeric default 0,
  subtotal numeric not null,
  tax_amount numeric not null,
  total_amount numeric not null,
  payment_method text not null,
  payment_status text not null default 'betald',
  status text not null default 'mottagen',
  items jsonb default '[]'::jsonb,
  tracking_events jsonb default '[]'::jsonb,
  estimated_completion_date text,
  workshop_notes text,
  assigned_upholsterer text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Quote Requests Table (Bespoke & B2B)
create table if not exists quote_requests (
  id text primary key,
  quote_number text unique not null,
  is_b2b boolean default false,
  company_name text,
  org_number text,
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

-- 7. Reviews Table
create table if not exists reviews (
  id text primary key,
  author text not null,
  location text,
  furniture_model text,
  rating integer not null check (rating between 1 and 5),
  text text not null,
  date text not null,
  verified_purchase boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Row Level Security (RLS)
alter table delivery_zones enable row level security;
alter table products enable row level security;
alter table workshop_services enable row level security;
alter table orders enable row level security;
alter table quote_requests enable row level security;
alter table reviews enable row level security;

-- Allow public read access to catalog, services, delivery zones, reviews
create policy "Allow public read for products" on products for select using (true);
create policy "Allow public read for services" on workshop_services for select using (true);
create policy "Allow public read for delivery_zones" on delivery_zones for select using (true);
create policy "Allow public read for reviews" on reviews for select using (true);

-- Allow public read for orders by order_number for order tracking
create policy "Allow public tracking of orders" on orders for select using (true);
-- Allow public insert of orders and quote requests
create policy "Allow public insert orders" on orders for insert with check (true);
create policy "Allow public insert quotes" on quote_requests for insert with check (true);

-- Allow service role full access
create policy "Allow full access for service_role products" on products using (true) with check (true);
create policy "Allow full access for service_role orders" on orders using (true) with check (true);
create policy "Allow full access for service_role quotes" on quote_requests using (true) with check (true);
