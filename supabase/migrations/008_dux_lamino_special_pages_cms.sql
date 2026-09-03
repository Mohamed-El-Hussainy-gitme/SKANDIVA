-- ============================================================
-- Migration 008: DUX & Lamino dedicated page CMS fields
-- Project: Skandiva Tapetserarverkstad Stockholm
-- ============================================================

alter table products add column if not exists collection text not null default 'none';
alter table products add column if not exists material_ids jsonb not null default '[]'::jsonb;
alter table materials add column if not exists sort_order integer not null default 0;
create index if not exists products_collection_idx on products(collection);

alter table site_settings
  add column if not exists lamino_page_title text default 'Lamino Omklädsel i Fårskinn',
  add column if not exists lamino_page_subtitle text default 'Yngve Ekströms mästerverk förtjänar ett långt liv.',
  add column if not exists lamino_page_image text default '',
  add column if not exists lamino_process_title text default 'Så renoverar vi din Lamino',
  add column if not exists lamino_process_description text default 'Vi arbetar varsamt, med respekt för originalkonstruktionen och materialens livslängd.',
  add column if not exists dux_page_title text default 'DUX & Bruno Mathsson Omklädsel & Dynsatser',
  add column if not exists dux_page_subtitle text default 'Specialistverkstad för omklädsel och dynsatser i premiumläder.',
  add column if not exists dux_page_image text default '',
  add column if not exists dux_services_title text default 'Specialanpassad renovering efter originalmått',
  add column if not exists dux_services_description text default 'Vi bevarar konstruktionens originalkänsla med material och arbete anpassat efter varje möbel.';

update site_settings
set
  lamino_page_title = coalesce(lamino_page_title, 'Lamino Omklädsel i Fårskinn'),
  lamino_page_subtitle = coalesce(lamino_page_subtitle, 'Yngve Ekströms mästerverk förtjänar ett långt liv.'),
  lamino_page_image = coalesce(lamino_page_image, ''),
  lamino_process_title = coalesce(lamino_process_title, 'Så renoverar vi din Lamino'),
  lamino_process_description = coalesce(lamino_process_description, 'Vi arbetar varsamt, med respekt för originalkonstruktionen och materialens livslängd.'),
  dux_page_title = coalesce(dux_page_title, 'DUX & Bruno Mathsson Omklädsel & Dynsatser'),
  dux_page_subtitle = coalesce(dux_page_subtitle, 'Specialistverkstad för omklädsel och dynsatser i premiumläder.'),
  dux_page_image = coalesce(dux_page_image, ''),
  dux_services_title = coalesce(dux_services_title, 'Specialanpassad renovering efter originalmått'),
  dux_services_description = coalesce(dux_services_description, 'Vi bevarar konstruktionens originalkänsla med material och arbete anpassat efter varje möbel.')
where id = 'main';
