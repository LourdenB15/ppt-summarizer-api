/*
  Warnings:

  - Added the required column `summaryDetail` to the `Presentation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SummaryDetail" AS ENUM ('SHORT', 'MEDIUM', 'DEEP_DIVE');

-- AlterTable
ALTER TABLE "Presentation" ADD COLUMN     "summaryDetail" "SummaryDetail" NOT NULL;
