-- CreateIndex
CREATE INDEX "ApplicantProfile_userId_idx" ON "ApplicantProfile"("userId");

-- CreateIndex
CREATE INDEX "Position_organisationId_idx" ON "Position"("organisationId");

-- CreateIndex
CREATE INDEX "UserRole_organisationId_idx" ON "UserRole"("organisationId");
