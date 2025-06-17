-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];
