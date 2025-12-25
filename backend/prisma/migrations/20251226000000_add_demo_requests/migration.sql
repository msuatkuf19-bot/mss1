-- CreateEnum
CREATE TYPE "DemoRequestStatus" AS ENUM ('PENDING', 'CONTACTED', 'DEMO_CREATED', 'CANCELLED');

-- CreateTable
CREATE TABLE "demo_requests" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "restaurantType" TEXT NOT NULL,
    "tableCount" INTEGER NOT NULL,
    "status" "DemoRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "demo_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "demo_requests_status_idx" ON "demo_requests"("status");

-- CreateIndex
CREATE INDEX "demo_requests_createdAt_idx" ON "demo_requests"("createdAt");
