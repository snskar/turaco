-- CreateEnum
CREATE TYPE "HeartlinkRelation" AS ENUM ('COUPLE', 'FATHER', 'MOTHER', 'SISTER', 'BROTHER', 'FRIEND', 'OTHER');

-- CreateEnum
CREATE TYPE "HeartlinkOccasion" AS ENUM ('BIRTHDAY', 'NEW_YEAR', 'DIWALI', 'RAKSHA_BANDHAN', 'CHRISTMAS', 'VALENTINES', 'ANNIVERSARY', 'CONGRATULATIONS', 'GET_WELL_SOON', 'I_AM_SORRY', 'I_LOVE_YOU', 'OTHER');

-- CreateTable
CREATE TABLE "Heartlink" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "senderName" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "occasion" "HeartlinkOccasion" NOT NULL DEFAULT 'BIRTHDAY',
    "relation" "HeartlinkRelation" NOT NULL DEFAULT 'FRIEND',
    "message" TEXT,

    CONSTRAINT "Heartlink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "heartlinkId" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpotifyTrack" (
    "id" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artist" TEXT,
    "imageUrl" TEXT,
    "previewUrl" TEXT,
    "heartlinkId" TEXT NOT NULL,

    CONSTRAINT "SpotifyTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "heartlinkId" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compliment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "heartlinkId" TEXT NOT NULL,

    CONSTRAINT "Compliment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScratchCard" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "heartlinkId" TEXT NOT NULL,

    CONSTRAINT "ScratchCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Heartlink_slug_key" ON "Heartlink"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SpotifyTrack_heartlinkId_key" ON "SpotifyTrack"("heartlinkId");

-- CreateIndex
CREATE UNIQUE INDEX "ScratchCard_heartlinkId_key" ON "ScratchCard"("heartlinkId");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_heartlinkId_fkey" FOREIGN KEY ("heartlinkId") REFERENCES "Heartlink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotifyTrack" ADD CONSTRAINT "SpotifyTrack_heartlinkId_fkey" FOREIGN KEY ("heartlinkId") REFERENCES "Heartlink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_heartlinkId_fkey" FOREIGN KEY ("heartlinkId") REFERENCES "Heartlink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compliment" ADD CONSTRAINT "Compliment_heartlinkId_fkey" FOREIGN KEY ("heartlinkId") REFERENCES "Heartlink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScratchCard" ADD CONSTRAINT "ScratchCard_heartlinkId_fkey" FOREIGN KEY ("heartlinkId") REFERENCES "Heartlink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
