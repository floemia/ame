import { Event } from '@structures/core';
import { searchAndStoreBeatmapID } from './utils/searchBeatmapID';
import { EmojiHelper } from '@utils/helpers';

export const name = 'messageCreate';

export const run: Event<'messageCreate'>['run'] = async (client, message) => {
  const candidates = [message.content];
  if (message.embeds.length > 0) {
    const embed = message.embeds[0];
    candidates.push(embed.author ? embed.author.url || '' : '');
    candidates.push(embed.url || '');
  }
  if (candidates) searchAndStoreBeatmapID(candidates, message.channel);

  if (message.author.bot) return;

  if (message.content.toLowerCase() == 'ame') {
    try {
      message.react(EmojiHelper.toEmoji(client.config.emojis.ame)!);
    } catch {}
  }
};
