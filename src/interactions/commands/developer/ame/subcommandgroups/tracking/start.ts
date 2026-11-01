import { SlashCommand } from '@structures/core';
import { InteractionHelper } from '@utils/helpers';
import { TrackingManager } from '@utils/managers';

export const start: SlashCommand['run'] = async (client, interaction, strings) => {
  if (TrackingManager.running)
    return InteractionHelper.replyOK(interaction, strings.commands.ame.tracking.already_running);

  TrackingManager.start().catch((error: Error) => {
    client.log({ type: 'error', prefix: 'TRACKING', message: error.stack ?? error.message });
  });
  return InteractionHelper.replyOK(interaction, strings.commands.ame.tracking.started);
};
