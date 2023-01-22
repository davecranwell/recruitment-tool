-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN "sent" BOOLEAN NOT NULL DEFAULT false;
INSERT INTO "Organisation" (id, name, "machineName") VALUES (1, 'root', 'root') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Invitation" (email,role,"organisationId") VALUES ('dave@davecranwell.com', 'ORGANISATION_OWNER', 1);
