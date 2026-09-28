-- Migration 002: Add image_url to categories
-- Created: 2026-09-28

ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
