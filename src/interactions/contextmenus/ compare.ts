import { AmeError } from '@core';
import { ContextMenuCommand } from '@structures/core';
import { DroidHelper, InteractionHelper } from '@utils/helpers';
import { ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';

export const run: ContextMenuCommand['run'] = async (client, interaction, strings) => {
  const message = interaction.targetMessage;
  const beatmap = await DroidHelper.getBeatmapFromMessage(message);
  if (!beatmap) throw new AmeError(strings.commands.compare.no_map);
  const user = await DroidHelper.getUser(interaction.user);
  if (!user) throw new AmeError(strings.no_link);

  const scores = await user.getScores({ beatmapOrHash: beatmap, order: beatmap.approved == 1 ? 'pp' : 'score' });
  if (scores.length == 0) throw new AmeError(strings.commands.compare.no_score);

  await InteractionHelper.replyScore(interaction, user, scores[0], strings);
};

export const data: ContextMenuCommand['data'] = new ContextMenuCommandBuilder()
  .setName('compare with your score!')
  .setNameLocalization('es-ES', 'compara con tu score!')
  .setType(ApplicationCommandType.Message);
