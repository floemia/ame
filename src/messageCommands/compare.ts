import { AmeError } from '@core';
import { MessageCommand } from '@structures/core';
import { ScoreContainerBuilder } from '@utils/builders';
import { DroidHelper } from '@utils/helpers';
import { CacheManager } from '@utils/managers';
import { TextDisplayBuilder } from 'discord.js';

export const data: MessageCommand['data'] = {
  name: 'compare',
  aliases: ['compare', 'c', 'gap', 'mog'],
};

export const run: MessageCommand['run'] = async (client, message, strings, args) => {
  const user = await DroidHelper.getUser(args[0] || message.author);
  if (!user) throw new AmeError(strings.no_link);

  let beatmap: string | number | null = null;

  if (message.reference?.messageId) {
    const replied_message = await message.fetchReference().catch(() => undefined);
    if (replied_message) beatmap = DroidHelper.getBeatmapIDFromMessage(replied_message);
  }

  if (!beatmap) beatmap = CacheManager.getChannelBeatmap(message.channel) ?? null;
  if (!beatmap) throw new AmeError(strings.commands.compare.no_cache);

  const map = await DroidHelper.getBeatmap(beatmap);
  if (!map) throw new AmeError(strings.commands.compare.no_map);

  const scores = await user.getScores({ beatmapOrHash: map, order: map.approved == 1 ? 'pp' : 'score' });
  if (!scores || scores.length == 0) throw new AmeError(strings.commands.compare.no_score);

  const text = new TextDisplayBuilder().setContent(strings.commands.compare.success(user));
  const container = await new ScoreContainerBuilder().setPlayer(user).setScore(scores[0]);

  await message.reply({
    components: [text, container],
    allowedMentions: { repliedUser: false },
    flags: 'IsComponentsV2',
  });

  CacheManager.storeChannelBeatmap(message.channel, map.hash);
};
