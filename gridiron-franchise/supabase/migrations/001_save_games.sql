-- Save Games Table
-- Stores user game saves with 5 slots per user
-- Created: WO-SAVE-GAME-001

-- Create save_games table
CREATE TABLE IF NOT EXISTS save_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slot_number INTEGER NOT NULL CHECK (slot_number BETWEEN 1 AND 5),
  name TEXT NOT NULL DEFAULT 'Save Game',

  -- Game metadata for display
  team_id TEXT,
  team_name TEXT,
  season INTEGER DEFAULT 1,
  week INTEGER DEFAULT 1,

  -- Complete game state as JSONB
  game_data JSONB NOT NULL DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Ensure one save per slot per user
  UNIQUE(user_id, slot_number)
);

-- Create index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_save_games_user_id ON save_games(user_id);

-- Enable Row Level Security
ALTER TABLE save_games ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own saves

-- SELECT: Users can read their own saves
CREATE POLICY "Users can view own saves"
  ON save_games
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can create their own saves
CREATE POLICY "Users can create own saves"
  ON save_games
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own saves
CREATE POLICY "Users can update own saves"
  ON save_games
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can delete their own saves
CREATE POLICY "Users can delete own saves"
  ON save_games
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on save
CREATE TRIGGER update_save_games_updated_at
  BEFORE UPDATE ON save_games
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
