import { AmeError } from '@core';
import { MessageCommand } from '@structures/core';
import { ScoreContainerBuilder } from '@utils/builders';
import { DroidHelper } from '@utils/helpers';
import { CacheManager } from '@utils/managers';
import { TextDisplayBuilder } from 'discord.js';

export const data: MessageCommand['data'] = {
  name: 'recent',
  aliases: ['recent', 'r'],
};

export const run: MessageCommand['run'] = async (client, message, strings, args) => {
  const user = await DroidHelper.getUser(args[0] || message.author);
  if (!user) throw new AmeError(args[0] ? strings.user_dne : strings.no_link);

  const score = user.scores.recent[0];
  if (!score) throw new AmeError(strings.no_scores);

  const text = new TextDisplayBuilder().setContent(strings.commands.recent.success(user, 1));
  const container = await new ScoreContainerBuilder().setPlayer(user).setScore(score);
  if (score.beatmap) CacheManager.storeChannelBeatmap(message.channel, score.hash);

  await message.reply({
    components: [text, container],
    allowedMentions: { repliedUser: false },
    flags: 'IsComponentsV2',
  });
};
