-- ============================================================
-- Migration 002: Site Settings Table & Storage Configuration
-- Project: Skandiva Tapetserarverkstad Stockholm
-- ============================================================

-- 1. Site Settings CMS Table
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
  hero_subtitle text not null default 'Professionell omklädsel och restaurering av Lamino, Bruno Mathsson och DUX — utförd för hand på Södermalm med originalfårskinn från Skandilock och 5 års garanti.',
  hero_badge text not null default 'Stockholms Mästare i Möbelrestaurering sedan 2018',
  hero_image text not null default 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=2200&q=85',
  lamino_title text not null default 'LAMINO — OMKLÄDSEL MEST ÄLSKADE FÅTÖLJ',
  lamino_description text not null default 'Ge din klassiska Lamino-fåtölj ett nytt sekel med Skandivas Lamino Express-tjänst. Vi byter bärväv, spänner om konstruktionen och klär om med förstklassigt fårskinn från Skandilock i valfri kulör.',
  lamino_price numeric not null default 4900,
  lamino_image text not null default '/IMG_0948.png',
  before_after_title text not null default 'Se förvandlingen från sliten klassiker till nyskick.',
  before_after_description text not null default 'Dra i reglaget för att se hur en 50 år gammal designikon återfår sin ursprungliga spänst, komfort och skönhet i händerna på våra tapetserare.',
  fatolj_banner_title text not null default 'OMKLÄDSEL FÅTÖLJ',
  fatolj_banner_description text not null default 'Vi klär om fåtöljer där ergonomi, komfort och originalkänsla är lika avgörande som det estetiska. Från Pernilla och Jetson till antika länstolar.',
  fatolj_banner_image text not null default 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80',
  fatolj_banner_cta text not null default 'BEGÄR OFFERT FÖR FÅTÖLJ',
  soffa_banner_title text not null default 'OMKLÄDSEL SOFFA',
  soffa_banner_description text not null default 'Vi restaurerar och klär om soffor med fokus på hållbarhet och konstruktion. Byte av resårer, stoppning med tagel/kallskum och tyger från Kvadrat, Astrid och Romo.',
  soffa_banner_image text not null default 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80',
  soffa_banner_cta text not null default 'BEGÄR OFFERT FÖR SOFFA',
  b2b_title text not null default 'Ska ni renovera 5+ möbler för ert kontor?',
  b2b_description text not null default 'Vi hjälper företag och inredningsarkitekter med cirkulär renovering. Vi hämtar, renoverar och återlämnar med miljödeklaration för ert hållbarhetsarbete.',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert initial settings row if not present
insert into site_settings (id) values ('main') on conflict (id) do nothing;
