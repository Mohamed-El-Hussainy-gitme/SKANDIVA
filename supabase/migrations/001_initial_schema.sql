-- ============================================================
-- Migration 001: Initial Database Schema
-- Project: Skandiva Tapetserarverkstad Stockholm
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Schema Migrations Tracking Table
create table if not exists _schema_migrations (
  version text primary key,
  name text not null,
  applied_at timestamp with time zone default timezone('utc'::text, now()) not null,
  checksum text
);

-- 1. Delivery Zones Table
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

-- 2. Products Table (Restored Design Classics)
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

-- 3. Workshop Services Table (Bespoke Upholstery & Restoration)
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

-- 4. Orders Table (E-commerce & Workshop 5-Stage Pipeline)
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

-- 5. Quote Requests Table (B2B & Custom Furniture Quotes)
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

-- 6. Reviews Table (Verified Customer Testimonials)
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
