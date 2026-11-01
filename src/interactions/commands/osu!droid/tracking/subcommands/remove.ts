import { SlashCommand } from '@structures/core';
import { DroidHelper, InteractionHelper } from '@utils/helpers';
import { TrackingManager } from '@utils/managers';

export const remove: SlashCommand['run'] = async (client, interaction, strings) => {
  const user = (await DroidHelper.getUser(interaction))!;
  TrackingManager.deleteUser(user, interaction.guild!);
  InteractionHelper.replyOK(interaction, strings.commands.tracking.user_delete(user));
};
