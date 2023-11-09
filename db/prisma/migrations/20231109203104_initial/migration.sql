-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" JSONB NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estimate" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Estimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectEstimate" (
    "projectId" TEXT NOT NULL,
    "estimateId" TEXT NOT NULL,

    CONSTRAINT "ProjectEstimate_pkey" PRIMARY KEY ("projectId","estimateId")
);

-- AddForeignKey
ALTER TABLE "ProjectEstimate" ADD CONSTRAINT "ProjectEstimate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEstimate" ADD CONSTRAINT "ProjectEstimate_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
