-- AlterTable: store admin-visible plain password for customer accounts
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "plainPassword" TEXT;
