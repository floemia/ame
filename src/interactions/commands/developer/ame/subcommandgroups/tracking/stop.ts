import { SlashCommand } from '@structures/core';
import { InteractionHelper } from '@utils/helpers';
import { TrackingManager } from '@utils/managers';

export const stop: SlashCommand['run'] = async (client, interaction, strings) => {
  TrackingManager.stop();
  return InteractionHelper.replyOK(interaction, strings.commands.ame.tracking.stopped);
};
