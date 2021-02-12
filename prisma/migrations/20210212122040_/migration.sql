/*
  Warnings:

  - You are about to drop the column `amount` on the `Purchases` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Purchases` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Purchases" DROP COLUMN "amount",
DROP COLUMN "total",
ADD COLUMN     "shares" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "bitcoinsPerShare" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "bought" DECIMAL(65,30) NOT NULL DEFAULT 0;
