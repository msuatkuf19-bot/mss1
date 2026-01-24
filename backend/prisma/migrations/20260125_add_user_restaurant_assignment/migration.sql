-- AlterTable: Add assignedRestaurantId to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "assignedRestaurantId" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "users_assignedRestaurantId_idx" ON "users"("assignedRestaurantId");

-- AddForeignKey (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_assignedRestaurantId_fkey'
    ) THEN
        ALTER TABLE "users" ADD CONSTRAINT "users_assignedRestaurantId_fkey" 
        FOREIGN KEY ("assignedRestaurantId") REFERENCES "restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
