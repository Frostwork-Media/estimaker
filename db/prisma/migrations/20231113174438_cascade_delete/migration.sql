-- DropForeignKey
ALTER TABLE "ProjectEstimate" DROP CONSTRAINT "ProjectEstimate_estimateId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectEstimate" DROP CONSTRAINT "ProjectEstimate_projectId_fkey";

-- AddForeignKey
ALTER TABLE "ProjectEstimate" ADD CONSTRAINT "ProjectEstimate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEstimate" ADD CONSTRAINT "ProjectEstimate_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
