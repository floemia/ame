import { DroidHelper } from '@utils/helpers';
import { CacheManager } from '@utils/managers';
import { TextBasedChannel } from 'discord.js';

/**
 * Stores the latest mentioned beatmap in a channel.
 * @param candidates List of strings that could contain a beatmap URL.
 */
export const searchAndStoreBeatmapID = (candidates: string[], channel: TextBasedChannel): void => {
  let id: number | null = null;
  let i = 0;
  for (const entry of candidates) {
    id = DroidHelper.getBeatmapId(entry);
    if (id) break;
    i++;
  }

  if (id) CacheManager.storeChannelBeatmap(channel, id);
};
