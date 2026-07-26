-- MeyGOD email subscribers
CREATE TABLE IF NOT EXISTS meygod_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE meygod_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert" ON meygod_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "service_read" ON meygod_subscribers FOR SELECT USING (true);
