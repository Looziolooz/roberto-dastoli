-- Add is_anonymous column to memories table
ALTER TABLE memories ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false;