import { SlashCommand } from '@structures/core';
import { DroidHelper, InteractionHelper } from '@utils/helpers';
import { TrackingManager } from '@utils/managers';

export const add: SlashCommand['run'] = async (client, interaction, strings) => {
  const user = await DroidHelper.getUser(interaction);
  TrackingManager.addUser(user, interaction.guild!);
  InteractionHelper.replyOK(interaction, strings.commands.tracking.user_add(user));
};
