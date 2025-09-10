/*
  Warnings:

  - A unique constraint covering the columns `[tvSeriesId,episodeNumber,seasonNumber]` on the table `TVEpisode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TVEpisode_tvSeriesId_episodeNumber_seasonNumber_key" ON "TVEpisode"("tvSeriesId", "episodeNumber", "seasonNumber");
