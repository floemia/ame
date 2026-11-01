import { SlashCommand } from '@structures/core';
import { InteractionHelper } from '@utils/helpers';
import { TrackingManager } from '@utils/managers';

export const update: SlashCommand['run'] = async (client, interaction, strings) => {
  TrackingManager.update().catch((error: Error) => {
    client.log({ type: 'error', prefix: 'TRACKING', message: error.stack ?? error.message });
  });
  return InteractionHelper.replyOK(interaction, strings.commands.ame.tracking.updating);
};
