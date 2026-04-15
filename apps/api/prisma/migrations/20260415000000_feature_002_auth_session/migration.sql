-- CreateEnum
CREATE TYPE "IdentityRole" AS ENUM ('customer', 'barista', 'administrator');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "telegramId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "roles" "IdentityRole"[] NOT NULL DEFAULT ARRAY[]::"IdentityRole"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");
