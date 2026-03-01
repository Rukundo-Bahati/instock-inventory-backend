-- Add cost column to item table
ALTER TABLE "item" ADD COLUMN IF NOT EXISTS "cost" decimal(10,2) DEFAULT 0;
