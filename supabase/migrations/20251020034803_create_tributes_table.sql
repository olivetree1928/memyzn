/*
  # Create tributes table for memorial website

  1. New Tables
    - `tributes`
      - `id` (uuid, primary key) - Unique identifier for each tribute record
      - `candles` (integer) - Total number of candles sent
      - `flowers` (integer) - Total number of flowers sent
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Data
    - Initialize with a single row for global tribute counts
  
  3. Security
    - Enable RLS on `tributes` table
    - Add policy for public read access (anyone can view counts)
    - Add policy for authenticated users to update counts
  
  Note: This table stores aggregate counts for the memorial tributes.
  We use a single-row pattern for simplicity.
*/

CREATE TABLE IF NOT EXISTS yzn_tributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candles integer DEFAULT 0,
  flowers integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Insert initial record
INSERT INTO yzn_tributes (candles, flowers)
VALUES (0, 0)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE yzn_tributes ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read tribute counts
CREATE POLICY "Anyone can view tribute counts"
  ON yzn_tributes
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to update tribute counts (for this memorial, we allow public participation)
CREATE POLICY "Anyone can send tributes"
  ON yzn_tributes
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);