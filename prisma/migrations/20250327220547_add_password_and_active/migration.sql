/*
  Warnings:

  - Added the required column `password` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tips" ADD COLUMN     "active" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "password" VARCHAR(255) NOT NULL;
