-- ===========================================================================
-- StateMentor database schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: uses "if not exists" and "on conflict do nothing".
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Mentors
-- Source of truth for the mentor directory when Google Sheets isn't connected.
-- Admin add/edit writes here via the service-role key.
-- ---------------------------------------------------------------------------
create table if not exists mentors (
  id text primary key,
  name text not null,
  instrument text not null,
  school text not null,
  bio text not null default '',
  years_in_all_state integer not null default 1,
  achievements text not null default '',
  teaching_areas text not null default '',
  session_price numeric not null default 0,
  profile_photo text not null default '',
  available_days text[] not null default '{}',
  available_times text[] not null default '{}',
  email text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table mentors enable row level security;

-- Public can read active mentors (defense-in-depth; the app reads server-side
-- with the service-role key, but this keeps anon reads safe too).
drop policy if exists "public can read active mentors" on mentors;
create policy "public can read active mentors"
  on mentors for select
  using (active = true);

-- ---------------------------------------------------------------------------
-- Bookings
-- ---------------------------------------------------------------------------
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  mentor_id text not null,
  student_name text not null,
  student_email text not null,
  student_instrument text not null,
  session_goals text,
  session_length integer not null,            -- 30 or 60
  session_date timestamptz not null,
  booking_status text not null default 'pending',  -- pending, confirmed, completed, cancelled
  payment_status text not null default 'unpaid',   -- unpaid, paid
  stripe_session_id text,
  created_at timestamptz default now()
);

alter table bookings enable row level security;
-- No public policies: all access goes through the server with the service-role key.

-- ---------------------------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------------------------
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  mentor_id text not null,
  booking_id uuid references bookings(id),
  rating integer not null check (rating between 1 and 5),
  review_text text,
  reviewer_name text not null,
  moderation_status text not null default 'pending',  -- pending, approved, hidden, deleted
  created_at timestamptz default now()
);

alter table reviews enable row level security;

drop policy if exists "public can read approved reviews" on reviews;
create policy "public can read approved reviews"
  on reviews for select
  using (moderation_status = 'approved');

-- ---------------------------------------------------------------------------
-- Mentor applications (from the "Become a Mentor" form)
-- ---------------------------------------------------------------------------
create table if not exists mentor_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  instrument text not null,
  school text not null,
  years_in_all_state integer not null,
  hourly_rate numeric,
  teaching_areas text,
  achievements text,
  available_days text[] default '{}',
  available_hours text,
  why text not null,
  created_at timestamptz default now()
);

alter table mentor_applications enable row level security;
-- No public policies: server-side inserts only.

-- If the table already existed from an earlier run, add the newer columns.
alter table mentor_applications add column if not exists hourly_rate numeric;
alter table mentor_applications add column if not exists teaching_areas text;
alter table mentor_applications add column if not exists achievements text;
alter table mentor_applications add column if not exists available_days text[] default '{}';
alter table mentor_applications add column if not exists available_hours text;

-- ---------------------------------------------------------------------------
-- Seed the directory with the starter mentors so the site isn't empty.
-- Edit or deactivate these from the admin dashboard. Re-running won't dupe.
-- ---------------------------------------------------------------------------
insert into mentors (id, name, instrument, school, bio, years_in_all_state, achievements, teaching_areas, session_price, profile_photo, available_days, available_times, email, active) values
  ('1', 'Sarah Chen', 'Violin', 'Lincoln High School', 'Three-time All-State violinist with a passion for helping students reach their full potential. I specialize in audition preparation and technique refinement.', 3, 'All-State Orchestra 2021, 2022, 2023; Youth Symphony Concertmaster', 'Audition preparation, bow technique, sight-reading', 60, '', '{Monday,Wednesday,Saturday}', '{"3:00 PM","4:00 PM","5:00 PM"}', 'sarah.chen@example.com', true),
  ('2', 'Marcus Williams', 'Trumpet', 'Roosevelt Academy', 'All-State Band trumpet player and jazz enthusiast. I help students develop strong fundamentals while making music fun and engaging.', 2, 'All-State Band 2022, 2023; Regional Jazz Soloist Award', 'Tone production, range building, jazz improv', 55, '', '{Tuesday,Thursday,Sunday}', '{"4:00 PM","5:00 PM","6:00 PM"}', 'marcus.williams@example.com', true),
  ('3', 'Priya Patel', 'Flute', 'Westbrook High', 'Passionate flutist who has competed at state and national levels. I focus on breath support, tone clarity, and musical expression.', 4, 'All-State Orchestra 2020-2023; National Flute Association Young Artist', 'Breath support, tone, intonation, expression', 65, '', '{Monday,Friday,Saturday}', '{"2:00 PM","3:00 PM","4:00 PM"}', 'priya.patel@example.com', true),
  ('4', 'James Rodriguez', 'Clarinet', 'Eastside High', 'Dedicated clarinet student with experience in classical and jazz styles. Helped over 10 students successfully make All-State.', 2, 'All-State Band 2022, 2023; District Solo & Ensemble Superior Rating', 'Scale fluency, reed selection, tone quality', 50, '', '{Wednesday,Thursday,Saturday}', '{"3:30 PM","5:00 PM","6:00 PM"}', 'james.rodriguez@example.com', true),
  ('5', 'Emma Thompson', 'Cello', 'Northview Academy', 'Cellist with deep orchestral experience. I work with students on shifting, vibrato, and orchestral excerpt preparation.', 3, 'All-State Orchestra 2021-2023; Youth Philharmonic Principal Cellist', 'Shifting, vibrato, bow distribution, orchestral excerpts', 70, '', '{Monday,Tuesday,Sunday}', '{"4:00 PM","5:00 PM","6:00 PM"}', 'emma.thompson@example.com', true),
  ('6', 'David Kim', 'Piano', 'Central Music Prep', 'Versatile pianist with classical training and strong theory background. I help students with repertoire, technique, and music theory.', 2, 'All-State Choir Accompanist 2022, 2023; State Piano Competition Finalist', 'Technique, repertoire selection, music theory, sight-reading', 75, '', '{Tuesday,Friday,Saturday}', '{"3:00 PM","4:00 PM","5:00 PM"}', 'david.kim@example.com', true),
  ('7', 'Aisha Johnson', 'Voice', 'Harmony Arts High', 'Soprano with All-State Choir experience. I specialize in vocal technique, diction, and performance anxiety management.', 3, 'All-State Choir 2021-2023; Regional Vocal Competition First Place', 'Vocal technique, diction, breath support, stage presence', 60, '', '{Monday,Wednesday,Saturday}', '{"2:00 PM","3:00 PM","4:00 PM"}', 'aisha.johnson@example.com', true),
  ('8', 'Tyler Nguyen', 'Saxophone', 'South Ridge High', 'Alto sax player with strong classical and jazz background. I focus on tone production, altissimo range, and audition etiquette.', 2, 'All-State Jazz Band 2022, 2023; Downbeat Student Music Award', 'Tone production, altissimo, jazz articulation, audition prep', 55, '', '{Thursday,Friday,Sunday}', '{"4:00 PM","5:00 PM","6:00 PM"}', 'tyler.nguyen@example.com', true)
on conflict (id) do nothing;
