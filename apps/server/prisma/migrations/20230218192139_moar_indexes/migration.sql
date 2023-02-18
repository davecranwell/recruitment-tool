-- CreateIndex
CREATE INDEX "Interview_positionId_idx" ON "Interview"("positionId");

-- CreateIndex
CREATE INDEX "Interview_applicantProfileId_idx" ON "Interview"("applicantProfileId");

-- CreateIndex
CREATE INDEX "InterviewAttendee_interviewId_idx" ON "InterviewAttendee"("interviewId");

-- CreateIndex
CREATE INDEX "ProjectUserRole_projectId_idx" ON "ProjectUserRole"("projectId");
