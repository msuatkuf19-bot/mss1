-- AlterTable: Add isUpdating column to restaurants
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "isUpdating" BOOLEAN NOT NULL DEFAULT false;
