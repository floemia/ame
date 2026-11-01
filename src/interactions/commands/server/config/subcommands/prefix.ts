import { AmeError } from '@core';
import { SlashCommand } from '@structures/core';
import { InteractionHelper } from '@utils/helpers';
import { DatabaseManager } from '@utils/managers';

export const prefix: SlashCommand['run'] = async (client, interaction, strings) => {
  const new_prefix = interaction.options.getString('prefix', true).trim();
  if (!new_prefix) throw new AmeError(strings.no_params);

  DatabaseManager.setGuildPrefix(interaction.guild!, new_prefix);
  await InteractionHelper.replyOK(interaction, strings.commands.config.prefix_set(new_prefix));
};
