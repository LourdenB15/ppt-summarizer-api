/*
  Warnings:

  - You are about to drop the column `cloudinaryPublicId` on the `Presentation` table. All the data in the column will be lost.
  - You are about to drop the column `cloudinaryUrl` on the `Presentation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Presentation" DROP COLUMN "cloudinaryPublicId",
DROP COLUMN "cloudinaryUrl";
