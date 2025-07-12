-- First, add the password column with a default value
ALTER TABLE "User" ADD COLUMN "password" TEXT NOT NULL DEFAULT 'temp_password_hash';

-- Remove the name column
ALTER TABLE "User" DROP COLUMN "name";

-- Update existing users with a proper hashed password
-- (You can either delete existing users or set a default password)
UPDATE "User" SET "password" = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK6.' WHERE "password" = 'temp_password_hash';

-- Remove the default constraint
ALTER TABLE "User" ALTER COLUMN "password" DROP DEFAULT;