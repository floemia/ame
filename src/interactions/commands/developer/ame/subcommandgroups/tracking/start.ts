import { SlashCommand } from '@structures/core';
import { InteractionHelper } from '@utils/helpers';
import { TrackingManager } from '@utils/managers';
import consola from 'consola';

export const start: SlashCommand['run'] = async (client, interaction, strings) => {
  if (TrackingManager.running)
    return InteractionHelper.replyOK(interaction, strings.commands.ame.tracking.already_running);

  TrackingManager.start().catch((error: Error) => {
    consola.withTag('TRACKING').error(error.stack ?? error.message);
  });
  return InteractionHelper.replyOK(interaction, strings.commands.ame.tracking.started);
};
