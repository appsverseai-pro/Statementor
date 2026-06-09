create table bookings (
  id uuid primary key default gen_random_uuid(),
  mentor_id text not null,
  student_name text not null,
  student_email text not null,
  student_instrument text not null,
  session_goals text,
  session_length integer not null, -- 30 or 60
  session_date timestamptz not null,
  booking_status text not null default 'pending', -- pending, confirmed, completed, cancelled
  payment_status text not null default 'unpaid', -- unpaid, paid
  stripe_session_id text,
  created_at timestamptz default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  mentor_id text not null,
  booking_id uuid references bookings(id),
  rating integer not null check (rating between 1 and 5),
  review_text text,
  reviewer_name text not null,
  moderation_status text not null default 'pending', -- pending, approved, hidden, deleted
  created_at timestamptz default now()
);
