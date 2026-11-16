import { SlashCommand } from '@structures/core';
import { InteractionHelper } from '@utils/helpers';
import { TrackingManager } from '@utils/managers';
import consola from 'consola';

export const update: SlashCommand['run'] = async (client, interaction, strings) => {
  TrackingManager.update().catch((error: Error) => {
    consola.withTag('TRACKING').error(error.stack ?? error.message);
  });
  return InteractionHelper.replyOK(interaction, strings.commands.ame.tracking.updating);
};
