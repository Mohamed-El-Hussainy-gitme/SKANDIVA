-- ============================================================
-- Migration 007: Restructure Catalog and Removals
-- Project: Skandiva Tapetserarverkstad Stockholm
-- ============================================================

-- 1. Drop unused tables
drop table if exists delivery_zones cascade;
drop table if exists reviews cascade;
drop table if exists workshop_services cascade;

-- 2. Modify orders table
-- Remove delivery and tracking fields
alter table orders 
  drop column if exists delivery_zone_id,
  drop column if exists delivery_zone_name,
  drop column if exists delivery_fee,
  drop column if exists tracking_events;
-- tax_amount is kept based on Q1

-- 3. Modify quote_requests table
-- Remove B2B fields
alter table quote_requests
  drop column if exists is_b2b,
  drop column if exists company_name,
  drop column if exists org_number;

-- 4. Create Materials Table for Leather/Fabric swatches
create table if not exists materials (
  id text primary key,
  name text not null,
  material_type text not null, -- 'leather', 'fabric'
  color_hex text,
  image_url text not null, -- Actual swatch image (Required for Zoom/Lightbox)
  price numeric not null default 0,
  supplier text,
  description text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for materials
alter table materials enable row level security;
create policy "public_read_materials" on materials for select using (true);
create policy "service_role_all_materials" on materials for all to service_role using (true) with check (true);

-- 5. Create CMS tables for Galleri
create table if not exists gallery_items (
  id text primary key,
  title text not null,
  description text,
  before_image text not null,
  after_image text not null,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for gallery
alter table gallery_items enable row level security;
create policy "public_read_gallery" on gallery_items for select using (true);
create policy "service_role_all_gallery" on gallery_items for all to service_role using (true) with check (true);

-- 6. Add About Us fields to site_settings
alter table site_settings
  add column if not exists about_title text default 'Om Skandiva Tapetserarverkstad',
  add column if not exists about_description text default 'Vi är en möbeltapetserarverkstad i hjärtat av Södermalm.',
  add column if not exists about_image text default '';
