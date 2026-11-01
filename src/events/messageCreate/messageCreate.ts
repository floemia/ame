import { Event } from '@structures/core';
import { DroidHelper, EmojiHelper } from '@utils/helpers';
import { CacheManager } from '@utils/managers';

export const name = 'messageCreate';

export const run: Event<'messageCreate'>['run'] = async (client, message) => {
  const beatmap_id = DroidHelper.getBeatmapIDFromMessage(message);

  if (beatmap_id) {
    CacheManager.storeChannelBeatmap(message.channel, beatmap_id);
  }
  if (message.author.bot) return;

  if (message.content.toLowerCase() == 'ame') {
    try {
      message.react(EmojiHelper.getRandomAmeEmoji());
    } catch {}
  }
};
