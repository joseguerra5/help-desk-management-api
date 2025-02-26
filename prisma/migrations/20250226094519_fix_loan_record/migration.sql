/*
  Warnings:

  - You are about to drop the column `cooperatorId` on the `equipments` table. All the data in the column will be lost.
  - Made the column `ocurred_at` on table `loan_records` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "equipments" DROP CONSTRAINT "equipments_cooperatorId_fkey";

-- AlterTable
ALTER TABLE "equipments" DROP COLUMN "cooperatorId",
ADD COLUMN     "cooperator_id" TEXT;

-- AlterTable
ALTER TABLE "loan_records" ALTER COLUMN "ocurred_at" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_cooperator_id_fkey" FOREIGN KEY ("cooperator_id") REFERENCES "cooperators"("id") ON DELETE SET NULL ON UPDATE CASCADE;
