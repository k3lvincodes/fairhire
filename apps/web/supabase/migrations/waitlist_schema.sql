-- Create the table if it doesn't exist
create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint waitlist_email_key unique (email)
);

-- Enable Row Level Security (RLS)
alter table waitlist enable row level security;

-- Create a policy to allow anyone to insert their email (public submission)
-- Check if policy exists before creating to make script idempotent (simplified for SQL editor)
drop policy if exists "Allow public inserts" on waitlist;
create policy "Allow public inserts"
on waitlist
for insert
to anon
with check (true);

-- Create a policy to allow only authenticated users (admins) to view the list
drop policy if exists "Allow admins to view" on waitlist;
create policy "Allow admins to view"
on waitlist
for select
to authenticated
using (true);

-- Explicitly deny update/delete for anon (default is deny, but good for clarity)
-- No policy needed as default is deny-all unless granted.
