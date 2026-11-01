import { SlashCommand } from '@structures/core';
import { InteractionHelper } from '@utils/helpers';
import { TrackingManager } from '@utils/managers';

export const status: SlashCommand['run'] = async (client, interaction, strings) => {
  const users = await TrackingManager.getUsers();
  return InteractionHelper.replyOK(
    interaction,
    strings.commands.ame.tracking.status(TrackingManager.running, users.length),
  );
};
