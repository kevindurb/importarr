import type { FC } from 'hono/jsx';
import { MatchPageState } from '@/app/validators/MatchPageState';
import { getMetadataForSourceFile, isTv } from '@/domain/metadata';
import { prisma } from '@/infrastructure/prisma';
import { tmdb } from '@/infrastructure/tmdb';

type Props = {
  fileId: string;
  tmdbId: number;
};

export const ChooseEpisodeStep: FC<Props> = async ({ fileId, tmdbId }) => {
  const file = await prisma.sourceFile.findUniqueOrThrow({ where: { id: fileId } });
  const metadata = getMetadataForSourceFile(file);
  const series = await tmdb.tvSeriesDetails({ seriesId: tmdbId });
  const seasons = await Promise.all(
    series.seasons?.map((season) =>
      tmdb.tvSeasonDetails({ seriesId: tmdbId, seasonNumber: season.season_number! }),
    ) ?? [],
  );

  let defaultValue: string | undefined;

  if (isTv(metadata) && metadata.seasons.length && metadata.episodeNumbers.length) {
    defaultValue = MatchPageState.shape.seasonEpisode.encode({
      season: metadata.seasons.at(0)!,
      episode: metadata.episodeNumbers.at(0)!,
    });
  }

  return (
    <form method='get' action={`/files/${fileId}/match`}>
      <input type='hidden' name='isTv' value={MatchPageState.shape.isTv.encode(true)} />
      <input type='hidden' name='tmdbId' value={MatchPageState.shape.tmdbId.encode(tmdbId)} />
      <h2 class='subtitle'>Choose Episode</h2>
      <div class='field has-addons'>
        <div class='control is-expanded'>
          <div class='select is-fullwidth'>
            <select required name='seasonEpisode'>
              {seasons.map((season) => (
                <optgroup label={`S${season.season_number}: ${season.name}`}>
                  {season.episodes?.map((episode) => {
                    const value = MatchPageState.shape.seasonEpisode.encode({
                      season: season.season_number!,
                      episode: episode.episode_number!,
                    });
                    return (
                      <option selected={value === defaultValue} value={value}>
                        E{episode.episode_number}: {episode.name}
                      </option>
                    );
                  })}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
        <div class='control'>
          <button type='submit' class='button is-primary'>
            Continue
          </button>
        </div>
      </div>
    </form>
  );
};
