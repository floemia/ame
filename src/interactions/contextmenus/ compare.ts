import { AmeError } from '@core';
import { ContextMenuCommand } from '@structures/core';
import { DroidHelper, InteractionHelper } from '@utils/helpers';
import { ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';

export const run: ContextMenuCommand['run'] = async (client, interaction, strings) => {
  await interaction.deferReply();
  const message = interaction.targetMessage;
  const beatmap = await DroidHelper.getBeatmapFromMessage(message);
  if (!beatmap) throw new AmeError(strings.commands.compare.no_map);
  const user = await DroidHelper.getUser(interaction.user);
  if (!user) throw new AmeError(strings.no_link);

  const score = await DroidHelper.compare(user, beatmap);
  if (!score) throw new AmeError(strings.commands.compare.no_score);

  await InteractionHelper.replyScore(interaction, user, score, strings);
};

export const data: ContextMenuCommand['data'] = new ContextMenuCommandBuilder()
  .setName('compare with your score!')
  .setNameLocalization('es-ES', 'compara con tu score!')
  .setType(ApplicationCommandType.Message);
