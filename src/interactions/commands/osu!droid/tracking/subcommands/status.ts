import { SlashCommand } from '@structures/core';
import { InteractionHelper } from '@utils/helpers';
import { DatabaseManager } from '@utils/managers';

export const status: SlashCommand['run'] = async (client, interaction, strings) => {
  const status = interaction.options.getString('status', true) == 'enabled' ? true : false;
  DatabaseManager.setGuildTrackingStatus(interaction.guild!, status);
  await InteractionHelper.replyOK(interaction, strings.commands.tracking.status_set(status));
};
