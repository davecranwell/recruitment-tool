-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN "sent" BOOLEAN NOT NULL DEFAULT false;
INSERT INTO "Organisation" (name, "machineName") VALUES ('root', 'root') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Invitation" (email,role,"organisationId") SELECT 'dave@davecranwell.com', 'ORGANISATION_OWNER', id FROM "Organisation"
