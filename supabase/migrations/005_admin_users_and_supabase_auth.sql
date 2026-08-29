-- ============================================================
-- Migration 005: Supabase Auth Admin Users & Direct RBAC System
-- Project: Skandiva Tapetserarverkstad Stockholm
-- ============================================================

-- 1. Admin Users Table (Linked to Supabase auth.users)
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text default 'Tapetserarmästare',
  role text not null default 'admin', -- 'admin' or 'master_upholsterer'
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Row Level Security for admin_users
alter table admin_users enable row level security;

drop policy if exists "service_role_all_admin_users" on admin_users;
create policy "service_role_all_admin_users"
  on admin_users
  for all
  to service_role
  using (true)
  with check (true);

-- 3. Automatic Trigger to register Admin when created via Supabase Auth
create or replace function public.handle_new_auth_admin()
returns trigger as $$
begin
  -- If new user has role 'admin' in metadata or if admin_users is currently empty (first user)
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

-- 4. Helper function to check if an email or user is an active admin
create or replace function public.is_admin(user_email text)
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users
    where lower(email) = lower(user_email)
      and is_active = true
  );
end;
$$ language plpgsql security definer;
