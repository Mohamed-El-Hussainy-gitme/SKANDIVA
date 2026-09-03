-- Migration 009: unified materials, tax settings, and catalog cleanup

-- Products use the reusable materials library only.
-- Existing embedded variants are intentionally removed after material_ids is populated.
alter table products drop column if exists variants;

alter table site_settings
  add column if not exists tax_enabled boolean not null default true,
  add column if not exists tax_rate numeric not null default 0.25;

update site_settings
set tax_enabled = coalesce(tax_enabled, true),
    tax_rate = coalesce(tax_rate, 0.25)
where id = 'main';
