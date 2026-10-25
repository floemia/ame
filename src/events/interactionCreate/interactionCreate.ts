import { Event } from '@structures/core';
import { CooldownHandler } from '@handlers';
import { InteractionHelper, LocalizationHelper } from '@utils/helpers';
import { AmeError } from '@structures/core/AmeError';

export const name = 'interactionCreate';

export const run: Event<'interactionCreate'>['run'] = async (client, interaction) => {
  const strings = LocalizationHelper.getLocaleStrings(interaction.locale);
  // is a slash command
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName) || client.dev_commands.get(interaction.commandName);
    if (!command) return;
    CooldownHandler.addCommand(command);
    const time_left = CooldownHandler.timeLeft(command, interaction.user);
    if (time_left > 0) return InteractionHelper.replyCooldown(interaction, time_left, strings);

    try {
      await interaction.deferReply();
      await command.run(client, interaction, strings);
    } catch (error: any) {
      if (error instanceof AmeError) {
        return InteractionHelper.replyError(interaction, error.message);
      }
      client.log({ type: 'error', message: error.stack });
      return InteractionHelper.replyError(interaction, strings.error);
    }
  }
};
