-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_two_factor_authentication_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "two_factor_authentication_secret" TEXT;
