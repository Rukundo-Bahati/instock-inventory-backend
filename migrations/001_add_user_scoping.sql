-- Add isActive column to user table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT true;

-- Add createdBy column to item table
ALTER TABLE "item" ADD COLUMN IF NOT EXISTS "createdBy" uuid;

-- Add isActive and createdBy columns to category table
ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT true;
ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "createdBy" uuid;

-- Add isActive and createdBy columns to location table
ALTER TABLE "location" ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT true;
ALTER TABLE "location" ADD COLUMN IF NOT EXISTS "createdBy" uuid;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "idx_item_createdBy" ON "item"("createdBy");
CREATE INDEX IF NOT EXISTS "idx_category_createdBy" ON "category"("createdBy");
CREATE INDEX IF NOT EXISTS "idx_location_createdBy" ON "location"("createdBy");
CREATE INDEX IF NOT EXISTS "idx_movement_userId" ON "movement"("userId");
